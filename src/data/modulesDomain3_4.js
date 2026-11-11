
export const modulesDomain3_4 = [
  // DOMAIN 3: COMMUNICATION (21-30)
  {
    id: 21,
    code: 'MOD-021',
    name: 'Messaging',
    slug: 'messaging',
    category: 'Communication',
    phase: 3,
    iconName: 'Mail',
    purpose: 'Private 1-on-1 conversations, thread storage, end-to-end read states, and cryptographic attachments.',
    responsibilities: [
      'Manage conversation participant state and unread badge counters',
      'Store encrypted direct messages and attachments',
      'Emit real-time message read receipts and typing notifications'
    ],
    databaseTables: [
      {
        name: 'conversations',
        description: 'Direct communication threads.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'uuid', type: 'CHAR(36)', nullable: false, index: true },
          { name: 'type', type: 'ENUM("direct","group")', nullable: false },
          { name: 'last_message_at', type: 'TIMESTAMP', nullable: true }
        ],
        indexes: ['conv_uuid_unique']
      },
      {
        name: 'messages',
        description: 'Individual message payloads.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [
          { column: 'conversation_id', references: 'id', table: 'conversations' },
          { column: 'sender_id', references: 'id', table: 'users' }
        ],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'conversation_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'sender_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'body', type: 'TEXT', nullable: false },
          { name: 'is_read', type: 'BOOLEAN', nullable: false }
        ],
        indexes: ['idx_msg_conv_time']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/messages/threads', description: 'List user conversations', authRequired: true },
      { method: 'POST', path: '/api/v1/messages/threads', description: 'Send direct message', authRequired: true }
    ],
    services: ['DirectMessagingService', 'ConversationReceiptService'],
    permissions: ['messaging.send', 'messaging.archive'],
    events: ['MessageSent', 'MessageRead'],
    jobs: ['DeliverPushNotificationJob'],
    dependencies: [1],
    tests: ['MessageDeliveryTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\Messaging\\Http\\Controllers;

use App\\Modules\\Messaging\\Services\\DirectMessagingService;
use App\\Modules\\Messaging\\Requests\\SendMessageRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class MessagingController extends Controller
{
    public function __construct(
        private readonly DirectMessagingService $messagingService
    ) {}

    public function index(): JsonResponse
    {
        $conversations = $this->messagingService->getUserConversations(auth()->id());

        return response()->json([
            'success' => true,
            'data' => $conversations,
        ]);
    }

    public function store(SendMessageRequest $request): JsonResponse
    {
        $message = $this->messagingService->sendDirectMessage(
            senderId: auth()->id(),
            recipientId: $request->validated('recipient_id'),
            body: $request->validated('body'),
        );

        return response()->json([
            'success' => true,
            'data' => $message,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Modules\\Messaging\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Concerns\\HasUuid;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Conversation extends Model
{
    use HasFactory, SoftDeletes, HasUuid;

    protected $table = 'conversations';

    protected $fillable = [
        'uuid',
        'type',
        'last_message_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => 'string',
            'last_message_at' => 'datetime',
        ];
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function participants(): HasMany
    {
        return $this->hasMany(ConversationParticipant::class);
    }
}`,
      service: `<?php

namespace App\\Modules\\Messaging\\Services;

use App\\Modules\\Messaging\\Models\\Conversation;
use App\\Modules\\Messaging\\Models\\Message;
use App\\Modules\\Messaging\\Events\\MessageSent;
use App\\Modules\\Messaging\\Events\\MessageRead;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Collection;

class DirectMessagingService
{
    public function getUserConversations(int $userId): Collection
    {
        return Conversation::whereHas('participants', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->with(['lastMessage', 'participants.user'])
            ->orderBy('last_message_at', 'desc')
            ->get();
    }

    public function sendDirectMessage(int $senderId, int $recipientId, string $body): Message
    {
        return DB::transaction(function () use ($senderId, $recipientId, $body) {
            $conversation = $this->findOrCreateConversation($senderId, $recipientId);

            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $senderId,
                'body' => $body,
                'is_read' => false,
            ]);

            $conversation->update(['last_message_at' => now()]);

            event(new MessageSent($message));

            return $message->load('sender');
        });
    }

    public function markAsRead(int $messageId, int $userId): void
    {
        $message = Message::findOrFail($messageId);

        if ($message->conversation->participants()->where('user_id', $userId)->exists()) {
            $message->update(['is_read' => true]);
            event(new MessageRead($message));
        }
    }

    private function findOrCreateConversation(int $senderId, int $recipientId): Conversation
    {
        $participantIds = collect([$senderId, $recipientId])->sort()->values();

        $conversation = Conversation::where('type', 'direct')
            ->whereHas('participants', function ($query) use ($participantIds) {
                $query->whereIn('user_id', $participantIds);
            }, '>=', $participantIds->count())
            ->first();

        if (! $conversation) {
            $conversation = Conversation::create([
                'uuid' => \\Illuminate\\Support\\Str::uuid(),
                'type' => 'direct',
                'last_message_at' => now(),
            ]);

            foreach ($participantIds as $userId) {
                $conversation->participants()->create(['user_id' => $userId]);
            }
        }

        return $conversation;
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\Messaging\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'recipient_id' => ['required', 'integer', 'exists:users,id'],
            'body' => ['required', 'string', 'max:5000'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->enum('type', ['direct', 'group']);
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('uuid', 'conv_uuid_unique');
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users');
            $table->text('body');
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            $table->index(['conversation_id', 'created_at'], 'idx_msg_conv_time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
    }
};`,
      policy: `<?php

namespace App\\Modules\\Messaging\\Policies;

use App\\Modules\\Messaging\\Models\\Conversation;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class MessagePolicy
{
    use HandlesAuthorization;

    public function view(User $user, Conversation $conversation): bool
    {
        return $conversation->participants()->where('user_id', $user->id)->exists()
            || $user->hasPermission('messaging.archive');
    }

    public function send(User $user): bool
    {
        return $user->hasPermission('messaging.send');
    }

    public function archive(User $user, Conversation $conversation): bool
    {
        return $user->hasPermission('messaging.archive')
            || $conversation->participants()->where('user_id', $user->id)->exists();
    }
}`
    },
    sampleRecords: [
      { id: 701, sender: 'Alex Chen', recipient: 'Sarah Connor', body: 'Ready to review the Phase 1 PR?', time: '5m ago', is_read: true }
    ],
    status: 'Configured'
  },
  {
    id: 22,
    code: 'MOD-022',
    name: 'Chat Management',
    slug: 'chat-management',
    category: 'Communication',
    phase: 3,
    iconName: 'MessageSquare',
    purpose: 'Real-time WebSocket channels, group chat rooms, ephemeral presence, and typing telemetry.',
    responsibilities: [
      'Maintain Redis presence hashes for online/offline state',
      'Broadcast real-time WebSocket events via Laravel Reverb / Pusher',
      'Archive channel chat logs with retention policies'
    ],
    databaseTables: [
      {
        name: 'chat_rooms',
        description: 'Persistent real-time chat channels.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'name', type: 'VARCHAR(128)', nullable: false },
          { name: 'is_private', type: 'BOOLEAN', nullable: false },
          { name: 'max_members', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['idx_chat_room_name']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/chat/rooms', description: 'Fetch available rooms', authRequired: true },
      { method: 'POST', path: '/api/v1/chat/rooms/{id}/join', description: 'Join chat channel', authRequired: true }
    ],
    services: ['RealtimeChatService', 'PresenceTrackerService'],
    permissions: ['chat.join', 'chat.broadcast'],
    events: ['UserEnteredChatRoom', 'UserTypingBroadcasted'],
    jobs: ['FlushInactivePresenceJob'],
    dependencies: [1, 21],
    tests: ['PresenceTrackerTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\ChatManagement\\Http\\Controllers;

use App\\Modules\\ChatManagement\\Services\\RealtimeChatService;
use App\\Modules\\ChatManagement\\Requests\\JoinRoomRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class ChatController extends Controller
{
    public function __construct(
        private readonly RealtimeChatService $chatService
    ) {}

    public function index(): JsonResponse
    {
        $rooms = $this->chatService->getAvailableRooms();

        return response()->json([
            'success' => true,
            'data' => $rooms,
        ]);
    }

    public function join(JoinRoomRequest $request, int $id): JsonResponse
    {
        $result = $this->chatService->joinRoom(
            roomId: $id,
            userId: auth()->id(),
        );

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}`,
      model: `<?php

namespace App\\Modules\\ChatManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class ChatRoom extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'chat_rooms';

    protected $fillable = [
        'name',
        'is_private',
        'max_members',
    ];

    protected function casts(): array
    {
        return [
            'is_private' => 'boolean',
            'max_members' => 'integer',
        ];
    }

    public function members(): HasMany
    {
        return $this->hasMany(ChatRoomMember::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function isFull(): bool
    {
        return $this->members()->count() >= $this->max_members;
    }
}`,
      service: `<?php

namespace App\\Modules\\ChatManagement\\Services;

use App\\Modules\\ChatManagement\\Models\\ChatRoom;
use App\\Modules\\ChatManagement\\Models\\ChatRoomMember;
use App\\Modules\\ChatManagement\\Events\\UserEnteredChatRoom;
use App\\Modules\\ChatManagement\\Events\\UserTypingBroadcasted;
use Illuminate\\Support\\Collection;
use Illuminate\\Support\\Facades\\Redis;

class RealtimeChatService
{
    public function getAvailableRooms(): Collection
    {
        return ChatRoom::withCount('members')
            ->orderBy('name')
            ->get();
    }

    public function joinRoom(int $roomId, int $userId): array
    {
        $room = ChatRoom::findOrFail($roomId);

        if ($room->isFull()) {
            abort(422, 'Chat room has reached maximum capacity.');
        }

        $member = ChatRoomMember::firstOrCreate(
            ['chat_room_id' => $roomId, 'user_id' => $userId],
            ['joined_at' => now()]
        );

        Redis::hset("presence:room:{$roomId}", $userId, json_encode([
            'status' => 'online',
            'joined_at' => now()->toISOString(),
        ]));

        event(new UserEnteredChatRoom($room, $userId));

        return [
            'room' => $room,
            'member' => $member,
            'presence_count' => Redis::hlen("presence:room:{$roomId}"),
        ];
    }

    public function trackTyping(int $roomId, int $userId): void
    {
        event(new UserTypingBroadcasted($roomId, $userId));
    }

    public function getOnlineUsers(int $roomId): array
    {
        $presence = Redis::hgetall("presence:room:{$roomId}");

        return collect($presence)
            ->map(fn ($data) => json_decode($data, true))
            ->toArray();
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\ChatManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class JoinRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name', 128);
            $table->boolean('is_private')->default(false);
            $table->unsignedInteger('max_members')->default(100);
            $table->timestamps();
            $table->softDeletes();

            $table->index('name', 'idx_chat_room_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_rooms');
    }
};`,
      policy: `<?php

namespace App\\Modules\\ChatManagement\\Policies;

use App\\Modules\\ChatManagement\\Models\\ChatRoom;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class ChatPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function join(User $user, ChatRoom $chatRoom): bool
    {
        return $user->hasPermission('chat.join');
    }

    public function broadcast(User $user, ChatRoom $chatRoom): bool
    {
        return $user->hasPermission('chat.broadcast')
            && $chatRoom->members()->where('user_id', $user->id)->exists();
    }
}`
    },
    sampleRecords: [
      { id: 1, name: '#general-architecture', online_count: 34, topic: 'Modular monolith standards' }
    ],
    status: 'Configured'
  },
  {
    id: 23,
    code: 'MOD-023',
    name: 'Video Conferencing',
    slug: 'video-conferencing',
    category: 'Communication',
    phase: 3,
    iconName: 'Video',
    purpose: 'Online video meetings, WebRTC peer mesh orchestration, room token dispatch, and screen sharing.',
    responsibilities: [
      'Generate ephemeral HMAC signed meeting access tokens',
      'Maintain meeting state (Active, Waiting Room, Ended)',
      'Record conference duration and participant logs'
    ],
    databaseTables: [
      {
        name: 'video_rooms',
        description: 'Video meeting sessions.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'host_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'room_code', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'host_id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'is_active', type: 'BOOLEAN', nullable: false },
          { name: 'max_participants', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['room_code_unique']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/video/rooms', description: 'Schedule or start video room', authRequired: true },
      { method: 'POST', path: '/api/v1/video/rooms/{code}/token', description: 'Obtain WebRTC token', authRequired: true }
    ],
    services: ['VideoSessionService', 'WebRtcTokenService'],
    permissions: ['video.host', 'video.join'],
    events: ['MeetingStarted', 'MeetingEnded'],
    jobs: ['RecordMeetingMetricsJob'],
    dependencies: [1],
    tests: ['VideoTokenSecurityTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\VideoConferencing\\Http\\Controllers;

use App\\Modules\\VideoConferencing\\Services\\VideoSessionService;
use App\\Modules\\VideoConferencing\\Services\\WebRtcTokenService;
use App\\Modules\\VideoConferencing\\Requests\\CreateRoomRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class VideoController extends Controller
{
    public function __construct(
        private readonly VideoSessionService $sessionService,
        private readonly WebRtcTokenService $tokenService,
    ) {}

    public function store(CreateRoomRequest $request): JsonResponse
    {
        $room = $this->sessionService->createRoom(
            hostId: auth()->id(),
            data: $request->validated(),
        );

        return response()->json([
            'success' => true,
            'data' => $room,
        ], 201);
    }

    public function token(string $code): JsonResponse
    {
        $token = $this->tokenService->generateToken(
            roomCode: $code,
            userId: auth()->id(),
        );

        return response()->json([
            'success' => true,
            'data' => $token,
        ]);
    }
}`,
      model: `<?php

namespace App\\Modules\\VideoConferencing\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class VideoRoom extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'video_rooms';

    protected $fillable = [
        'room_code',
        'host_id',
        'is_active',
        'max_participants',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'max_participants' => 'integer',
        ];
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(VideoParticipant::class);
    }

    public function isFull(): bool
    {
        return $this->participants()->count() >= $this->max_participants;
    }

    public function end(): void
    {
        $this->update(['is_active' => false]);
    }
}`,
      service: `<?php

namespace App\\Modules\\VideoConferencing\\Services;

use App\\Modules\\VideoConferencing\\Models\\VideoRoom;
use App\\Modules\\VideoConferencing\\Events\\MeetingStarted;
use App\\Modules\\VideoConferencing\\Events\\MeetingEnded;
use Illuminate\\Support\\Str;
use Illuminate\\Support\\Facades\\DB;

class VideoSessionService
{
    public function createRoom(int $hostId, array $data): VideoRoom
    {
        return DB::transaction(function () use ($hostId, $data) {
            $room = VideoRoom::create([
                'room_code' => strtoupper(Str::random(8)),
                'host_id' => $hostId,
                'is_active' => true,
                'max_participants' => $data['max_participants'] ?? 10,
            ]);

            event(new MeetingStarted($room));

            return $room;
        });
    }

    public function endRoom(string $roomCode): VideoRoom
    {
        $room = VideoRoom::where('room_code', $roomCode)
            ->where('host_id', auth()->id())
            ->firstOrFail();

        DB::transaction(function () use ($room) {
            $room->end();
            $room->participants()->delete();
            event(new MeetingEnded($room));
        });

        return $room->fresh();
    }

    public function getActiveRooms()
    {
        return VideoRoom::where('is_active', true)
            ->withCount('participants')
            ->get();
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\VideoConferencing\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'max_participants' => ['sometimes', 'integer', 'min:2', 'max:100'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('video_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_code', 32)->unique();
            $table->foreignId('host_id')->constrained('users');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('max_participants')->default(10);
            $table->timestamps();
            $table->softDeletes();

            $table->index('room_code', 'room_code_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_rooms');
    }
};`,
      policy: `<?php

namespace App\\Modules\\VideoConferencing\\Policies;

use App\\Modules\\VideoConferencing\\Models\\VideoRoom;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class VideoPolicy
{
    use HandlesAuthorization;

    public function host(User $user, VideoRoom $room): bool
    {
        return $room->host_id === $user->id
            || $user->hasPermission('video.host');
    }

    public function join(User $user, VideoRoom $room): bool
    {
        return $user->hasPermission('video.join')
            && $room->is_active
            && ! $room->isFull();
    }
}`
    },
    sampleRecords: [
      { id: 12, room_code: 'ENG-STANDUP-909', host: 'Sarah Connor', is_active: true, participants: 6 }
    ],
    status: 'Configured'
  },
  {
    id: 24,
    code: 'MOD-024',
    name: 'Voice Communication',
    slug: 'voice-communication',
    category: 'Communication',
    phase: 3,
    iconName: 'PhoneCall',
    purpose: 'VoIP audio calling, SIP gateway routing, audio quality telemetry, and call duration logs.',
    responsibilities: [
      'Initialize audio call sessions between endpoints',
      'Calculate audio call duration and bandwidth consumption',
      'Support call forwarding and voicemail drop'
    ],
    databaseTables: [
      {
        name: 'voice_calls',
        description: 'Audio call records.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [
          { column: 'caller_id', references: 'id', table: 'users' },
          { column: 'receiver_id', references: 'id', table: 'users' }
        ],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'caller_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'receiver_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'duration_seconds', type: 'INT UNSIGNED', nullable: false },
          { name: 'status', type: 'ENUM("ringing","connected","completed","missed")', nullable: false }
        ],
        indexes: ['idx_voice_caller_time']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/voice/calls/dial', description: 'Initiate call', authRequired: true },
      { method: 'POST', path: '/api/v1/voice/calls/{id}/hangup', description: 'End call', authRequired: true }
    ],
    services: ['VoiceGatewayService'],
    permissions: ['voice.call'],
    events: ['CallInitiated', 'CallCompleted'],
    jobs: ['LogCallQualityMetricsJob'],
    dependencies: [1],
    tests: ['VoiceSessionTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\VoiceCommunication\\Http\\Controllers;

use App\\Modules\\VoiceCommunication\\Services\\VoiceGatewayService;
use App\\Modules\\VoiceCommunication\\Requests\\DialCallRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class VoiceController extends Controller
{
    public function __construct(
        private readonly VoiceGatewayService $gatewayService
    ) {}

    public function dial(DialCallRequest $request): JsonResponse
    {
        $call = $this->gatewayService->initiateCall(
            callerId: auth()->id(),
            receiverId: $request->validated('receiver_id'),
        );

        return response()->json([
            'success' => true,
            'data' => $call,
        ], 201);
    }

    public function hangup(int $id): JsonResponse
    {
        $call = $this->gatewayService->endCall(
            callId: $id,
            userId: auth()->id(),
        );

        return response()->json([
            'success' => true,
            'data' => $call,
        ]);
    }
}`,
      model: `<?php

namespace App\\Modules\\VoiceCommunication\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class VoiceCall extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'voice_calls';

    protected $fillable = [
        'caller_id',
        'receiver_id',
        'duration_seconds',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'duration_seconds' => 'integer',
            'status' => 'string',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (VoiceCall $call) {
            $call->status ??= 'ringing';
            $call->duration_seconds ??= 0;
        });
    }

    public function caller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'caller_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function isConnected(): bool
    {
        return $this->status === 'connected';
    }

    public function complete(int $duration): void
    {
        $this->update([
            'status' => 'completed',
            'duration_seconds' => $duration,
        ]);
    }
}`,
      service: `<?php

namespace App\\Modules\\VoiceCommunication\\Services;

use App\\Modules\\VoiceCommunication\\Models\\VoiceCall;
use App\\Modules\\VoiceCommunication\\Events\\CallInitiated;
use App\\Modules\\VoiceCommunication\\Events\\CallCompleted;
use Illuminate\\Support\\Facades\\DB;

class VoiceGatewayService
{
    public function initiateCall(int $callerId, int $receiverId): VoiceCall
    {
        return DB::transaction(function () use ($callerId, $receiverId) {
            $call = VoiceCall::create([
                'caller_id' => $callerId,
                'receiver_id' => $receiverId,
                'duration_seconds' => 0,
                'status' => 'ringing',
            ]);

            event(new CallInitiated($call));

            return $call->load(['caller', 'receiver']);
        });
    }

    public function endCall(int $callId, int $userId): VoiceCall
    {
        $call = VoiceCall::where('id', $callId)
            ->where(fn ($q) => $q->where('caller_id', $userId)->orWhere('receiver_id', $userId))
            ->firstOrFail();

        return DB::transaction(function () use ($call) {
            $duration = $call->created_at->diffInSeconds(now());
            $call->complete($duration);

            event(new CallCompleted($call));

            return $call->fresh(['caller', 'receiver']);
        });
    }

    public function updateStatus(int $callId, string $status): void
    {
        $call = VoiceCall::findOrFail($callId);
        $call->update(['status' => $status]);
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\VoiceCommunication\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class DialCallRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'receiver_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voice_calls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caller_id')->constrained('users');
            $table->foreignId('receiver_id')->constrained('users');
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->enum('status', ['ringing', 'connected', 'completed', 'missed']);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['caller_id', 'created_at'], 'idx_voice_caller_time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voice_calls');
    }
};`,
      policy: `<?php

namespace App\\Modules\\VoiceCommunication\\Policies;

use App\\Modules\\VoiceCommunication\\Models\\VoiceCall;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class VoicePolicy
{
    use HandlesAuthorization;

    public function call(User $user): bool
    {
        return $user->hasPermission('voice.call');
    }

    public function hangup(User $user, VoiceCall $call): bool
    {
        return $call->caller_id === $user->id
            || $call->receiver_id === $user->id;
    }
}`
    },
    sampleRecords: [
      { id: 801, caller: 'Alex Chen', receiver: 'Support Desk', duration_seconds: 142, status: 'completed' }
    ],
    status: 'Configured'
  },
  {
    id: 25,
    code: 'MOD-025',
    name: 'Email Management',
    slug: 'email-management',
    category: 'Communication',
    phase: 3,
    iconName: 'Send',
    purpose: 'Transactional email templating, multi-provider delivery (SES, Postmark), and bounce/complaint handling.',
    responsibilities: [
      'Render responsive HTML email templates with variable substitution',
      'Queue outbound emails with exponential backoff on provider failure',
      'Process incoming webhooks for delivery, opens, bounces, and spam complaints'
    ],
    databaseTables: [
      {
        name: 'email_logs',
        description: 'Outbound email delivery log.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'recipient', type: 'VARCHAR(255)', nullable: false, index: true },
          { name: 'template', type: 'VARCHAR(64)', nullable: false },
          { name: 'subject', type: 'VARCHAR(255)', nullable: false },
          { name: 'status', type: 'ENUM("queued","sent","delivered","bounced","failed")', nullable: false }
        ],
        indexes: ['idx_email_recipient_status']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/emails/send', description: 'Dispatch transactional email', authRequired: true },
      { method: 'POST', path: '/api/v1/emails/webhooks', description: 'Provider status webhook', authRequired: false }
    ],
    services: ['EmailDeliveryService', 'EmailTemplateRendererService'],
    permissions: ['email.send', 'email.templates.manage'],
    events: ['EmailSent', 'EmailBounced'],
    jobs: ['SendEmailViaProviderJob'],
    dependencies: [1],
    tests: ['EmailTemplateTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\EmailManagement\\Http\\Controllers;

use App\\Modules\\EmailManagement\\Services\\EmailDeliveryService;
use App\\Modules\\EmailManagement\\Requests\\SendEmailRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class EmailController extends Controller
{
    public function __construct(
        private readonly EmailDeliveryService $emailService
    ) {}

    public function send(SendEmailRequest $request): JsonResponse
    {
        $emailLog = $this->emailService->dispatchEmail(
            recipient: $request->validated('recipient'),
            template: $request->validated('template'),
            subject: $request->validated('subject'),
            data: $request->validated('data', []),
        );

        return response()->json([
            'success' => true,
            'data' => $emailLog,
        ], 202);
    }

    public function webhook(): JsonResponse
    {
        $payload = request()->all();

        $this->emailService->processWebhook($payload);

        return response()->json(['success' => true]);
    }
}`,
      model: `<?php

namespace App\\Modules\\EmailManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class EmailLog extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'email_logs';

    protected $fillable = [
        'recipient',
        'template',
        'subject',
        'status',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (EmailLog $log) {
            $log->status ??= 'queued';
        });
    }

    public function markAsSent(): void
    {
        $this->update(['status' => 'sent']);
    }

    public function markAsDelivered(): void
    {
        $this->update(['status' => 'delivered']);
    }

    public function markAsBounced(): void
    {
        $this->update(['status' => 'bounced']);
    }

    public function markAsFailed(): void
    {
        $this->update(['status' => 'failed']);
    }
}`,
      service: `<?php

namespace App\\Modules\\EmailManagement\\Services;

use App\\Modules\\EmailManagement\\Models\\EmailLog;
use App\\Modules\\EmailManagement\\Events\\EmailSent;
use App\\Modules\\EmailManagement\\Events\\EmailBounced;
use App\\Modules\\EmailManagement\\Jobs\\SendEmailViaProviderJob;
use Illuminate\\Support\\Facades\\DB;

class EmailDeliveryService
{
    public function dispatchEmail(string $recipient, string $template, string $subject, array $data = []): EmailLog
    {
        return DB::transaction(function () use ($recipient, $template, $subject, $data) {
            $emailLog = EmailLog::create([
                'recipient' => $recipient,
                'template' => $template,
                'subject' => $subject,
                'status' => 'queued',
                'metadata' => $data,
            ]);

            SendEmailViaProviderJob::dispatch($emailLog);

            event(new EmailSent($emailLog));

            return $emailLog;
        });
    }

    public function processWebhook(array $payload): void
    {
        $emailLog = EmailLog::where('recipient', $payload['recipient'] ?? '')
            ->latest()
            ->first();

        if (! $emailLog) {
            return;
        }

        $status = $payload['status'] ?? null;

        match ($status) {
            'delivered' => $emailLog->markAsDelivered(),
            'bounced' => $emailLog->markAsBounced(),
            'failed' => $emailLog->markAsFailed(),
            default => null,
        };

        if ($status === 'bounced') {
            event(new EmailBounced($emailLog));
        }
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\EmailManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class SendEmailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'recipient' => ['required', 'email', 'max:255'],
            'template' => ['required', 'string', 'max:64'],
            'subject' => ['required', 'string', 'max:255'],
            'data' => ['sometimes', 'array'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();
            $table->string('recipient', 255);
            $table->string('template', 64);
            $table->string('subject', 255);
            $table->enum('status', ['queued', 'sent', 'delivered', 'bounced', 'failed']);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['recipient', 'status'], 'idx_email_recipient_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_logs');
    }
};`,
      policy: `<?php

namespace App\\Modules\\EmailManagement\\Policies;

use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class EmailPolicy
{
    use HandlesAuthorization;

    public function send(User $user): bool
    {
        return $user->hasPermission('email.send');
    }

    public function manageTemplates(User $user): bool
    {
        return $user->hasPermission('email.templates.manage');
    }
}`
    },
    sampleRecords: [
      { id: 410, recipient: 'alex.chen@nexus-enterprise.io', template: 'auth.verify-email', status: 'delivered' }
    ],
    status: 'Configured'
  },
  {
    id: 26,
    code: 'MOD-026',
    name: 'SMS Management',
    slug: 'sms-management',
    category: 'Communication',
    phase: 3,
    iconName: 'Smartphone',
    purpose: 'SMS delivery, OTP dispatching, short-code management, delivery receipts, and opt-out registry.',
    responsibilities: [
      'Route outbound SMS via providers (Twilio, Vonage)',
      'Manage STOP/UNSUBSCRIBE compliance records',
      'Track carrier delivery rates and per-message SMS costs'
    ],
    databaseTables: [
      {
        name: 'sms_logs',
        description: 'SMS dispatch and carrier receipts.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'phone_number', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'body', type: 'VARCHAR(160)', nullable: false },
          { name: 'status', type: 'ENUM("sent","delivered","failed")', nullable: false },
          { name: 'cost_usd', type: 'DECIMAL(6,4)', nullable: false }
        ],
        indexes: ['idx_sms_phone']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/sms/send', description: 'Send SMS', authRequired: true },
      { method: 'POST', path: '/api/v1/sms/status-callback', description: 'Carrier delivery callback', authRequired: false }
    ],
    services: ['SmsDispatcherService'],
    permissions: ['sms.send'],
    events: ['SmsDelivered', 'SmsDeliveryFailed'],
    jobs: ['DispatchSmsJob'],
    dependencies: [1],
    tests: ['SmsDispatcherTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\SmsManagement\\Http\\Controllers;

use App\\Modules\\SmsManagement\\Services\\SmsDispatcherService;
use App\\Modules\\SmsManagement\\Requests\\SendSmsRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class SmsController extends Controller
{
    public function __construct(
        private readonly SmsDispatcherService $smsService
    ) {}

    public function send(SendSmsRequest $request): JsonResponse
    {
        $smsLog = $this->smsService->dispatchSms(
            phoneNumber: $request->validated('phone_number'),
            body: $request->validated('body'),
        );

        return response()->json([
            'success' => true,
            'data' => $smsLog,
        ], 202);
    }

    public function statusCallback(): JsonResponse
    {
        $payload = request()->all();

        $this->smsService->processDeliveryCallback($payload);

        return response()->json(['success' => true]);
    }
}`,
      model: `<?php

namespace App\\Modules\\SmsManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class SmsLog extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sms_logs';

    protected $fillable = [
        'phone_number',
        'body',
        'status',
        'cost_usd',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'cost_usd' => 'decimal:4',
            'metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (SmsLog $log) {
            $log->status ??= 'sent';
        });
    }

    public function markAsDelivered(): void
    {
        $this->update(['status' => 'delivered']);
    }

    public function markAsFailed(): void
    {
        $this->update(['status' => 'failed']);
    }
}`,
      service: `<?php

namespace App\\Modules\\SmsManagement\\Services;

use App\\Modules\\SmsManagement\\Models\\SmsLog;
use App\\Modules\\SmsManagement\\Events\\SmsDelivered;
use App\\Modules\\SmsManagement\\Events\\SmsDeliveryFailed;
use App\\Modules\\SmsManagement\\Jobs\\DispatchSmsJob;
use Illuminate\\Support\\Facades\\DB;

class SmsDispatcherService
{
    public function dispatchSms(string $phoneNumber, string $body): SmsLog
    {
        return DB::transaction(function () use ($phoneNumber, $body) {
            $smsLog = SmsLog::create([
                'phone_number' => $phoneNumber,
                'body' => $body,
                'status' => 'sent',
                'cost_usd' => 0,
            ]);

            DispatchSmsJob::dispatch($smsLog);

            return $smsLog;
        });
    }

    public function processDeliveryCallback(array $payload): void
    {
        $smsLog = SmsLog::where('phone_number', $payload['phone_number'] ?? '')
            ->latest()
            ->first();

        if (! $smsLog) {
            return;
        }

        $status = $payload['status'] ?? null;

        if ($status === 'delivered') {
            $smsLog->markAsDelivered();
            event(new SmsDelivered($smsLog));
        } elseif ($status === 'failed') {
            $smsLog->markAsFailed();
            event(new SmsDeliveryFailed($smsLog));
        }
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\SmsManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class SendSmsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone_number' => ['required', 'string', 'max:32'],
            'body' => ['required', 'string', 'max:160'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->string('phone_number', 32);
            $table->string('body', 160);
            $table->enum('status', ['sent', 'delivered', 'failed']);
            $table->decimal('cost_usd', 6, 4)->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('phone_number', 'idx_sms_phone');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sms_logs');
    }
};`,
      policy: `<?php

namespace App\\Modules\\SmsManagement\\Policies;

use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class SmsPolicy
{
    use HandlesAuthorization;

    public function send(User $user): bool
    {
        return $user->hasPermission('sms.send');
    }
}`
    },
    sampleRecords: [
      { id: 91, phone: '+1 (555) 019-2834', status: 'delivered', cost: '$0.0075' }
    ],
    status: 'Configured'
  },
  {
    id: 27,
    code: 'MOD-027',
    name: 'Notification Management',
    slug: 'notification-management',
    category: 'Communication',
    phase: 3,
    iconName: 'Bell',
    purpose: 'Application-wide multi-channel notification dispatcher, preference matrices, and batch digests.',
    responsibilities: [
      'Route notifications across database, push, email, and SMS channels',
      'Respect per-user notification frequency and quiet hour preferences',
      'Batch rapid event notifications into daily/weekly email digests'
    ],
    databaseTables: [
      {
        name: 'notifications',
        description: 'Laravel polymorphic notifications table.',
        primaryKey: 'id (CHAR(36))',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'CHAR(36)', nullable: false },
          { name: 'type', type: 'VARCHAR(255)', nullable: false },
          { name: 'notifiable_type', type: 'VARCHAR(255)', nullable: false, index: true },
          { name: 'notifiable_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'data', type: 'TEXT', nullable: false },
          { name: 'read_at', type: 'TIMESTAMP', nullable: true }
        ],
        indexes: ['idx_notifiable']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/notifications', description: 'Get notifications', authRequired: true },
      { method: 'PATCH', path: '/api/v1/notifications/mark-read', description: 'Acknowledge notifications', authRequired: true }
    ],
    services: ['NotificationCenterService', 'PreferenceRoutingService'],
    permissions: ['notifications.read', 'notifications.broadcast'],
    events: ['NotificationDispatched'],
    jobs: ['SendBatchedDigestJob'],
    dependencies: [1],
    tests: ['NotificationChannelRoutingTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\NotificationManagement\\Http\\Controllers;

use App\\Modules\\NotificationManagement\\Services\\NotificationCenterService;
use App\\Modules\\NotificationManagement\\Requests\\MarkReadRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationCenterService $notificationService
    ) {}

    public function index(): JsonResponse
    {
        $notifications = $this->notificationService->getNotifications(
            userId: auth()->id(),
            perPage: request()->get('per_page', 20),
        );

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    public function markRead(MarkReadRequest $request): JsonResponse
    {
        $count = $this->notificationService->markAsRead(
            userId: auth()->id(),
            notificationIds: $request->validated('notification_ids'),
        );

        return response()->json([
            'success' => true,
            'data' => ['marked_count' => $count],
        ]);
    }
}`,
      model: `<?php

namespace App\\Modules\\NotificationManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\MorphTo;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'id',
        'type',
        'notifiable_type',
        'notifiable_id',
        'data',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'read_at' => 'datetime',
        ];
    }

    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }

    public function markAsRead(): void
    {
        if (is_null($this->read_at)) {
            $this->update(['read_at' => now()]);
        }
    }

    public function markAsUnread(): void
    {
        $this->update(['read_at' => null]);
    }

    public function isRead(): bool
    {
        return ! is_null($this->read_at);
    }
}`,
      service: `<?php

namespace App\\Modules\\NotificationManagement\\Services;

use App\\Modules\\NotificationManagement\\Models\\Notification;
use App\\Modules\\NotificationManagement\\Events\\NotificationDispatched;
use Illuminate\\Support\\Collection;
use Illuminate\\Pagination\\LengthAwarePaginator;

class NotificationCenterService
{
    public function getNotifications(int $userId, int $perPage = 20): LengthAwarePaginator
    {
        return Notification::where('notifiable_type', \\App\\User::class)
            ->where('notifiable_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function markAsRead(int $userId, array $notificationIds): int
    {
        return Notification::where('notifiable_type', \\App\\User::class)
            ->where('notifiable_id', $userId)
            ->whereIn('id', $notificationIds)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function dispatchNotification(mixed $notifiable, string $type, array $data): Notification
    {
        $notification = Notification::create([
            'id' => \\Illuminate\\Support\\Str::uuid(),
            'type' => $type,
            'notifiable_type' => get_class($notifiable),
            'notifiable_id' => $notifiable->id,
            'data' => $data,
        ]);

        event(new NotificationDispatched($notification));

        return $notification;
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\NotificationManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class MarkReadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'notification_ids' => ['required', 'array'],
            'notification_ids.*' => ['string'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->char('uuid', 36)->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};`,
      policy: `<?php

namespace App\\Modules\\NotificationManagement\\Policies;

use App\\Modules\\NotificationManagement\\Models\\Notification;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class NotificationPolicy
{
    use HandlesAuthorization;

    public function read(User $user, Notification $notification): bool
    {
        return $user->hasPermission('notifications.read')
            && $notification->notifiable_id === $user->id;
    }

    public function broadcast(User $user): bool
    {
        return $user->hasPermission('notifications.broadcast');
    }
}`
    },
    sampleRecords: [
      { id: 'notif-1', title: 'New order #ORD-4812 received', channel: 'In-App', read: false }
    ],
    status: 'Configured'
  },
  {
    id: 28,
    code: 'MOD-028',
    name: 'Contact Management',
    slug: 'contact-management',
    category: 'Communication',
    phase: 3,
    iconName: 'BookUser',
    purpose: 'Address books, enterprise contacts, vCard import/export, deduplication, and contact tags.',
    responsibilities: [
      'Maintain personal and team contact address books',
      'Parse vCard (.vcf) and CSV bulk imports',
      'Fuzzy match and merge duplicate contact records'
    ],
    databaseTables: [
      {
        name: 'contacts',
        description: 'Enterprise address book.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'name', type: 'VARCHAR(128)', nullable: false },
          { name: 'email', type: 'VARCHAR(255)', nullable: true },
          { name: 'company', type: 'VARCHAR(128)', nullable: true }
        ],
        indexes: ['idx_contact_user']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/contacts', description: 'Browse contacts', authRequired: true },
      { method: 'POST', path: '/api/v1/contacts', description: 'Add contact', authRequired: true }
    ],
    services: ['ContactBookService'],
    permissions: ['contacts.manage'],
    events: ['ContactCreated'],
    jobs: ['DeduplicateContactsJob'],
    dependencies: [1],
    tests: ['ContactBookTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\ContactManagement\\Http\\Controllers;

use App\\Modules\\ContactManagement\\Services\\ContactBookService;
use App\\Modules\\ContactManagement\\Requests\\CreateContactRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class ContactController extends Controller
{
    public function __construct(
        private readonly ContactBookService $contactService
    ) {}

    public function index(): JsonResponse
    {
        $contacts = $this->contactService->getUserContacts(
            userId: auth()->id(),
            search: request()->get('search'),
        );

        return response()->json([
            'success' => true,
            'data' => $contacts,
        ]);
    }

    public function store(CreateContactRequest $request): JsonResponse
    {
        $contact = $this->contactService->createContact(
            userId: auth()->id(),
            data: $request->validated(),
        );

        return response()->json([
            'success' => true,
            'data' => $contact,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Modules\\ContactManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'contacts';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'company',
    ];

    protected function casts(): array
    {
        return [];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(ContactTag::class);
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('email', 'like', "%{$term}%")
              ->orWhere('company', 'like', "%{$term}%");
        });
    }
}`,
      service: `<?php

namespace App\\Modules\\ContactManagement\\Services;

use App\\Modules\\ContactManagement\\Models\\Contact;
use App\\Modules\\ContactManagement\\Events\\ContactCreated;
use Illuminate\\Support\\Collection;
use Illuminate\\Support\\Facades\\DB;

class ContactBookService
{
    public function getUserContacts(int $userId, ?string $search = null): Collection
    {
        $query = Contact::where('user_id', $userId);

        if ($search) {
            $query->search($search);
        }

        return $query->orderBy('name')->get();
    }

    public function createContact(int $userId, array $data): Contact
    {
        return DB::transaction(function () use ($userId, $data) {
            $contact = Contact::create([
                'user_id' => $userId,
                'name' => $data['name'],
                'email' => $data['email'] ?? null,
                'company' => $data['company'] ?? null,
            ]);

            event(new ContactCreated($contact));

            return $contact;
        });
    }

    public function updateContact(Contact $contact, array $data): Contact
    {
        $contact->update($data);

        return $contact->fresh();
    }

    public function deleteContact(Contact $contact): bool
    {
        return $contact->delete();
    }

    public function findDuplicates(int $userId): Collection
    {
        return Contact::where('user_id', $userId)
            ->select('name', 'email')
            ->havingRaw('COUNT(*) > 1')
            ->groupBy('name', 'email')
            ->get();
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\ContactManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:128'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'company' => ['sometimes', 'nullable', 'string', 'max:128'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 128);
            $table->string('email', 255)->nullable();
            $table->string('company', 128)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id', 'idx_contact_user');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};`,
      policy: `<?php

namespace App\\Modules\\ContactManagement\\Policies;

use App\\Modules\\ContactManagement\\Models\\Contact;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class ContactPolicy
{
    use HandlesAuthorization;

    public function manage(User $user, Contact $contact): bool
    {
        return $user->hasPermission('contacts.manage')
            && $contact->user_id === $user->id;
    }
}`
    },
    sampleRecords: [
      { id: 1, name: 'Jessica Alba', company: 'The Honest Co', email: 'jessica@honest.com' }
    ],
    status: 'Configured'
  },
  {
    id: 29,
    code: 'MOD-029',
    name: 'Support Ticketing',
    slug: 'support-ticketing',
    category: 'Communication',
    phase: 3,
    iconName: 'LifeBuoy',
    purpose: 'Customer support tickets, SLA tracking, severity tiers, ticket lifecycles, and resolution metrics.',
    responsibilities: [
      'Generate sequential ticket numbers (e.g. #TICK-8491)',
      'Enforce SLA response time limits with escalation alerts',
      'Track satisfaction survey (CSAT) ratings upon resolution'
    ],
    databaseTables: [
      {
        name: 'support_tickets',
        description: 'Support requests and SLAs.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'customer_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'ticket_number', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'priority', type: 'ENUM("low","normal","high","urgent")', nullable: false },
          { name: 'status', type: 'ENUM("open","pending","resolved","closed")', nullable: false }
        ],
        indexes: ['ticket_num_unique', 'idx_ticket_status']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/tickets', description: 'List tickets', authRequired: true },
      { method: 'POST', path: '/api/v1/tickets', description: 'Open support ticket', authRequired: true }
    ],
    services: ['SupportTicketService', 'SlaTrackerService'],
    permissions: ['tickets.view', 'tickets.manage'],
    events: ['TicketCreated', 'TicketEscalated'],
    jobs: ['CheckSlaBreachesJob'],
    dependencies: [1],
    tests: ['TicketSlaBreachTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\SupportTicketing\\Http\\Controllers;

use App\\Modules\\SupportTicketing\\Services\\SupportTicketService;
use App\\Modules\\SupportTicketing\\Requests\\CreateTicketRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class SupportTicketController extends Controller
{
    public function __construct(
        private readonly SupportTicketService $ticketService
    ) {}

    public function index(): JsonResponse
    {
        $tickets = $this->ticketService->listTickets(
            userId: auth()->id(),
            status: request()->get('status'),
            priority: request()->get('priority'),
        );

        return response()->json([
            'success' => true,
            'data' => $tickets,
        ]);
    }

    public function store(CreateTicketRequest $request): JsonResponse
    {
        $ticket = $this->ticketService->createTicket(
            customerId: auth()->id(),
            data: $request->validated(),
        );

        return response()->json([
            'success' => true,
            'data' => $ticket,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Modules\\SupportTicketing\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class SupportTicket extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'support_tickets';

    protected $fillable = [
        'ticket_number',
        'customer_id',
        'subject',
        'description',
        'priority',
        'status',
    ];

    protected function casts(): array
    {
        return [];
    }

    protected static function booted(): void
    {
        static::creating(function (SupportTicket $ticket) {
            $ticket->ticket_number ??= self::generateTicketNumber();
            $ticket->status ??= 'open';
        });
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function scopeByStatus($query, ?string $status)
    {
        return $status ? $query->where('status', $status) : $query;
    }

    public function scopeByPriority($query, ?string $priority)
    {
        return $priority ? $query->where('priority', $priority) : $query;
    }

    public function resolve(): void
    {
        $this->update(['status' => 'resolved']);
    }

    public function close(): void
    {
        $this->update(['status' => 'closed']);
    }

    public function escalate(): void
    {
        $this->update(['priority' => 'urgent']);
    }

    private static function generateTicketNumber(): string
    {
        $latest = self::withTrashed()->latest('id')->first();
        $number = $latest ? (int) str_replace('TICK-', '', $latest->ticket_number) + 1 : 1;

        return sprintf('TICK-%04d', $number);
    }
}`,
      service: `<?php

namespace App\\Modules\\SupportTicketing\\Services;

use App\\Modules\\SupportTicketing\\Models\\SupportTicket;
use App\\Modules\\SupportTicketing\\Events\\TicketCreated;
use App\\Modules\\SupportTicketing\\Events\\TicketEscalated;
use Illuminate\\Support\\Collection;
use Illuminate\\Support\\Facades\\DB;

class SupportTicketService
{
    public function listTickets(int $userId, ?string $status = null, ?string $priority = null): Collection
    {
        return SupportTicket::where('customer_id', $userId)
            ->byStatus($status)
            ->byPriority($priority)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function createTicket(int $customerId, array $data): SupportTicket
    {
        return DB::transaction(function () use ($customerId, $data) {
            $ticket = SupportTicket::create([
                'customer_id' => $customerId,
                'subject' => $data['subject'],
                'description' => $data['description'] ?? '',
                'priority' => $data['priority'] ?? 'normal',
                'status' => 'open',
            ]);

            event(new TicketCreated($ticket));

            return $ticket;
        });
    }

    public function escalateTicket(SupportTicket $ticket): SupportTicket
    {
        return DB::transaction(function () use ($ticket) {
            $ticket->escalate();

            event(new TicketEscalated($ticket));

            return $ticket->fresh();
        });
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\SupportTicketing\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'priority' => ['sometimes', 'in:low,normal,high,urgent'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 32)->unique();
            $table->foreignId('customer_id')->constrained('users');
            $table->string('subject', 255);
            $table->text('description')->nullable();
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->enum('status', ['open', 'pending', 'resolved', 'closed'])->default('open');
            $table->timestamps();
            $table->softDeletes();

            $table->index('ticket_number', 'ticket_num_unique');
            $table->index('status', 'idx_ticket_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};`,
      policy: `<?php

namespace App\\Modules\\SupportTicketing\\Policies;

use App\\Modules\\SupportTicketing\\Models\\SupportTicket;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class TicketPolicy
{
    use HandlesAuthorization;

    public function view(User $user, SupportTicket $ticket): bool
    {
        return $user->hasPermission('tickets.view')
            || $ticket->customer_id === $user->id;
    }

    public function manage(User $user, SupportTicket $ticket): bool
    {
        return $user->hasPermission('tickets.manage');
    }
}`
    },
    sampleRecords: [
      { id: 101, number: '#TICK-1092', subject: 'Invoice discrepancy for August', priority: 'high', status: 'open' }
    ],
    status: 'Configured'
  },
  {
    id: 30,
    code: 'MOD-030',
    name: 'Helpdesk Management',
    slug: 'helpdesk-management',
    category: 'Communication',
    phase: 3,
    iconName: 'Headphones',
    purpose: 'Helpdesk operations, agent skills, ticket assignments, canned macro responses, and knowledge base.',
    responsibilities: [
      'Round-robin and skill-based ticket routing to agents',
      'Manage reusable macro response templates',
      'Calculate First Contact Resolution (FCR) agent scores'
    ],
    databaseTables: [
      {
        name: 'helpdesk_agents',
        description: 'Support representative rosters.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'department', type: 'VARCHAR(64)', nullable: false },
          { name: 'is_online', type: 'BOOLEAN', nullable: false },
          { name: 'active_tickets_count', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['helpdesk_user_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/helpdesk/agents', description: 'View agent rosters', authRequired: true },
      { method: 'POST', path: '/api/v1/helpdesk/assign', description: 'Assign ticket to agent', authRequired: true }
    ],
    services: ['HelpdeskRoutingService'],
    permissions: ['helpdesk.manage'],
    events: ['TicketAssignedToAgent'],
    jobs: ['RebalanceAgentLoadsJob'],
    dependencies: [1, 29],
    tests: ['HelpdeskRoutingTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\HelpdeskManagement\\Http\\Controllers;

use App\\Modules\\HelpdeskManagement\\Services\\HelpdeskRoutingService;
use App\\Modules\\HelpdeskManagement\\Requests\\AssignTicketRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class HelpdeskController extends Controller
{
    public function __construct(
        private readonly HelpdeskRoutingService $routingService
    ) {}

    public function agents(): JsonResponse
    {
        $agents = $this->routingService->getAgentRosters();

        return response()->json([
            'success' => true,
            'data' => $agents,
        ]);
    }

    public function assign(AssignTicketRequest $request): JsonResponse
    {
        $result = $this->routingService->assignTicketToAgent(
            ticketId: $request->validated('ticket_id'),
            agentId: $request->validated('agent_id'),
        );

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}`,
      model: `<?php

namespace App\\Modules\\HelpdeskManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class HelpdeskAgent extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'helpdesk_agents';

    protected $fillable = [
        'user_id',
        'department',
        'is_online',
        'active_tickets_count',
    ];

    protected function casts(): array
    {
        return [
            'is_online' => 'boolean',
            'active_tickets_count' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (HelpdeskAgent $agent) {
            $agent->is_online ??= false;
            $agent->active_tickets_count ??= 0;
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isAvailable(): bool
    {
        return $this->is_online && $this->active_tickets_count < 10;
    }

    public function incrementTicketCount(): void
    {
        $this->increment('active_tickets_count');
    }

    public function decrementTicketCount(): void
    {
        $this->decrement('active_tickets_count');
    }
}`,
      service: `<?php

namespace App\\Modules\\HelpdeskManagement\\Services;

use App\\Modules\\HelpdeskManagement\\Models\\HelpdeskAgent;
use App\\Modules\\SupportTicketing\\Models\\SupportTicket;
use App\\Modules\\HelpdeskManagement\\Events\\TicketAssignedToAgent;
use Illuminate\\Support\\Collection;
use Illuminate\\Support\\Facades\\DB;

class HelpdeskRoutingService
{
    public function getAgentRosters(): Collection
    {
        return HelpdeskAgent::with('user')
            ->orderBy('active_tickets_count', 'asc')
            ->get();
    }

    public function assignTicketToAgent(int $ticketId, int $agentId): SupportTicket
    {
        return DB::transaction(function () use ($ticketId, $agentId) {
            $ticket = SupportTicket::findOrFail($ticketId);
            $agent = HelpdeskAgent::findOrFail($agentId);

            $ticket->update(['status' => 'pending']);
            $agent->incrementTicketCount();

            event(new TicketAssignedToAgent($ticket, $agent));

            return $ticket->fresh();
        });
    }

    public function roundRobinAssign(int $ticketId, string $department): HelpdeskAgent
    {
        $agent = HelpdeskAgent::where('department', $department)
            ->where('is_online', true)
            ->orderBy('active_tickets_count', 'asc')
            ->firstOrFail();

        $this->assignTicketToAgent($ticketId, $agent->id);

        return $agent;
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\HelpdeskManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class AssignTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ticket_id' => ['required', 'integer', 'exists:support_tickets,id'],
            'agent_id' => ['required', 'integer', 'exists:helpdesk_agents,id'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('helpdesk_agents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('department', 64);
            $table->boolean('is_online')->default(false);
            $table->unsignedInteger('active_tickets_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->unique('user_id', 'helpdesk_user_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('helpdesk_agents');
    }
};`,
      policy: `<?php

namespace App\\Modules\\HelpdeskManagement\\Policies;

use App\\Modules\\HelpdeskManagement\\Models\\HelpdeskAgent;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class HelpdeskPolicy
{
    use HandlesAuthorization;

    public function manage(User $user): bool
    {
        return $user->hasPermission('helpdesk.manage');
    }

    public function assign(User $user, HelpdeskAgent $agent): bool
    {
        return $user->hasPermission('helpdesk.manage');
    }
}`
    },
    sampleRecords: [
      { id: 4, agent: 'Sarah Connor', department: 'Enterprise Tier 3', active_tickets: 3, is_online: true }
    ],
    status: 'Configured'
  },

  // DOMAIN 4: COMMERCE (31-40)
  {
    id: 31,
    code: 'MOD-031',
    name: 'Product Management',
    slug: 'product-management',
    category: 'Commerce',
    phase: 4,
    iconName: 'Package',
    purpose: 'Master product records, SKU variants, product attributes, pricing specifications, and dimensions.',
    responsibilities: [
      'Create and maintain product records with SKU identifiers',
      'Manage multi-variant matrix (Size, Color, Material)',
      'Store weight, shipping dimensions, and barcode numbers'
    ],
    databaseTables: [
      {
        name: 'products',
        description: 'Catalog products.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'vendor_id', references: 'id', table: 'vendors' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'uuid', type: 'CHAR(36)', nullable: false, index: true },
          { name: 'sku', type: 'VARCHAR(64)', nullable: false, index: true },
          { name: 'title', type: 'VARCHAR(255)', nullable: false },
          { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
          { name: 'currency', type: 'CHAR(3)', nullable: false },
          { name: 'stock_status', type: 'ENUM("in_stock","out_of_stock","preorder")', nullable: false }
        ],
        indexes: ['products_sku_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/products', description: 'Browse products with filters', authRequired: false },
      { method: 'POST', path: '/api/v1/products', description: 'Create product', authRequired: true, permission: 'products.create' }
    ],
    services: ['ProductCatalogService', 'SkuGeneratorService'],
    permissions: ['products.view', 'products.create', 'products.edit', 'products.delete'],
    events: ['ProductCreated', 'ProductPriceChanged'],
    jobs: ['IndexProductSearchJob'],
    dependencies: [1],
    tests: ['ProductCatalogTest', 'SkuUniquenessTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\ProductManagement\\Http\\Controllers;

use App\\Modules\\ProductManagement\\Services\\ProductCatalogService;
use App\\Modules\\ProductManagement\\Requests\\CreateProductRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductCatalogService $catalogService
    ) {}

    public function index(): JsonResponse
    {
        $products = $this->catalogService->getFilteredProducts(
            filters: request()->only(['category', 'search', 'stock_status', 'min_price', 'max_price']),
            perPage: request()->get('per_page', 20),
        );

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    public function store(CreateProductRequest $request): JsonResponse
    {
        $product = $this->catalogService->createProduct(
            vendorId: auth()->id(),
            data: $request->validated(),
        );

        return response()->json([
            'success' => true,
            'data' => $product,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Modules\\ProductManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Concerns\\HasUuid;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Product extends Model
{
    use HasFactory, SoftDeletes, HasUuid;

    protected $table = 'products';

    protected $fillable = [
        'uuid',
        'sku',
        'vendor_id',
        'title',
        'description',
        'price',
        'currency',
        'stock_status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function inventoryItems(): HasMany
    {
        return $this->hasMany(InventoryItem::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function isInStock(): bool
    {
        return $this->stock_status === 'in_stock';
    }
}`,
      service: `<?php

namespace App\\Modules\\ProductManagement\\Services;

use App\\Modules\\ProductManagement\\Models\\Product;
use App\\Modules\\ProductManagement\\Events\\ProductCreated;
use App\\Modules\\ProductManagement\\Events\\ProductPriceChanged;
use App\\Modules\\ProductManagement\\Jobs\\IndexProductSearchJob;
use Illuminate\\Pagination\\LengthAwarePaginator;
use Illuminate\\Support\\Facades\\DB;

class ProductCatalogService
{
    public function getFilteredProducts(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        $query = Product::with('vendor');

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                  ->orWhere('sku', 'like', "%{$filters['search']}%");
            });
        }

        if (isset($filters['stock_status'])) {
            $query->where('stock_status', $filters['stock_status']);
        }

        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function createProduct(int $vendorId, array $data): Product
    {
        return DB::transaction(function () use ($vendorId, $data) {
            $product = Product::create([
                'uuid' => \\Illuminate\\Support\\Str::uuid(),
                'sku' => $data['sku'],
                'vendor_id' => $vendorId,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'currency' => $data['currency'] ?? 'USD',
                'stock_status' => $data['stock_status'] ?? 'in_stock',
            ]);

            event(new ProductCreated($product));
            IndexProductSearchJob::dispatch($product);

            return $product;
        });
    }

    public function updatePrice(Product $product, float $newPrice): Product
    {
        return DB::transaction(function () use ($product, $newPrice) {
            $oldPrice = $product->price;
            $product->update(['price' => $newPrice]);

            event(new ProductPriceChanged($product, $oldPrice, $newPrice));

            return $product->fresh();
        });
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\ProductManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Product::class);
    }

    public function rules(): array
    {
        return [
            'sku' => ['required', 'string', 'max:64', 'unique:products,sku'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'stock_status' => ['sometimes', 'in:in_stock,out_of_stock,preorder'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->string('sku', 64);
            $table->foreignId('vendor_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->char('currency', 3)->default('USD');
            $table->enum('stock_status', ['in_stock', 'out_of_stock', 'preorder'])->default('in_stock');
            $table->timestamps();
            $table->softDeletes();

            $table->unique('sku', 'products_sku_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};`,
      policy: `<?php

namespace App\\Modules\\ProductManagement\\Policies;

use App\\Modules\\ProductManagement\\Models\\Product;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class ProductPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('products.create');
    }

    public function update(User $user, Product $product): bool
    {
        return $user->hasPermission('products.edit')
            || $product->vendor_id === $user->id;
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->hasPermission('products.delete');
    }
}`
    },
    sampleRecords: [
      { id: 1, sku: 'NX-SRV-01', title: 'Enterprise Server Node X1', price: 2499.00, currency: 'USD', stock: 'in_stock' },
      { id: 2, sku: 'NX-IOT-09', title: 'Edge Telemetry Gateway', price: 349.50, currency: 'USD', stock: 'in_stock' }
    ],
    status: 'Active'
  },
  {
    id: 32,
    code: 'MOD-032',
    name: 'Catalog Management',
    slug: 'catalog-management',
    category: 'Commerce',
    phase: 4,
    iconName: 'Grid',
    purpose: 'Hierarchical categories, curated product collections, promotional showcases, and faceted filter indexes.',
    responsibilities: [
      'Maintain nested category trees with parent-child relationships',
      'Manage curated collections for seasonal campaigns',
      'Compute faceted counts for search navigation filters'
    ],
    databaseTables: [
      {
        name: 'categories',
        description: 'Hierarchical product categories.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'parent_id', references: 'id', table: 'categories' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'parent_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
          { name: 'name', type: 'VARCHAR(128)', nullable: false },
          { name: 'slug', type: 'VARCHAR(128)', nullable: false, index: true },
          { name: 'level', type: 'TINYINT UNSIGNED', nullable: false }
        ],
        indexes: ['category_slug_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/categories', description: 'Category taxonomy', authRequired: false },
      { method: 'POST', path: '/api/v1/categories', description: 'Create category node', authRequired: true }
    ],
    services: ['CategoryTreeService'],
    permissions: ['catalog.manage'],
    events: ['CategoryCreated'],
    jobs: ['RebuildCategoryTreeJob'],
    dependencies: [31],
    tests: ['CategoryTreeDepthTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\CatalogManagement\\Http\\Controllers;

use App\\Modules\\CatalogManagement\\Services\\CategoryTreeService;
use App\\Modules\\CatalogManagement\\Requests\\CreateCategoryRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class CatalogController extends Controller
{
    public function __construct(
        private readonly CategoryTreeService $categoryService
    ) {}

    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getTree();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function store(CreateCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->createCategory(
            data: $request->validated(),
        );

        return response()->json([
            'success' => true,
            'data' => $category,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Modules\\CatalogManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'categories';

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'level',
    ];

    protected function casts(): array
    {
        return [
            'level' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Category $category) {
            if ($category->parent_id) {
                $parent = static::findOrFail($category->parent_id);
                $category->level = $parent->level + 1;
            } else {
                $category->level = 0;
            }
        });
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }

    public function descendants(): HasMany
    {
        return $this->children()->with('descendants');
    }
}`,
      service: `<?php

namespace App\\Modules\\CatalogManagement\\Services;

use App\\Modules\\CatalogManagement\\Models\\Category;
use App\\Modules\\CatalogManagement\\Events\\CategoryCreated;
use Illuminate\\Support\\Collection;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

class CategoryTreeService
{
    public function getTree(): Collection
    {
        return Category::with('children')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();
    }

    public function createCategory(array $data): Category
    {
        return DB::transaction(function () use ($data) {
            $category = Category::create([
                'parent_id' => $data['parent_id'] ?? null,
                'name' => $data['name'],
                'slug' => $data['slug'] ?? Str::slug($data['name']),
            ]);

            event(new CategoryCreated($category));

            return $category;
        });
    }

    public function flattenTree(): Collection
    {
        return Category::orderBy('level')
            ->orderBy('name')
            ->get();
    }

    public function getAncestors(int $categoryId): Collection
    {
        $ancestors = collect();
        $category = Category::find($categoryId);

        while ($category && $category->parent_id) {
            $category = $category->parent;
            $ancestors->push($category);
        }

        return $ancestors->reverse();
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\CatalogManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:128'],
            'slug' => ['sometimes', 'string', 'max:128', 'unique:categories,slug'],
            'parent_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('name', 128);
            $table->string('slug', 128);
            $table->tinyInteger('level')->unsigned()->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('parent_id')->references('id')->on('categories')->nullOnDelete();
            $table->index('parent_id');
            $table->unique('slug', 'category_slug_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};`,
      policy: `<?php

namespace App\\Modules\\CatalogManagement\\Policies;

use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class CatalogPolicy
{
    use HandlesAuthorization;

    public function manage(User $user): bool
    {
        return $user->hasPermission('catalog.manage');
    }
}`
    },
    sampleRecords: [
      { id: 10, name: 'Cloud Hardware', slug: 'cloud-hardware', level: 1, count: 48 }
    ],
    status: 'Configured'
  },
  {
    id: 33,
    code: 'MOD-033',
    name: 'Inventory Management',
    slug: 'inventory-management',
    category: 'Commerce',
    phase: 4,
    iconName: 'Boxes',
    purpose: 'Multi-warehouse stock tracking, inventory reservations, safety stock alerts, and replenishment orders.',
    responsibilities: [
      'Track stock on hand, reserved stock, and available-to-promise (ATP)',
      'Pessimistically lock inventory during high-concurrency checkouts',
      'Trigger automated reorder alerts when safety stock thresholds breach'
    ],
    databaseTables: [
      {
        name: 'inventory_items',
        description: 'Stock levels per warehouse.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'product_id', references: 'id', table: 'products' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'product_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'warehouse_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'quantity_on_hand', type: 'INT', nullable: false },
          { name: 'quantity_reserved', type: 'INT', nullable: false },
          { name: 'safety_stock', type: 'INT', nullable: false }
        ],
        indexes: ['idx_inv_prod_wh']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/inventory/stock', description: 'Query stock levels', authRequired: true },
      { method: 'POST', path: '/api/v1/inventory/adjust', description: 'Perform manual stock count adjustment', authRequired: true }
    ],
    services: ['InventoryReservationService', 'StockAlertService'],
    permissions: ['inventory.view', 'inventory.adjust'],
    events: ['StockDepleted', 'SafetyStockBreached'],
    jobs: ['NotifyLowStockJob'],
    dependencies: [31],
    tests: ['InventoryAtomicLockTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\InventoryManagement\\Http\\Controllers;

use App\\Modules\\InventoryManagement\\Services\\InventoryReservationService;
use App\\Modules\\InventoryManagement\\Requests\\AdjustStockRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class InventoryController extends Controller
{
    public function __construct(
        private readonly InventoryReservationService $inventoryService
    ) {}

    public function stock(): JsonResponse
    {
        $stock = $this->inventoryService->getStockLevels(
            productId: request()->get('product_id'),
            warehouseId: request()->get('warehouse_id'),
        );

        return response()->json([
            'success' => true,
            'data' => $stock,
        ]);
    }

    public function adjust(AdjustStockRequest $request): JsonResponse
    {
        $result = $this->inventoryService->adjustStock(
            productId: $request->validated('product_id'),
            warehouseId: $request->validated('warehouse_id'),
            adjustment: $request->validated('adjustment'),
            reason: $request->validated('reason'),
        );

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}`,
      model: `<?php

namespace App\\Modules\\InventoryManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class InventoryItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'inventory_items';

    protected $fillable = [
        'product_id',
        'warehouse_id',
        'quantity_on_hand',
        'quantity_reserved',
        'safety_stock',
    ];

    protected function casts(): array
    {
        return [
            'quantity_on_hand' => 'integer',
            'quantity_reserved' => 'integer',
            'safety_stock' => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getAvailableQuantity(): int
    {
        return $this->quantity_on_hand - $this->quantity_reserved;
    }

    public function isBelowSafetyStock(): bool
    {
        return $this->getAvailableQuantity() <= $this->safety_stock;
    }

    public function reserve(int $quantity): void
    {
        if ($this->getAvailableQuantity() < $quantity) {
            abort(422, 'Insufficient available stock.');
        }

        $this->increment('quantity_reserved', $quantity);
    }

    public function releaseReservation(int $quantity): void
    {
        $this->decrement('quantity_reserved', $quantity);
    }

    public function fulfill(int $quantity): void
    {
        $this->decrement('quantity_on_hand', $quantity);
        $this->decrement('quantity_reserved', $quantity);
    }
}`,
      service: `<?php

namespace App\\Modules\\InventoryManagement\\Services;

use App\\Modules\\InventoryManagement\\Models\\InventoryItem;
use App\\Modules\\InventoryManagement\\Events\\StockDepleted;
use App\\Modules\\InventoryManagement\\Events\\SafetyStockBreached;
use Illuminate\\Support\\Collection;
use Illuminate\\Support\\Facades\\DB;

class InventoryReservationService
{
    public function getStockLevels(?int $productId = null, ?int $warehouseId = null): Collection
    {
        $query = InventoryItem::with('product');

        if ($productId) {
            $query->where('product_id', $productId);
        }

        if ($warehouseId) {
            $query->where('warehouse_id', $warehouseId);
        }

        return $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'warehouse_id' => $item->warehouse_id,
                'on_hand' => $item->quantity_on_hand,
                'reserved' => $item->quantity_reserved,
                'available' => $item->getAvailableQuantity(),
                'safety_stock' => $item->safety_stock,
            ];
        });
    }

    public function adjustStock(int $productId, int $warehouseId, int $adjustment, string $reason): InventoryItem
    {
        return DB::transaction(function () use ($productId, $warehouseId, $adjustment, $reason) {
            $item = InventoryItem::firstOrCreate(
                ['product_id' => $productId, 'warehouse_id' => $warehouseId],
                ['quantity_on_hand' => 0, 'quantity_reserved' => 0, 'safety_stock' => 0]
            );

            $item->increment('quantity_on_hand', $adjustment);

            if ($item->isBelowSafetyStock()) {
                event(new SafetyStockBreached($item));
            }

            if ($item->quantity_on_hand <= 0) {
                event(new StockDepleted($item));
            }

            return $item->fresh();
        });
    }

    public function reserveStock(int $productId, int $warehouseId, int $quantity): InventoryItem
    {
        return DB::transaction(function () use ($productId, $warehouseId, $quantity) {
            $item = InventoryItem::where('product_id', $productId)
                ->where('warehouse_id', $warehouseId)
                ->lockForUpdate()
                ->firstOrFail();

            $item->reserve($quantity);

            return $item->fresh();
        });
    }

    public function fulfillReservation(int $inventoryItemId, int $quantity): void
    {
        DB::transaction(function () use ($inventoryItemId, $quantity) {
            $item = InventoryItem::lockForUpdate()->findOrFail($inventoryItemId);
            $item->fulfill($quantity);
        });
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\InventoryManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class AdjustStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'warehouse_id' => ['required', 'integer'],
            'adjustment' => ['required', 'integer'],
            'reason' => ['required', 'string', 'max:255'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('warehouse_id');
            $table->integer('quantity_on_hand')->default(0);
            $table->integer('quantity_reserved')->default(0);
            $table->integer('safety_stock')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['product_id', 'warehouse_id'], 'idx_inv_prod_wh');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};`,
      policy: `<?php

namespace App\\Modules\\InventoryManagement\\Policies;

use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class InventoryPolicy
{
    use HandlesAuthorization;

    public function view(User $user): bool
    {
        return $user->hasPermission('inventory.view');
    }

    public function adjust(User $user): bool
    {
        return $user->hasPermission('inventory.adjust');
    }
}`
    },
    sampleRecords: [
      { id: 501, product_sku: 'NX-SRV-01', warehouse: 'US-East-01', on_hand: 240, reserved: 18, available: 222 }
    ],
    status: 'Active'
  },
  {
    id: 34,
    code: 'MOD-034',
    name: 'Vendor Management',
    slug: 'vendor-management',
    category: 'Commerce',
    phase: 4,
    iconName: 'Factory',
    purpose: 'Supplier onboarding, vendor profiles, purchasing lead times, and performance quality scoring.',
    responsibilities: [
      'Maintain vendor contracts, tax documentation, and banking details',
      'Track historical delivery punctuality and defective item rates',
      'Catalog supplier-specific SKUs and wholesale price sheets'
    ],
    databaseTables: [
      {
        name: 'vendors',
        description: 'Wholesale suppliers and manufacturers.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'name', type: 'VARCHAR(255)', nullable: false },
          { name: 'code', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'contact_email', type: 'VARCHAR(255)', nullable: false },
          { name: 'rating', type: 'DECIMAL(3,2)', nullable: false }
        ],
        indexes: ['vendor_code_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/vendors', description: 'List verified vendors', authRequired: true },
      { method: 'POST', path: '/api/v1/vendors', description: 'Register new vendor', authRequired: true }
    ],
    services: ['VendorDirectoryService'],
    permissions: ['vendors.manage'],
    events: ['VendorApproved'],
    jobs: ['CalculateVendorRatingJob'],
    dependencies: [1],
    tests: ['VendorRatingTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\VendorManagement\\Http\\Controllers;

use App\\Modules\\VendorManagement\\Services\\VendorDirectoryService;
use App\\Modules\\VendorManagement\\Requests\\CreateVendorRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class VendorController extends Controller
{
    public function __construct(
        private readonly VendorDirectoryService $vendorService
    ) {}

    public function index(): JsonResponse
    {
        $vendors = $this->vendorService->listVerifiedVendors(
            search: request()->get('search'),
        );

        return response()->json([
            'success' => true,
            'data' => $vendors,
        ]);
    }

    public function store(CreateVendorRequest $request): JsonResponse
    {
        $vendor = $this->vendorService->registerVendor(
            data: $request->validated(),
        );

        return response()->json([
            'success' => true,
            'data' => $vendor,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Modules\\VendorManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Vendor extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'vendors';

    protected $fillable = [
        'name',
        'code',
        'contact_email',
        'rating',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'decimal:2',
        ];
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function isTopRated(): bool
    {
        return $this->rating >= 4.5;
    }
}`,
      service: `<?php

namespace App\\Modules\\VendorManagement\\Services;

use App\\Modules\\VendorManagement\\Models\\Vendor;
use App\\Modules\\VendorManagement\\Events\\VendorApproved;
use App\\Modules\\VendorManagement\\Jobs\\CalculateVendorRatingJob;
use Illuminate\\Support\\Collection;
use Illuminate\\Support\\Facades\\DB;

class VendorDirectoryService
{
    public function listVerifiedVendors(?string $search = null): Collection
    {
        $query = Vendor::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('rating', 'desc')->get();
    }

    public function registerVendor(array $data): Vendor
    {
        return DB::transaction(function () use ($data) {
            $vendor = Vendor::create([
                'name' => $data['name'],
                'code' => $data['code'],
                'contact_email' => $data['contact_email'],
                'rating' => $data['rating'] ?? 0,
            ]);

            event(new VendorApproved($vendor));

            return $vendor;
        });
    }

    public function calculateRating(Vendor $vendor): void
    {
        CalculateVendorRatingJob::dispatch($vendor);
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\VendorManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateVendorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:32', 'unique:vendors,code'],
            'contact_email' => ['required', 'email', 'max:255'],
            'rating' => ['sometimes', 'numeric', 'min:0', 'max:5'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('code', 32);
            $table->string('contact_email', 255);
            $table->decimal('rating', 3, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->unique('code', 'vendor_code_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};`,
      policy: `<?php

namespace App\\Modules\\VendorManagement\\Policies;

use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class VendorPolicy
{
    use HandlesAuthorization;

    public function manage(User $user): bool
    {
        return $user->hasPermission('vendors.manage');
    }
}`
    },
    sampleRecords: [
      { id: 1, name: 'Silicon Core Technologies', code: 'VND-SCT-01', rating: 4.88, email: 'supply@siliconcore.io' }
    ],
    status: 'Configured'
  },
  {
    id: 35,
    code: 'MOD-035',
    name: 'Seller Management',
    slug: 'seller-management',
    category: 'Commerce',
    phase: 4,
    iconName: 'Store',
    purpose: 'Marketplace third-party sellers, storefront configuration, KYC checks, and commission tiers.',
    responsibilities: [
      'Seller verification and business license approvals',
      'Store branding, policies, and seller badge levels',
      'Individual seller payout scheduling and bank account linking'
    ],
    databaseTables: [
      {
        name: 'sellers',
        description: 'Third-party marketplace store owners.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'store_name', type: 'VARCHAR(128)', nullable: false },
          { name: 'commission_rate', type: 'DECIMAL(5,2)', nullable: false },
          { name: 'status', type: 'ENUM("pending","verified","suspended")', nullable: false }
        ],
        indexes: ['idx_seller_user']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/sellers/me', description: 'Fetch seller store metrics', authRequired: true },
      { method: 'POST', path: '/api/v1/sellers/onboard', description: 'Submit merchant verification', authRequired: true }
    ],
    services: ['SellerStoreService', 'KycVerificationService'],
    permissions: ['sellers.onboard', 'sellers.manage'],
    events: ['SellerVerified'],
    jobs: ['VerifySellerKycDocumentsJob'],
    dependencies: [1],
    tests: ['SellerVerificationTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\SellerManagement\\Http\\Controllers;

use App\\Modules\\SellerManagement\\Services\\SellerStoreService;
use App\\Modules\\SellerManagement\\Requests\\OnboardSellerRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class SellerController extends Controller
{
    public function __construct(
        private readonly SellerStoreService $sellerService
    ) {}

    public function show(): JsonResponse
    {
        $seller = $this->sellerService->getSellerMetrics(auth()->id());

        return response()->json([
            'success' => true,
            'data' => $seller,
        ]);
    }

    public function onboard(OnboardSellerRequest $request): JsonResponse
    {
        $seller = $this->sellerService->onboardSeller(
            userId: auth()->id(),
            data: $request->validated(),
        );

        return response()->json([
            'success' => true,
            'data' => $seller,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Modules\\SellerManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Seller extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sellers';

    protected $fillable = [
        'user_id',
        'store_name',
        'commission_rate',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'commission_rate' => 'decimal:2',
            'status' => 'string',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Seller $seller) {
            $seller->status ??= 'pending';
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'vendor_id');
    }

    public function isVerified(): bool
    {
        return $this->status === 'verified';
    }

    public function verify(): void
    {
        $this->update(['status' => 'verified']);
    }

    public function suspend(): void
    {
        $this->update(['status' => 'suspended']);
    }
}`,
      service: `<?php

namespace App\\Modules\\SellerManagement\\Services;

use App\\Modules\\SellerManagement\\Models\\Seller;
use App\\Modules\\SellerManagement\\Events\\SellerVerified;
use App\\Modules\\SellerManagement\\Jobs\\VerifySellerKycDocumentsJob;
use Illuminate\\Support\\Facades\\DB;

class SellerStoreService
{
    public function getSellerMetrics(int $userId): ?Seller
    {
        return Seller::withCount('products')
            ->where('user_id', $userId)
            ->first();
    }

    public function onboardSeller(int $userId, array $data): Seller
    {
        return DB::transaction(function () use ($userId, $data) {
            $seller = Seller::create([
                'user_id' => $userId,
                'store_name' => $data['store_name'],
                'commission_rate' => $data['commission_rate'] ?? 10.00,
                'status' => 'pending',
            ]);

            VerifySellerKycDocumentsJob::dispatch($seller);

            return $seller;
        });
    }

    public function verifySeller(Seller $seller): Seller
    {
        return DB::transaction(function () use ($seller) {
            $seller->verify();
            event(new SellerVerified($seller));

            return $seller->fresh();
        });
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\SellerManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class OnboardSellerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'store_name' => ['required', 'string', 'max:128'],
            'commission_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('store_name', 128);
            $table->decimal('commission_rate', 5, 2)->default(10.00);
            $table->enum('status', ['pending', 'verified', 'suspended'])->default('pending');
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id', 'idx_seller_user');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sellers');
    }
};`,
      policy: `<?php

namespace App\\Modules\\SellerManagement\\Policies;

use App\\Modules\\SellerManagement\\Models\\Seller;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class SellerPolicy
{
    use HandlesAuthorization;

    public function onboard(User $user): bool
    {
        return $user->hasPermission('sellers.onboard');
    }

    public function manage(User $user, Seller $seller): bool
    {
        return $user->hasPermission('sellers.manage')
            || $seller->user_id === $user->id;
    }
}`
    },
    sampleRecords: [
      { id: 21, store: 'Alpha Computing Gear', commission: '8.5%', status: 'verified', rating: 4.9 }
    ],
    status: 'Configured'
  },
  {
    id: 36,
    code: 'MOD-036',
    name: 'Marketplace Management',
    slug: 'marketplace-management',
    category: 'Commerce',
    phase: 4,
    iconName: 'ShoppingBag',
    purpose: 'Multi-vendor marketplace orchestration, multi-seller cart splits, and order routing.',
    responsibilities: [
      'Split customer checkout carts into discrete sub-orders per merchant',
      'Enforce marketplace terms of service and seller standards',
      'Resolve buyer-seller disputes and mediation claims'
    ],
    databaseTables: [
      {
        name: 'marketplace_settings',
        description: 'Marketplace global configurations and commission rules.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'default_commission', type: 'DECIMAL(5,2)', nullable: false },
          { name: 'dispute_window_days', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: []
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/marketplace/overview', description: 'Platform GMV and vendor metrics', authRequired: true }
    ],
    services: ['MarketplaceOrchestratorService'],
    permissions: ['marketplace.admin'],
    events: ['MarketplaceOrderSplit'],
    jobs: ['CalculateDailyGmvJob'],
    dependencies: [31, 35],
    tests: ['CartSplittingTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\MarketplaceManagement\\Http\\Controllers;

use App\\Modules\\MarketplaceManagement\\Services\\MarketplaceOrchestratorService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class MarketplaceController extends Controller
{
    public function __construct(
        private readonly MarketplaceOrchestratorService $marketplaceService
    ) {}

    public function overview(): JsonResponse
    {
        $metrics = $this->marketplaceService->getPlatformMetrics();

        return response()->json([
            'success' => true,
            'data' => $metrics,
        ]);
    }
}`,
      model: `<?php

namespace App\\Modules\\MarketplaceManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class MarketplaceSetting extends Model
{
    protected $table = 'marketplace_settings';

    protected $fillable = [
        'default_commission',
        'dispute_window_days',
    ];

    protected function casts(): array
    {
        return [
            'default_commission' => 'decimal:2',
            'dispute_window_days' => 'integer',
        ];
    }

    public static function getSettings(): self
    {
        return static::firstOrCreate([], [
            'default_commission' => 10.00,
            'dispute_window_days' => 14,
        ]);
    }

    public function getCommissionForSeller(float $amount): float
    {
        return round($amount * ($this->default_commission / 100), 2);
    }
}`,
      service: `<?php

namespace App\\Modules\\MarketplaceManagement\\Services;

use App\\Modules\\MarketplaceManagement\\Models\\MarketplaceSetting;
use App\\Modules\\OrderManagement\\Models\\Order;
use App\\Modules\\SellerManagement\\Models\\Seller;
use App\\Modules\\MarketplaceManagement\\Events\\MarketplaceOrderSplit;
use Illuminate\\Support\\Facades\\DB;

class MarketplaceOrchestratorService
{
    public function getPlatformMetrics(): array
    {
        $settings = MarketplaceSetting::getSettings();

        $totalGmv = Order::where('status', '!=', 'cancelled')->sum('total');
        $activeSellers = Seller::where('status', 'verified')->count();
        $totalOrders = Order::count();

        return [
            'total_gmv' => $totalGmv,
            'active_sellers' => $activeSellers,
            'total_orders' => $totalOrders,
            'default_commission' => $settings->default_commission,
            'dispute_window_days' => $settings->dispute_window_days,
        ];
    }

    public function splitCartOrder(array $items, int $customerId): array
    {
        return DB::transaction(function () use ($items, $customerId) {
            $grouped = collect($items)->groupBy('seller_id');
            $subOrders = [];

            foreach ($grouped as $sellerId => $sellerItems) {
                $order = Order::create([
                    'order_number' => 'ORD-' . strtoupper(\\Illuminate\\Support\\Str::random(8)),
                    'user_id' => $customerId,
                    'status' => 'pending',
                    'subtotal' => $sellerItems->sum(fn ($item) => $item['price'] * $item['quantity']),
                    'tax_total' => 0,
                    'shipping_total' => 0,
                    'total' => $sellerItems->sum(fn ($item) => $item['price'] * $item['quantity']),
                ]);

                $subOrders[] = $order;
            }

            event(new MarketplaceOrderSplit($subOrders, $customerId));

            return $subOrders;
        });
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\MarketplaceManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('admin', MarketplaceSetting::class);
    }

    public function rules(): array
    {
        return [
            'default_commission' => ['sometimes', 'numeric', 'min:0', 'max:50'],
            'dispute_window_days' => ['sometimes', 'integer', 'min:1', 'max:90'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketplace_settings', function (Blueprint $table) {
            $table->id();
            $table->decimal('default_commission', 5, 2)->default(10.00);
            $table->unsignedInteger('dispute_window_days')->default(14);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketplace_settings');
    }
};`,
      policy: `<?php

namespace App\\Modules\\MarketplaceManagement\\Policies;

use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class MarketplacePolicy
{
    use HandlesAuthorization;

    public function admin(User $user): bool
    {
        return $user->hasPermission('marketplace.admin');
    }
}`
    },
    sampleRecords: [
      { id: 1, default_commission: '10.0%', dispute_window: '14 days', active_merchants: 184 }
    ],
    status: 'Configured'
  },
  {
    id: 37,
    code: 'MOD-037',
    name: 'Order Management',
    slug: 'order-management',
    category: 'Commerce',
    phase: 4,
    iconName: 'ShoppingCart',
    purpose: 'Customer checkout, order state machine (Pending, Paid, Shipped, Completed, Cancelled), and line items.',
    responsibilities: [
      'Atomically execute checkout transactions with inventory reservation',
      'Generate immutable order line item records with unit prices at purchase',
      'Handle order cancellation, modifications, and fulfillment status updates'
    ],
    databaseTables: [
      {
        name: 'orders',
        description: 'Master order records.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'order_number', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'status', type: 'ENUM("pending","paid","processing","shipped","delivered","cancelled")', nullable: false },
          { name: 'subtotal', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'tax_total', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'shipping_total', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'total', type: 'DECIMAL(12,2)', nullable: false }
        ],
        indexes: ['order_number_unique', 'idx_order_user_status']
      },
      {
        name: 'order_items',
        description: 'Order item lines.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [
          { column: 'order_id', references: 'id', table: 'orders' },
          { column: 'product_id', references: 'id', table: 'products' }
        ],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'order_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'product_id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'quantity', type: 'INT UNSIGNED', nullable: false },
          { name: 'unit_price', type: 'DECIMAL(10,2)', nullable: false }
        ],
        indexes: ['idx_order_items']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/orders', description: 'List customer orders', authRequired: true },
      { method: 'POST', path: '/api/v1/orders/checkout', description: 'Atomic checkout execution', authRequired: true },
      { method: 'GET', path: '/api/v1/orders/{id}', description: 'Order detail and tracking', authRequired: true }
    ],
    services: ['OrderPlacementService', 'OrderStateMachineService'],
    permissions: ['orders.create', 'orders.view', 'orders.manage'],
    events: ['OrderPlaced', 'OrderPaid', 'OrderShipped', 'OrderCancelled'],
    jobs: ['ProcessOrderFulfillmentJob'],
    dependencies: [1, 31, 33],
    tests: ['AtomicCheckoutTest', 'OrderStateTransitionTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\OrderManagement\\Http\\Controllers;

use App\\Modules\\OrderManagement\\Services\\OrderPlacementService;
use App\\Modules\\OrderManagement\\Requests\\CheckoutRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderPlacementService $orderService
    ) {}

    public function index(): JsonResponse
    {
        $orders = $this->orderService->listUserOrders(
            userId: auth()->id(),
            status: request()->get('status'),
        );

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $order = $this->orderService->placeOrder(
            userId: auth()->id(),
            items: $request->validated('items'),
            shippingAddress: $request->validated('shipping_address'),
        );

        return response()->json([
            'success' => true,
            'data' => $order,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $order = $this->orderService->getOrderDetail(
            orderId: $id,
            userId: auth()->id(),
        );

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }
}`,
      model: `<?php

namespace App\\Modules\\OrderManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'orders';

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'subtotal',
        'tax_total',
        'shipping_total',
        'total',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'tax_total' => 'decimal:2',
            'shipping_total' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            $order->order_number ??= 'ORD-' . strtoupper(\\Illuminate\\Support\\Str::random(8));
            $order->status ??= 'pending';
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'Pending',
            'paid' => 'Paid',
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
            default => ucfirst($this->status),
        };
    }
}`,
      service: `<?php

namespace App\\Modules\\OrderManagement\\Services;

use App\\Modules\\OrderManagement\\Models\\Order;
use App\\Modules\\OrderManagement\\Models\\OrderItem;
use App\\Modules\\OrderManagement\\Events\\OrderPlaced;
use App\\Modules\\OrderManagement\\Events\\OrderPaid;
use App\\Modules\\OrderManagement\\Events\\OrderShipped;
use App\\Modules\\OrderManagement\\Events\\OrderCancelled;
use App\\Modules\\InventoryManagement\\Services\\InventoryReservationService;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Collection;

class OrderPlacementService
{
    public function __construct(
        private readonly InventoryReservationService $inventoryService,
    ) {}

    public function listUserOrders(int $userId, ?string $status = null): Collection
    {
        $query = Order::with('items.product')
            ->where('user_id', $userId);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function placeOrder(int $userId, array $items, array $shippingAddress): Order
    {
        return DB::transaction(function () use ($userId, $items, $shippingAddress) {
            $subtotal = 0;

            foreach ($items as $item) {
                $subtotal += $item['price'] * $item['quantity'];
            }

            $taxTotal = round($subtotal * 0.08, 2);
            $shippingTotal = $subtotal >= 100 ? 0 : 9.99;
            $total = $subtotal + $taxTotal + $shippingTotal;

            $order = Order::create([
                'user_id' => $userId,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax_total' => $taxTotal,
                'shipping_total' => $shippingTotal,
                'total' => $total,
            ]);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                ]);

                $this->inventoryService->reserveStock(
                    productId: $item['product_id'],
                    warehouseId: 1,
                    quantity: $item['quantity'],
                );
            }

            event(new OrderPlaced($order));

            return $order->load('items.product');
        });
    }

    public function getOrderDetail(int $orderId, int $userId): Order
    {
        return Order::with('items.product', 'shipments')
            ->where('id', $orderId)
            ->where('user_id', $userId)
            ->firstOrFail();
    }

    public function updateStatus(Order $order, string $status): Order
    {
        return DB::transaction(function () use ($order, $status) {
            $order->update(['status' => $status]);

            match ($status) {
                'paid' => event(new OrderPaid($order)),
                'shipped' => event(new OrderShipped($order)),
                'cancelled' => event(new OrderCancelled($order)),
                default => null,
            };

            return $order->fresh();
        });
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\OrderManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'shipping_address' => ['required', 'array'],
            'shipping_address.street' => ['required', 'string'],
            'shipping_address.city' => ['required', 'string'],
            'shipping_address.state' => ['required', 'string'],
            'shipping_address.zip' => ['required', 'string'],
            'shipping_address.country' => ['required', 'string', 'size:2'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 32);
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('tax_total', 12, 2)->default(0);
            $table->decimal('shipping_total', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->timestamps();
            $table->softDeletes();

            $table->unique('order_number', 'order_number_unique');
            $table->index(['user_id', 'status'], 'idx_order_user_status');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->timestamps();

            $table->index(['order_id', 'product_id'], 'idx_order_items');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};`,
      policy: `<?php

namespace App\\Modules\\OrderManagement\\Policies;

use App\\Modules\\OrderManagement\\Models\\Order;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    public function create(User $user): bool
    {
        return $user->hasPermission('orders.create');
    }

    public function view(User $user, Order $order): bool
    {
        return $user->hasPermission('orders.view')
            || $order->user_id === $user->id;
    }

    public function manage(User $user, Order $order): bool
    {
        return $user->hasPermission('orders.manage');
    }
}`
    },
    sampleRecords: [
      { id: 4812, order_number: 'ORD-2026-4812', customer: 'Alex Chen', status: 'processing', total: 2499.00, items_count: 1 },
      { id: 4813, order_number: 'ORD-2026-4813', customer: 'Sarah Connor', status: 'shipped', total: 699.00, items_count: 2 }
    ],
    status: 'Active'
  },
  {
    id: 38,
    code: 'MOD-038',
    name: 'Shipping Management',
    slug: 'shipping-management',
    category: 'Commerce',
    phase: 4,
    iconName: 'Truck',
    purpose: 'Carrier shipping integrations (FedEx, UPS, DHL), tracking numbers, and delivery webhooks.',
    responsibilities: [
      'Calculate real-time shipping rate quotes based on weight and address',
      'Generate PDF shipping labels with barcodes',
      'Ingest carrier webhook events for in-transit and delivered milestones'
    ],
    databaseTables: [
      {
        name: 'shipments',
        description: 'Physical shipments and tracking.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'order_id', references: 'id', table: 'orders' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'order_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'carrier', type: 'VARCHAR(64)', nullable: false },
          { name: 'tracking_number', type: 'VARCHAR(128)', nullable: false, index: true },
          { name: 'status', type: 'ENUM("label_created","in_transit","out_for_delivery","delivered")', nullable: false }
        ],
        indexes: ['idx_tracking_num']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/shipping/rates', description: 'Get live shipping rates', authRequired: true },
      { method: 'POST', path: '/api/v1/shipping/labels', description: 'Generate carrier label', authRequired: true }
    ],
    services: ['ShippingCarrierService', 'LabelGenerationService'],
    permissions: ['shipping.manage'],
    events: ['ShipmentCreated', 'ShipmentDelivered'],
    jobs: ['PollCarrierTrackingJob'],
    dependencies: [37],
    tests: ['CarrierRateCalculationTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\ShippingManagement\\Http\\Controllers;

use App\\Modules\\ShippingManagement\\Services\\ShippingCarrierService;
use App\\Modules\\ShippingManagement\\Services\\LabelGenerationService;
use App\\Modules\\ShippingManagement\\Requests\\CreateShipmentRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class ShippingController extends Controller
{
    public function __construct(
        private readonly ShippingCarrierService $carrierService,
        private readonly LabelGenerationService $labelService,
    ) {}

    public function rates(CreateShipmentRequest $request): JsonResponse
    {
        $rates = $this->carrierService->getShippingRates(
            orderId: $request->validated('order_id'),
            destination: $request->validated('destination'),
        );

        return response()->json([
            'success' => true,
            'data' => $rates,
        ]);
    }

    public function labels(CreateShipmentRequest $request): JsonResponse
    {
        $label = $this->labelService->generateLabel(
            orderId: $request->validated('order_id'),
            carrier: $request->validated('carrier'),
        );

        return response()->json([
            'success' => true,
            'data' => $label,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Modules\\ShippingManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Shipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'shipments';

    protected $fillable = [
        'order_id',
        'carrier',
        'tracking_number',
        'status',
        'label_url',
    ];

    protected function casts(): array
    {
        return [];
    }

    protected static function booted(): void
    {
        static::creating(function (Shipment $shipment) {
            $shipment->status ??= 'label_created';
        });
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function isInTransit(): bool
    {
        return $this->status === 'in_transit';
    }

    public function isDelivered(): bool
    {
        return $this->status === 'delivered';
    }

    public function updateStatus(string $status): void
    {
        $this->update(['status' => $status]);
    }
}`,
      service: `<?php

namespace App\\Modules\\ShippingManagement\\Services;

use App\\Modules\\ShippingManagement\\Models\\Shipment;
use App\\Modules\\OrderManagement\\Models\\Order;
use App\\Modules\\ShippingManagement\\Events\\ShipmentCreated;
use App\\Modules\\ShippingManagement\\Events\\ShipmentDelivered;
use Illuminate\\Support\\Facades\\DB;

class ShippingCarrierService
{
    public function getShippingRates(int $orderId, array $destination): array
    {
        $order = Order::with('items.product')->findOrFail($orderId);

        $totalWeight = $order->items->sum(fn ($item) => $item->quantity * 1.0);

        return [
            ['carrier' => 'FedEx', 'service' => 'Ground', 'rate' => 9.99, 'estimated_days' => 5],
            ['carrier' => 'UPS', 'service' => 'Ground', 'rate' => 10.49, 'estimated_days' => 5],
            ['carrier' => 'DHL', 'service' => 'Express', 'rate' => 15.99, 'estimated_days' => 2],
        ];
    }

    public function createShipment(int $orderId, string $carrier, string $trackingNumber): Shipment
    {
        return DB::transaction(function () use ($orderId, $carrier, $trackingNumber) {
            $shipment = Shipment::create([
                'order_id' => $orderId,
                'carrier' => $carrier,
                'tracking_number' => $trackingNumber,
                'status' => 'label_created',
            ]);

            event(new ShipmentCreated($shipment));

            return $shipment;
        });
    }

    public function processWebhook(string $trackingNumber, string $status): void
    {
        $shipment = Shipment::where('tracking_number', $trackingNumber)->first();

        if ($shipment) {
            $shipment->updateStatus($status);

            if ($status === 'delivered') {
                event(new ShipmentDelivered($shipment));
            }
        }
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\ShippingManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'carrier' => ['required', 'string', 'max:64'],
            'destination' => ['sometimes', 'array'],
            'destination.street' => ['required_with:destination', 'string'],
            'destination.city' => ['required_with:destination', 'string'],
            'destination.state' => ['required_with:destination', 'string'],
            'destination.zip' => ['required_with:destination', 'string'],
            'destination.country' => ['required_with:destination', 'string', 'size:2'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('carrier', 64);
            $table->string('tracking_number', 128);
            $table->enum('status', ['label_created', 'in_transit', 'out_for_delivery', 'delivered'])->default('label_created');
            $table->string('label_url', 512)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('tracking_number', 'idx_tracking_num');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};`,
      policy: `<?php

namespace App\\Modules\\ShippingManagement\\Policies;

use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class ShippingPolicy
{
    use HandlesAuthorization;

    public function manage(User $user): bool
    {
        return $user->hasPermission('shipping.manage');
    }
}`
    },
    sampleRecords: [
      { id: 991, order_id: 4813, carrier: 'FedEx Express', tracking: 'FX-8891-2309-US', status: 'in_transit' }
    ],
    status: 'Configured'
  },
  {
    id: 39,
    code: 'MOD-039',
    name: 'Returns Management',
    slug: 'returns-management',
    category: 'Commerce',
    phase: 4,
    iconName: 'Undo2',
    purpose: 'RMA (Return Merchandise Authorization) workflows, return inspections, restocking, and exchange orders.',
    responsibilities: [
      'Issue return authorizations with printable return slips',
      'Inspect physical return conditions at warehouse receipt',
      'Trigger restocking into available inventory or damage disposition'
    ],
    databaseTables: [
      {
        name: 'returns',
        description: 'Return requests and RMA tracking.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'order_id', references: 'id', table: 'orders' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'rma_number', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'order_id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'reason', type: 'VARCHAR(255)', nullable: false },
          { name: 'status', type: 'ENUM("requested","approved","received","restocked","refunded")', nullable: false }
        ],
        indexes: ['rma_num_unique']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/returns/request', description: 'Submit return request', authRequired: true },
      { method: 'PATCH', path: '/api/v1/returns/{id}/inspect', description: 'Record warehouse condition', authRequired: true }
    ],
    services: ['ReturnMerchandiseService'],
    permissions: ['returns.manage'],
    events: ['ReturnRequested', 'ReturnRestocked'],
    jobs: ['RestockInventoryJob'],
    dependencies: [33, 37],
    tests: ['RmaWorkflowTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\ReturnsManagement\\Http\\Controllers;

use App\\Modules\\ReturnsManagement\\Services\\ReturnMerchandiseService;
use App\\Modules\\ReturnsManagement\\Requests\\RequestReturnRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class ReturnsController extends Controller
{
    public function __construct(
        private readonly ReturnMerchandiseService $returnService
    ) {}

    public function request(RequestReturnRequest $request): JsonResponse
    {
        $return = $this->returnService->createReturnRequest(
            userId: auth()->id(),
            orderId: $request->validated('order_id'),
            reason: $request->validated('reason'),
            items: $request->validated('items', []),
        );

        return response()->json([
            'success' => true,
            'data' => $return,
        ], 201);
    }

    public function inspect(int $id): JsonResponse
    {
        $return = $this->returnService->inspectReturn(
            returnId: $id,
            condition: request()->input('condition'),
            notes: request()->input('notes'),
        );

        return response()->json([
            'success' => true,
            'data' => $return,
        ]);
    }
}`,
      model: `<?php

namespace App\\Modules\\ReturnsManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class ReturnRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'returns';

    protected $fillable = [
        'rma_number',
        'order_id',
        'user_id',
        'reason',
        'status',
        'inspection_notes',
    ];

    protected function casts(): array
    {
        return [];
    }

    protected static function booted(): void
    {
        static::creating(function (ReturnRequest $return) {
            $return->rma_number ??= self::generateRmaNumber();
            $return->status ??= 'requested';
        });
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function approve(): void
    {
        $this->update(['status' => 'approved']);
    }

    public function markReceived(): void
    {
        $this->update(['status' => 'received']);
    }

    public function restock(): void
    {
        $this->update(['status' => 'restocked']);
    }

    public function refund(): void
    {
        $this->update(['status' => 'refunded']);
    }

    private static function generateRmaNumber(): string
    {
        $latest = self::withTrashed()->latest('id')->first();
        $number = $latest ? (int) str_replace('RMA-', '', $latest->rma_number) + 1 : 1;

        return sprintf('RMA-%04d', $number);
    }
}`,
      service: `<?php

namespace App\\Modules\\ReturnsManagement\\Services;

use App\\Modules\\ReturnsManagement\\Models\\ReturnRequest;
use App\\Modules\\ReturnsManagement\\Events\\ReturnRequested;
use App\\Modules\\ReturnsManagement\\Events\\ReturnRestocked;
use App\\Modules\\ReturnsManagement\\Jobs\\RestockInventoryJob;
use Illuminate\\Support\\Facades\\DB;

class ReturnMerchandiseService
{
    public function createReturnRequest(int $userId, int $orderId, string $reason, array $items = []): ReturnRequest
    {
        return DB::transaction(function () use ($userId, $orderId, $reason, $items) {
            $return = ReturnRequest::create([
                'order_id' => $orderId,
                'user_id' => $userId,
                'reason' => $reason,
                'status' => 'requested',
            ]);

            event(new ReturnRequested($return));

            return $return;
        });
    }

    public function inspectReturn(int $returnId, string $condition, ?string $notes = null): ReturnRequest
    {
        return DB::transaction(function () use ($returnId, $condition, $notes) {
            $return = ReturnRequest::findOrFail($returnId);

            $return->update([
                'inspection_notes' => $notes,
            ]);

            if ($condition === 'restockable') {
                $return->restock();
                RestockInventoryJob::dispatch($return);
                event(new ReturnRestocked($return));
            } else {
                $return->markReceived();
            }

            return $return->fresh();
        });
    }

    public function approveReturn(ReturnRequest $return): ReturnRequest
    {
        $return->approve();
        return $return->fresh();
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\ReturnsManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class RequestReturnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'reason' => ['required', 'string', 'max:255'],
            'items' => ['sometimes', 'array'],
            'items.*.product_id' => ['required_with:items', 'integer'],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('returns', function (Blueprint $table) {
            $table->id();
            $table->string('rma_number', 32)->unique();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('user_id');
            $table->string('reason', 255);
            $table->enum('status', ['requested', 'approved', 'received', 'restocked', 'refunded'])->default('requested');
            $table->text('inspection_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique('rma_number', 'rma_num_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('returns');
    }
};`,
      policy: `<?php

namespace App\\Modules\\ReturnsManagement\\Policies;

use App\\Modules\\ReturnsManagement\\Models\\ReturnRequest;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class ReturnPolicy
{
    use HandlesAuthorization;

    public function manage(User $user, ReturnRequest $return): bool
    {
        return $user->hasPermission('returns.manage')
            || $return->user_id === $user->id;
    }
}`
    },
    sampleRecords: [
      { id: 18, rma: 'RMA-4029', order: 'ORD-2026-4410', reason: 'Ordered incorrect model size', status: 'approved' }
    ],
    status: 'Configured'
  },
  {
    id: 40,
    code: 'MOD-040',
    name: 'Procurement Management',
    slug: 'procurement-management',
    category: 'Commerce',
    phase: 4,
    iconName: 'ClipboardList',
    purpose: 'Purchase requisitions, RFQs (Request for Quotes), procurement approvals, and vendor purchase orders.',
    responsibilities: [
      'Draft and route internal purchase orders for executive sign-off',
      'Manage RFQ bidding across multiple competing vendors',
      'Track receiving slips against purchase order line quantities'
    ],
    databaseTables: [
      {
        name: 'purchase_orders',
        description: 'Vendor purchase orders.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'vendor_id', references: 'id', table: 'vendors' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'po_number', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'vendor_id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'total_amount', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'status', type: 'ENUM("draft","submitted","approved","received","cancelled")', nullable: false }
        ],
        indexes: ['po_num_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/procurement/orders', description: 'List purchase orders', authRequired: true },
      { method: 'POST', path: '/api/v1/procurement/orders', description: 'Create purchase order', authRequired: true }
    ],
    services: ['ProcurementService'],
    permissions: ['procurement.create', 'procurement.approve'],
    events: ['PurchaseOrderApproved'],
    jobs: ['DispatchPurchaseOrderPdfJob'],
    dependencies: [33, 34],
    tests: ['ProcurementApprovalTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Modules\\ProcurementManagement\\Http\\Controllers;

use App\\Modules\\ProcurementManagement\\Services\\ProcurementService;
use App\\Modules\\ProcurementManagement\\Requests\\CreatePurchaseOrderRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;

class ProcurementController extends Controller
{
    public function __construct(
        private readonly ProcurementService $procurementService
    ) {}

    public function index(): JsonResponse
    {
        $orders = $this->procurementService->listPurchaseOrders(
            filters: request()->only(['status', 'vendor_id']),
        );

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    public function store(CreatePurchaseOrderRequest $request): JsonResponse
    {
        $order = $this->procurementService->createPurchaseOrder(
            data: $request->validated(),
            createdBy: auth()->id(),
        );

        return response()->json([
            'success' => true,
            'data' => $order,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Modules\\ProcurementManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class PurchaseOrder extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'purchase_orders';

    protected $fillable = [
        'po_number',
        'vendor_id',
        'created_by',
        'total_amount',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (PurchaseOrder $po) {
            $po->po_number ??= self::generatePoNumber();
            $po->status ??= 'draft';
        });
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approve(): void
    {
        $this->update(['status' => 'approved']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    public function markReceived(): void
    {
        $this->update(['status' => 'received']);
    }

    private static function generatePoNumber(): string
    {
        $year = date('Y');
        $latest = self::where('po_number', 'like', "PO-{$year}-%")
            ->latest('id')
            ->first();

        $number = $latest ? (int) substr($latest->po_number, -3) + 1 : 1;

        return sprintf('PO-%s-%03d', $year, $number);
    }
}`,
      service: `<?php

namespace App\\Modules\\ProcurementManagement\\Services;

use App\\Modules\\ProcurementManagement\\Models\\PurchaseOrder;
use App\\Modules\\ProcurementManagement\\Events\\PurchaseOrderApproved;
use App\\Modules\\ProcurementManagement\\Jobs\\DispatchPurchaseOrderPdfJob;
use Illuminate\\Support\\Collection;
use Illuminate\\Support\\Facades\\DB;

class ProcurementService
{
    public function listPurchaseOrders(array $filters = []): Collection
    {
        $query = PurchaseOrder::with('vendor');

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['vendor_id'])) {
            $query->where('vendor_id', $filters['vendor_id']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function createPurchaseOrder(array $data, int $createdBy): PurchaseOrder
    {
        return DB::transaction(function () use ($data, $createdBy) {
            $order = PurchaseOrder::create([
                'vendor_id' => $data['vendor_id'],
                'created_by' => $createdBy,
                'total_amount' => $data['total_amount'],
                'notes' => $data['notes'] ?? null,
                'status' => 'draft',
            ]);

            return $order->load('vendor');
        });
    }

    public function approvePurchaseOrder(PurchaseOrder $order): PurchaseOrder
    {
        return DB::transaction(function () use ($order) {
            $order->approve();
            event(new PurchaseOrderApproved($order));
            DispatchPurchaseOrderPdfJob::dispatch($order);

            return $order->fresh('vendor');
        });
    }

    public function cancelPurchaseOrder(PurchaseOrder $order): PurchaseOrder
    {
        $order->cancel();
        return $order->fresh();
    }
}`,
      formRequest: `<?php

namespace App\\Modules\\ProcurementManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreatePurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vendor_id' => ['required', 'integer', 'exists:vendors,id'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'items' => ['sometimes', 'array'],
            'items.*.product_id' => ['required_with:items', 'integer'],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
            'items.*.unit_price' => ['required_with:items', 'numeric', 'min:0'],
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number', 32);
            $table->foreignId('vendor_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->decimal('total_amount', 12, 2);
            $table->enum('status', ['draft', 'submitted', 'approved', 'received', 'cancelled'])->default('draft');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique('po_number', 'po_num_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};`,
      policy: `<?php

namespace App\\Modules\\ProcurementManagement\\Policies;

use App\\Modules\\ProcurementManagement\\Models\\PurchaseOrder;
use App\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class ProcurementPolicy
{
    use HandlesAuthorization;

    public function create(User $user): bool
    {
        return $user->hasPermission('procurement.create');
    }

    public function approve(User $user, PurchaseOrder $order): bool
    {
        return $user->hasPermission('procurement.approve');
    }
}`
    },
    sampleRecords: [
      { id: 77, po_number: 'PO-2026-081', vendor: 'Silicon Core Technologies', amount: '$48,000.00', status: 'approved' }
    ],
    status: 'Configured'
  }
];
