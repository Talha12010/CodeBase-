
export const modulesDomain7_8 = [
  // DOMAIN 7: GAMING & ENTERTAINMENT (61-70)
  {
    id: 61,
    code: 'MOD-061',
    name: 'Game Management',
    slug: 'game-management',
    category: 'Gaming & Entertainment',
    phase: 7,
    iconName: 'Gamepad2',
    purpose: 'Game catalog, version releases, game server endpoints, developer API tokens, and game metadata.',
    responsibilities: [
      'Register games and supported platforms (PC, Mobile, WebGL)',
      'Manage game server connection clusters and matchmaking URLs',
      'Publish release patch notes and asset download manifests'
    ],
    databaseTables: [
      {
        name: 'games',
        description: 'Published game directory.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'title', type: 'VARCHAR(128)', nullable: false },
          { name: 'slug', type: 'VARCHAR(128)', nullable: false, index: true },
          { name: 'version', type: 'VARCHAR(32)', nullable: false },
          { name: 'active_players', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['game_slug_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/games', description: 'Browse games', authRequired: false },
      { method: 'POST', path: '/api/v1/games', description: 'Publish game title', authRequired: true }
    ],
    services: ['GameCatalogService'],
    permissions: ['games.manage'],
    events: ['GameVersionReleased'],
    jobs: ['AggregateActivePlayersJob'],
    dependencies: [1],
    tests: ['GameRegistryTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Gaming;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Gaming\\CreateGameRequest;
use App\\Services\\Gaming\\GameCatalogService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class GameController extends Controller
{
    public function __construct(
        private readonly GameCatalogService $gameCatalogService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $games = $this->gameCatalogService->listGames(
            perPage: $request->integer('per_page', 25)
        );

        return response()->json($games);
    }

    public function store(CreateGameRequest $request): JsonResponse
    {
        $game = $this->gameCatalogService->createGame($request->validated());

        return response()->json([
            'message' => 'Game published successfully.',
            'data' => $game,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Models\\Gaming;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Game extends Model
{
    protected $table = 'games';

    protected $fillable = [
        'title',
        'slug',
        'version',
        'active_players',
    ];

    protected $casts = [
        'active_players' => 'integer',
    ];

    public function tournaments(): HasMany
    {
        return $this->hasMany(Tournament::class);
    }

    public function leaderboards(): HasMany
    {
        return $this->hasMany(Leaderboard::class);
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(Achievement::class);
    }

    public function gameSessions(): HasMany
    {
        return $this->hasMany(GameSession::class);
    }
}`,
      service: `<?php

namespace App\\Services\\Gaming;

use App\\Events\\Gaming\\GameVersionReleased;
use App\\Models\\Gaming\\Game;
use Illuminate\\Support\\Facades\\DB;

class GameCatalogService
{
    public function listGames(int $perPage = 25)
    {
        return Game::query()
            ->orderByDesc('active_players')
            ->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Game
    {
        return Game::where('slug', $slug)->first();
    }

    public function findOrFail(int $id): Game
    {
        return Game::findOrFail($id);
    }

    public function createGame(array $data): Game
    {
        return DB::transaction(function () use ($data) {
            $game = Game::create($data);

            event(new GameVersionReleased($game));

            return $game;
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Gaming;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('games.manage');
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:128'],
            'slug' => ['required', 'string', 'max:128', 'unique:games,slug'],
            'version' => ['required', 'string', 'max:32'],
            'active_players' => ['required', 'integer', 'min:0'],
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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('title', 128);
            $table->string('slug', 128)->unique();
            $table->string('version', 32);
            $table->unsignedInteger('active_players')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Gaming;

use App\\Models\\User;

class GamePolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('games.manage');
    }

    public function view(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 1, title: 'Nexus Arena: Cyber Tactics', version: 'v2.4.1', active_players: 84200 }
    ],
    status: 'Active'
  },
  {
    id: 62,
    code: 'MOD-062',
    name: 'Player Management',
    slug: 'player-management',
    category: 'Gaming & Entertainment',
    phase: 7,
    iconName: 'User',
    purpose: 'Gamer tags, player MMR (Matchmaking Rating), skill brackets, player reputation scores, and hardware telemetry.',
    responsibilities: [
      'Validate unique gamer tags across game networks',
      'Compute skill ratings using Glicko-2 / TrueSkill algorithms',
      'Track player sportsmanship and anti-toxicity reputation'
    ],
    databaseTables: [
      {
        name: 'player_profiles',
        description: 'Gamer stats and MMR.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'gamer_tag', type: 'VARCHAR(48)', nullable: false, index: true },
          { name: 'mmr_rating', type: 'INT UNSIGNED', nullable: false },
          { name: 'reputation_score', type: 'TINYINT UNSIGNED', nullable: false }
        ],
        indexes: ['gamer_tag_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/players/{tag}', description: 'Fetch gamer profile', authRequired: false }
    ],
    services: ['PlayerStatsService', 'MmrCalculationService'],
    permissions: ['players.profile.edit'],
    events: ['PlayerMmrUpdated'],
    jobs: ['RecalculatePlayerPercentilesJob'],
    dependencies: [1],
    tests: ['MmrAlgorithmTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Gaming;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Gaming\\PlayerStatsService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class PlayerController extends Controller
{
    public function __construct(
        private readonly PlayerStatsService $playerStatsService
    ) {}

    public function show(string $tag): JsonResponse
    {
        $profile = $this->playerStatsService->findByGamerTag($tag);

        if (!$profile) {
            return response()->json(['message' => 'Player not found.'], 404);
        }

        return response()->json(['data' => $profile]);
    }
}`,
      model: `<?php

namespace App\\Models\\Gaming;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class PlayerProfile extends Model
{
    protected $table = 'player_profiles';

    protected $fillable = [
        'user_id',
        'gamer_tag',
        'mmr_rating',
        'reputation_score',
    ];

    protected $casts = [
        'mmr_rating' => 'integer',
        'reputation_score' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}`,
      service: `<?php

namespace App\\Services\\Gaming;

use App\\Events\\Gaming\\PlayerMmrUpdated;
use App\\Models\\Gaming\\PlayerProfile;
use Illuminate\\Support\\Facades\\DB;

class PlayerStatsService
{
    public function findByGamerTag(string $tag): ?PlayerProfile
    {
        return PlayerProfile::where('gamer_tag', $tag)->first();
    }

    public function recalculateAllPercentiles(): void
    {
        $profiles = PlayerProfile::orderByDesc('mmr_rating')->get();
        $total = $profiles->count();

        DB::transaction(function () use ($profiles, $total) {
            foreach ($profiles as $index => $profile) {
                $percentile = round((($total - $index) / $total) * 100, 1);
                $profile->update(['reputation_score' => (int) $percentile]);
            }
        });
    }

    public function updateMmr(PlayerProfile $profile, int $newMmr): void
    {
        DB::transaction(function () use ($profile, $newMmr) {
            $profile->update(['mmr_rating' => $newMmr]);
            event(new PlayerMmrUpdated($profile));
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Gaming;

use Illuminate\\Foundation\\Http\\FormRequest;

class UpdateGamerTagRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('players.profile.edit');
    }

    public function rules(): array
    {
        return [
            'gamer_tag' => [
                'required',
                'string',
                'max:48',
                'unique:player_profiles,gamer_tag,' . $this->route('tag') . ',gamer_tag',
            ],
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
        Schema::create('player_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('gamer_tag', 48)->unique();
            $table->unsignedInteger('mmr_rating')->default(1000);
            $table->unsignedTinyInteger('reputation_score')->default(50);
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_profiles');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Gaming;

use App\\Models\\User;

class PlayerPolicy
{
    public function editProfile(User $user): bool
    {
        return $user->hasPermission('players.profile.edit');
    }

    public function view(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 1, tag: 'CipherBlade', mmr: 2840, rank: 'Grandmaster Tier', reputation: 99 }
    ],
    status: 'Configured'
  },
  {
    id: 63,
    code: 'MOD-063',
    name: 'Tournament Management',
    slug: 'tournament-management',
    category: 'Gaming & Entertainment',
    phase: 7,
    iconName: 'Trophy',
    purpose: 'Esports tournament brackets (Single/Double Elimination, Swiss rounds), seeding, match scheduling, and prize pools.',
    responsibilities: [
      'Generate deterministic tournament brackets and seeding trees',
      'Advance bracket winners upon verified match result submission',
      'Escrow and distribute cryptocurrency or cash prize pools'
    ],
    databaseTables: [
      {
        name: 'tournaments',
        description: 'Competitive tournament ladders.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'game_id', references: 'id', table: 'games' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'game_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'name', type: 'VARCHAR(128)', nullable: false },
          { name: 'format', type: 'ENUM("single_elim","double_elim","swiss","round_robin")', nullable: false },
          { name: 'prize_pool', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'status', type: 'ENUM("registration","active","completed")', nullable: false }
        ],
        indexes: ['idx_tourn_status']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/tournaments', description: 'List tournaments', authRequired: false },
      { method: 'POST', path: '/api/v1/tournaments/{id}/bracket/advance', description: 'Advance bracket match', authRequired: true }
    ],
    services: ['BracketGeneratorService', 'PrizePoolEscrowService'],
    permissions: ['tournaments.create', 'tournaments.referee'],
    events: ['TournamentRoundCompleted', 'TournamentWinnerCrowned'],
    jobs: ['DistributePrizePoolJob'],
    dependencies: [1, 61, 62],
    tests: ['BracketProgressionIntegrityTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Gaming;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Gaming\\CreateTournamentRequest;
use App\\Services\\Gaming\\BracketGeneratorService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class TournamentController extends Controller
{
    public function __construct(
        private readonly BracketGeneratorService $bracketService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tournaments = $this->bracketService->listTournaments(
            status: $request->input('status'),
            perPage: $request->integer('per_page', 25)
        );

        return response()->json($tournaments);
    }

    public function advanceBracket(Request $request, int $id): JsonResponse
    {
        $result = $this->bracketService->advanceMatch(
            tournamentId: $id,
            matchId: $request->integer('match_id'),
            winnerId: $request->integer('winner_id')
        );

        return response()->json([
            'message' => 'Bracket advanced successfully.',
            'data' => $result,
        ]);
    }
}`,
      model: `<?php

namespace App\\Models\\Gaming;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Tournament extends Model
{
    protected $table = 'tournaments';

    protected $fillable = [
        'game_id',
        'name',
        'format',
        'prize_pool',
        'status',
    ];

    protected $casts = [
        'prize_pool' => 'decimal:2',
    ];

    protected $enumCastMap = [
        'format' => ['single_elim', 'double_elim', 'swiss', 'round_robin'],
        'status' => ['registration', 'active', 'completed'],
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}`,
      service: `<?php

namespace App\\Services\\Gaming;

use App\\Events\\Gaming\\TournamentRoundCompleted;
use App\\Events\\Gaming\\TournamentWinnerCrowned;
use App\\Models\\Gaming\\Tournament;
use Illuminate\\Support\\Facades\\DB;

class BracketGeneratorService
{
    public function listTournaments(?string $status = null, int $perPage = 25)
    {
        $query = Tournament::query()->with('game');

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function advanceMatch(int $tournamentId, int $matchId, int $winnerId): array
    {
        return DB::transaction(function () use ($tournamentId, $matchId, $winnerId) {
            $tournament = Tournament::findOrFail($tournamentId);

            event(new TournamentRoundCompleted($tournament, $matchId, $winnerId));

            if ($tournament->status === 'completed') {
                event(new TournamentWinnerCrowned($tournament, $winnerId));
            }

            return ['tournament_id' => $tournamentId, 'match_id' => $matchId, 'winner_id' => $winnerId];
        });
    }

    public function generateBracket(Tournament $tournament): array
    {
        $participants = $tournament->participants()->pluck('id')->toArray();
        shuffle($participants);

        $bracket = [];
        $round = 1;
        while (count($participants) > 1) {
            $matches = [];
            for ($i = 0; $i < count($participants); $i += 2) {
                $matches[] = [
                    'round' => $round,
                    'player_a' => $participants[$i] ?? null,
                    'player_b' => $participants[$i + 1] ?? null,
                ];
            }
            $bracket[] = $matches;
            $participants = array_map(fn($m) => $m['player_a'], $matches);
            $round++;
        }

        return $bracket;
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Gaming;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateTournamentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('tournaments.create');
    }

    public function rules(): array
    {
        return [
            'game_id' => ['required', 'exists:games,id'],
            'name' => ['required', 'string', 'max:128'],
            'format' => ['required', 'in:single_elim,double_elim,swiss,round_robin'],
            'prize_pool' => ['required', 'numeric', 'min:0'],
            'status' => ['sometimes', 'in:registration,active,completed'],
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
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->string('name', 128);
            $table->enum('format', ['single_elim', 'double_elim', 'swiss', 'round_robin']);
            $table->decimal('prize_pool', 12, 2)->default(0);
            $table->enum('status', ['registration', 'active', 'completed'])->default('registration');
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tournaments');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Gaming;

use App\\Models\\User;

class TournamentPolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermission('tournaments.create');
    }

    public function referee(User $user): bool
    {
        return $user->hasPermission('tournaments.referee');
    }

    public function view(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 101, name: 'Nexus Champions Invitational 2026', format: 'Double Elimination', prize_pool: '$100,000.00', status: 'active' }
    ],
    status: 'Active'
  },
  {
    id: 64,
    code: 'MOD-064',
    name: 'Competition Management',
    slug: 'competition-management',
    category: 'Gaming & Entertainment',
    phase: 7,
    iconName: 'Swords',
    purpose: 'Guild wars, community challenges, seasonal competitive ladders, and dispute arbitration.',
    responsibilities: [
      'Facilitate guild vs. guild competitive challenges',
      'Manage seasonal competitive resets and reward thresholds',
      'Resolve contested match replay disputes with referee tools'
    ],
    databaseTables: [
      {
        name: 'competitions',
        description: 'Community ladders and clan matches.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'title', type: 'VARCHAR(128)', nullable: false },
          { name: 'season_number', type: 'SMALLINT UNSIGNED', nullable: false },
          { name: 'end_time', type: 'TIMESTAMP', nullable: false }
        ],
        indexes: ['idx_comp_season']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/competitions/seasons', description: 'List competitive seasons', authRequired: false }
    ],
    services: ['CompetitiveLadderService'],
    permissions: ['competitions.manage'],
    events: ['SeasonEnded'],
    jobs: ['ArchiveSeasonLadderJob'],
    dependencies: [61, 62],
    tests: ['SeasonLadderResetTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Gaming;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Gaming\\CompetitiveLadderService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class CompetitionController extends Controller
{
    public function __construct(
        private readonly CompetitiveLadderService $ladderService
    ) {}

    public function seasons(Request $request): JsonResponse
    {
        $seasons = $this->ladderService->listSeasons(
            perPage: $request->integer('per_page', 25)
        );

        return response()->json($seasons);
    }
}`,
      model: `<?php

namespace App\\Models\\Gaming;

use Illuminate\\Database\\Eloquent\\Model;

class Competition extends Model
{
    protected $table = 'competitions';

    protected $fillable = [
        'title',
        'season_number',
        'end_time',
    ];

    protected $casts = [
        'season_number' => 'integer',
        'end_time' => 'datetime',
    ];
}`,
      service: `<?php

namespace App\\Services\\Gaming;

use App\\Events\\Gaming\\SeasonEnded;
use App\\Models\\Gaming\\Competition;
use Illuminate\\Support\\Facades\\DB;

class CompetitiveLadderService
{
    public function listSeasons(int $perPage = 25)
    {
        return Competition::query()
            ->orderByDesc('season_number')
            ->paginate($perPage);
    }

    public function endSeason(Competition $competition): void
    {
        DB::transaction(function () use ($competition) {
            $competition->update(['status' => 'completed']);
            event(new SeasonEnded($competition));
        });
    }

    public function createSeason(array $data): Competition
    {
        return Competition::create($data);
    }

    public function resetSeason(Competition $previousSeason): Competition
    {
        return DB::transaction(function () use ($previousSeason) {
            $previousSeason->update(['status' => 'completed']);
            event(new SeasonEnded($previousSeason));

            return $this->createSeason([
                'title' => 'Season ' . ($previousSeason->season_number + 1),
                'season_number' => $previousSeason->season_number + 1,
                'end_time' => now()->addDays(90),
            ]);
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Gaming;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateCompetitionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('competitions.manage');
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:128'],
            'season_number' => ['required', 'integer', 'min:1'],
            'end_time' => ['required', 'date', 'after:now'],
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
        Schema::create('competitions', function (Blueprint $table) {
            $table->id();
            $table->string('title', 128);
            $table->unsignedSmallInteger('season_number');
            $table->timestamp('end_time');
            $table->timestamps();

            $table->index('season_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('competitions');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Gaming;

use App\\Models\\User;

class CompetitionPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('competitions.manage');
    }

    public function view(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 1, title: 'Season 4: Cyber Ascent', season_number: 4, ends: '2026-11-01' }
    ],
    status: 'Configured'
  },
  {
    id: 65,
    code: 'MOD-065',
    name: 'Leaderboard Management',
    slug: 'leaderboard-management',
    category: 'Gaming & Entertainment',
    phase: 7,
    iconName: 'Medal',
    purpose: 'Real-time global, regional, and friends leaderboards powered by Redis sorted sets (`ZADD`, `ZREVRANK`).',
    responsibilities: [
      'Sub-millisecond leaderboard rank updates via Redis Sorted Sets',
      'Snapshot top-100 player leaderboards into MySQL for persistent records',
      'Compute relative percentile ranking around individual players'
    ],
    databaseTables: [
      {
        name: 'leaderboards',
        description: 'Historical leaderboard snapshots.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'game_id', references: 'id', table: 'games' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'game_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'board_name', type: 'VARCHAR(64)', nullable: false },
          { name: 'period', type: 'ENUM("all_time","monthly","weekly")', nullable: false }
        ],
        indexes: ['idx_leaderboard_game']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/leaderboards/{board}/top', description: 'Get top 100 players', authRequired: false },
      { method: 'GET', path: '/api/v1/leaderboards/{board}/around-me', description: 'Surrounding rank slice', authRequired: true }
    ],
    services: ['RedisLeaderboardService', 'LeaderboardSnapshotService'],
    permissions: ['leaderboard.view'],
    events: ['LeaderboardRecordBroken'],
    jobs: ['SnapshotRedisLeaderboardToMySqlJob'],
    dependencies: [61, 62],
    tests: ['RedisLeaderboardSpeedTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Gaming;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Gaming\\RedisLeaderboardService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class LeaderboardController extends Controller
{
    public function __construct(
        private readonly RedisLeaderboardService $leaderboardService
    ) {}

    public function top(string $board, Request $request): JsonResponse
    {
        $limit = $request->integer('limit', 100);
        $players = $this->leaderboardService->getTop($board, $limit);

        return response()->json(['data' => $players]);
    }

    public function aroundMe(string $board, Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $range = $request->integer('range', 10);

        $players = $this->leaderboardService->getAroundUser($board, $userId, $range);

        return response()->json(['data' => $players]);
    }
}`,
      model: `<?php

namespace App\\Models\\Gaming;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Leaderboard extends Model
{
    protected $table = 'leaderboards';

    protected $fillable = [
        'game_id',
        'board_name',
        'period',
    ];

    protected $enumCastMap = [
        'period' => ['all_time', 'monthly', 'weekly'],
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}`,
      service: `<?php

namespace App\\Services\\Gaming;

use App\\Events\\Gaming\\LeaderboardRecordBroken;
use App\\Models\\Gaming\\Leaderboard;
use Illuminate\\Support\\Facades\\Redis;

class RedisLeaderboardService
{
    private string $prefix = 'leaderboard:';

    public function updateScore(string $board, int $userId, float $score): void
    {
        $key = $this->prefix . $board;

        $previousRank = Redis::zrevrank($key, $userId);
        Redis::zadd($key, [$userId => $score]);

        if ($previousRank === false || $previousRank > 0) {
            $newRank = Redis::zrevrank($key, $userId);
            if ($newRank === 0) {
                event(new LeaderboardRecordBroken($board, $userId, $score));
            }
        }
    }

    public function getTop(string $board, int $limit = 100): array
    {
        $key = $this->prefix . $board;
        $entries = Redis::zrevrange($key, 0, $limit - 1, withScores: true);

        $results = [];
        $rank = 1;
        foreach ($entries as $userId => $score) {
            $results[] = [
                'rank' => $rank++,
                'user_id' => (int) $userId,
                'score' => (float) $score,
            ];
        }

        return $results;
    }

    public function getAroundUser(string $board, int $userId, int $range = 10): array
    {
        $key = $this->prefix . $board;
        $rank = Redis::zrevrank($key, $userId);

        if ($rank === false) {
            return [];
        }

        $start = max(0, $rank - $range);
        $end = $rank + $range;

        $entries = Redis::zrevrange($key, $start, $end, withScores: true);

        $results = [];
        $currentRank = $start + 1;
        foreach ($entries as $uid => $score) {
            $results[] = [
                'rank' => $currentRank++,
                'user_id' => (int) $uid,
                'score' => (float) $score,
                'is_current_user' => (int) $uid === $userId,
            ];
        }

        return $results;
    }

    public function getScore(string $board, int $userId): ?float
    {
        return Redis::zscore($this->prefix . $board, $userId);
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Gaming;

use Illuminate\\Foundation\\Http\\FormRequest;

class QueryLeaderboardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'board' => ['required', 'string', 'max:64'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'period' => ['sometimes', 'in:all_time,monthly,weekly'],
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
        Schema::create('leaderboards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->string('board_name', 64);
            $table->enum('period', ['all_time', 'monthly', 'weekly']);
            $table->timestamps();

            $table->index(['game_id', 'board_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leaderboards');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Gaming;

use App\\Models\\User;

class LeaderboardPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('leaderboard.view');
    }
}`
    },
    sampleRecords: [
      { rank: 1, player: 'CipherBlade', score: 98450, win_rate: '82.4%' },
      { rank: 2, player: 'NeonValkyrie', score: 96120, win_rate: '79.1%' }
    ],
    status: 'Active'
  },
  {
    id: 66,
    code: 'MOD-066',
    name: 'Achievement Management',
    slug: 'achievement-management',
    category: 'Gaming & Entertainment',
    phase: 7,
    iconName: 'Award',
    purpose: 'Unlockable badges, progress-based milestones, rarity metrics, and gamer achievement showcases.',
    responsibilities: [
      'Define achievement trigger criteria and milestone thresholds',
      'Track real-time player progress telemetry (e.g. 84/100 headshots)',
      'Calculate global rarity percentages dynamically'
    ],
    databaseTables: [
      {
        name: 'achievements',
        description: 'Defined unlockable achievements.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'game_id', references: 'id', table: 'games' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'game_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'code', type: 'VARCHAR(64)', nullable: false, index: true },
          { name: 'title', type: 'VARCHAR(128)', nullable: false },
          { name: 'points', type: 'SMALLINT UNSIGNED', nullable: false },
          { name: 'rarity_percent', type: 'DECIMAL(5,2)', nullable: false }
        ],
        indexes: ['achievement_code_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/achievements', description: 'List achievements', authRequired: false },
      { method: 'POST', path: '/api/v1/achievements/progress', description: 'Increment achievement progress', authRequired: true }
    ],
    services: ['AchievementEngineService'],
    permissions: ['achievements.manage'],
    events: ['AchievementUnlocked'],
    jobs: ['RecalculateAchievementRarityJob'],
    dependencies: [61, 62],
    tests: ['AchievementProgressIncrementTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Gaming;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Gaming\\RecordProgressRequest;
use App\\Services\\Gaming\\AchievementEngineService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class AchievementController extends Controller
{
    public function __construct(
        private readonly AchievementEngineService $achievementService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $achievements = $this->achievementService->listAchievements(
            gameId: $request->input('game_id'),
            perPage: $request->integer('per_page', 25)
        );

        return response()->json($achievements);
    }

    public function recordProgress(RecordProgressRequest $request): JsonResponse
    {
        $result = $this->achievementService->recordProgress(
            userId: $request->user()->id,
            achievementCode: $request->validated('achievement_code'),
            increment: $request->validated('increment', 1)
        );

        return response()->json([
            'message' => 'Progress recorded.',
            'data' => $result,
        ]);
    }
}`,
      model: `<?php

namespace App\\Models\\Gaming;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany;
use App\\Models\\User;

class Achievement extends Model
{
    protected $table = 'achievements';

    protected $fillable = [
        'game_id',
        'code',
        'title',
        'points',
        'rarity_percent',
    ];

    protected $casts = [
        'points' => 'integer',
        'rarity_percent' => 'decimal:2',
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_achievements')
            ->withPivot('progress', 'unlocked_at')
            ->withTimestamps();
    }
}`,
      service: `<?php

namespace App\\Services\\Gaming;

use App\\Events\\Gaming\\AchievementUnlocked;
use App\\Models\\Gaming\\Achievement;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

class AchievementEngineService
{
    public function listAchievements(?int $gameId = null, int $perPage = 25)
    {
        $query = Achievement::query()->with('game');

        if ($gameId) {
            $query->where('game_id', $gameId);
        }

        return $query->orderBy('code')->paginate($perPage);
    }

    public function recordProgress(int $userId, string $achievementCode, int $increment = 1): array
    {
        return DB::transaction(function () use ($userId, $achievementCode, $increment) {
            $achievement = Achievement::where('code', $achievementCode)->firstOrFail();
            $user = User::findOrFail($userId);

            $pivot = $achievement->users()->where('user_id', $userId)->first();

            if (!$pivot) {
                $achievement->users()->attach($userId, [
                    'progress' => $increment,
                    'unlocked_at' => null,
                ]);
                $progress = $increment;
            } else {
                $progress = $pivot->pivot->progress + $increment;
                $achievement->users()->updateExistingPivot($userId, [
                    'progress' => $progress,
                ]);
            }

            $unlocked = false;
            if ($progress >= $achievement->points && !$pivot?->pivot->unlocked_at) {
                $achievement->users()->updateExistingPivot($userId, [
                    'unlocked_at' => now(),
                ]);
                $unlocked = true;
                event(new AchievementUnlocked($user, $achievement));
            }

            return [
                'achievement_id' => $achievement->id,
                'progress' => $progress,
                'target' => $achievement->points,
                'unlocked' => $unlocked,
            ];
        });
    }

    public function recalculateRarity(): void
    {
        $totalUsers = User::count();

        if ($totalUsers === 0) {
            return;
        }

        Achievement::query()->each(function (Achievement $achievement) use ($totalUsers) {
            $unlockedCount = $achievement->users()
                ->whereNotNull('user_achievements.unlocked_at')
                ->count();

            $rarity = round(($unlockedCount / $totalUsers) * 100, 2);
            $achievement->update(['rarity_percent' => $rarity]);
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Gaming;

use Illuminate\\Foundation\\Http\\FormRequest;

class RecordProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'achievement_code' => ['required', 'string', 'max:64', 'exists:achievements,code'],
            'increment' => ['sometimes', 'integer', 'min:1', 'max:100'],
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
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->string('code', 64)->unique();
            $table->string('title', 128);
            $table->unsignedSmallInteger('points')->default(1);
            $table->decimal('rarity_percent', 5, 2)->default(100.00);
            $table->timestamps();

            $table->index('game_id');
        });

        Schema::create('user_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('achievement_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('progress')->default(0);
            $table->timestamp('unlocked_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'achievement_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_achievements');
        Schema::dropIfExists('achievements');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Gaming;

use App\\Models\\User;

class AchievementPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('achievements.manage');
    }

    public function view(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 1, title: 'Flawless Architecture', points: 50, rarity: '3.4%', unlocked: true }
    ],
    status: 'Configured'
  },
  {
    id: 67,
    code: 'MOD-067',
    name: 'Reward Management',
    slug: 'reward-management',
    category: 'Gaming & Entertainment',
    phase: 7,
    iconName: 'Gift',
    purpose: 'In-game loot drop distributions, promotional reward redemption codes, and claim validation.',
    responsibilities: [
      'Generate one-time promotional redemption codes',
      'Validate loot box probability distributions and compliance standards',
      'Deliver digital reward assets into player inventories'
    ],
    databaseTables: [
      {
        name: 'rewards',
        description: 'Distributable player rewards.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'claim_code', type: 'VARCHAR(64)', nullable: false, index: true },
          { name: 'reward_type', type: 'VARCHAR(32)', nullable: false },
          { name: 'is_claimed', type: 'BOOLEAN', nullable: false }
        ],
        indexes: ['claim_code_unique']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/rewards/redeem', description: 'Redeem claim code', authRequired: true }
    ],
    services: ['RewardDeliveryService'],
    permissions: ['rewards.manage'],
    events: ['RewardClaimed'],
    jobs: ['BatchGenerateRewardCodesJob'],
    dependencies: [1, 68],
    tests: ['RewardCodeRedemptionIntegrityTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Gaming;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Gaming\\RedeemCodeRequest;
use App\\Services\\Gaming\\RewardDeliveryService;
use Illuminate\\Http\\JsonResponse;

class RewardController extends Controller
{
    public function __construct(
        private readonly RewardDeliveryService $rewardService
    ) {}

    public function redeem(RedeemCodeRequest $request): JsonResponse
    {
        $result = $this->rewardService->claimReward(
            userId: $request->user()->id,
            claimCode: $request->validated('claim_code')
        );

        return response()->json([
            'message' => 'Reward claimed successfully.',
            'data' => $result,
        ]);
    }
}`,
      model: `<?php

namespace App\\Models\\Gaming;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany;
use App\\Models\\User;

class Reward extends Model
{
    protected $table = 'rewards';

    protected $fillable = [
        'claim_code',
        'reward_type',
        'is_claimed',
    ];

    protected $casts = [
        'is_claimed' => 'boolean',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_rewards')
            ->withPivot('claimed_at')
            ->withTimestamps();
    }
}`,
      service: `<?php

namespace App\\Services\\Gaming;

use App\\Events\\Gaming\\RewardClaimed;
use App\\Models\\Gaming\\Reward;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

class RewardDeliveryService
{
    public function claimReward(int $userId, string $claimCode): array
    {
        return DB::transaction(function () use ($userId, $claimCode) {
            $reward = Reward::where('claim_code', $claimCode)
                ->where('is_claimed', false)
                ->first();

            if (!$reward) {
                abort(422, 'Invalid or already claimed reward code.');
            }

            $alreadyClaimed = $reward->users()->where('user_id', $userId)->exists();
            if ($alreadyClaimed) {
                abort(422, 'You have already claimed this reward.');
            }

            $reward->users()->attach($userId, ['claimed_at' => now()]);
            $reward->update(['is_claimed' => true]);

            event(new RewardClaimed(User::findOrFail($userId), $reward));

            return [
                'reward_id' => $reward->id,
                'reward_type' => $reward->reward_type,
                'claimed_at' => now()->toDateTimeString(),
            ];
        });
    }

    public function generateCodes(string $rewardType, int $count, string $prefix = ''): array
    {
        $codes = [];
        for ($i = 0; $i < $count; $i++) {
            $code = strtoupper($prefix . bin2hex(random_bytes(4)));
            $codes[] = Reward::create([
                'claim_code' => $code,
                'reward_type' => $rewardType,
                'is_claimed' => false,
            ])->claim_code;
        }
        return $codes;
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Gaming;

use Illuminate\\Foundation\\Http\\FormRequest;

class RedeemCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'claim_code' => ['required', 'string', 'max:64'],
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
        Schema::create('rewards', function (Blueprint $table) {
            $table->id();
            $table->string('claim_code', 64)->unique();
            $table->string('reward_type', 32);
            $table->boolean('is_claimed')->default(false);
            $table->timestamps();
        });

        Schema::create('user_rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reward_id')->constrained()->cascadeOnDelete();
            $table->timestamp('claimed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'reward_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_rewards');
        Schema::dropIfExists('rewards');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Gaming;

use App\\Models\\User;

class RewardPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('rewards.manage');
    }

    public function view(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 812, code: 'NEXUS-LOOT-2026', type: 'Epic Skin Pack', is_claimed: false }
    ],
    status: 'Configured'
  },
  {
    id: 68,
    code: 'MOD-068',
    name: 'Virtual Economy',
    slug: 'virtual-economy',
    category: 'Gaming & Entertainment',
    phase: 7,
    iconName: 'Coins',
    purpose: 'Soft and hard virtual currencies, virtual asset marketplace, currency sinks, and faucets.',
    responsibilities: [
      'Balance currency generation rates (faucets) and sinks (upgrades/fees)',
      'Manage peer-to-peer virtual marketplace with item escrow',
      'Monitor real-time inflation and velocity indices of in-game credits'
    ],
    databaseTables: [
      {
        name: 'virtual_currencies',
        description: 'Digital platform token definitions.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'code', type: 'VARCHAR(16)', nullable: false, index: true },
          { name: 'name', type: 'VARCHAR(64)', nullable: false },
          { name: 'is_hard_currency', type: 'BOOLEAN', nullable: false }
        ],
        indexes: ['curr_code_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/economy/currencies', description: 'List currencies', authRequired: false }
    ],
    services: ['VirtualEconomyService'],
    permissions: ['economy.manage'],
    events: ['VirtualCurrencyMinted', 'VirtualCurrencyBurned'],
    jobs: ['AuditEconomyInflationJob'],
    dependencies: [1, 44],
    tests: ['CurrencySinkFaucetBalanceTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Gaming;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Gaming\\VirtualEconomyService;
use Illuminate\\Http\\JsonResponse;

class EconomyController extends Controller
{
    public function __construct(
        private readonly VirtualEconomyService $economyService
    ) {}

    public function index(): JsonResponse
    {
        $currencies = $this->economyService->listCurrencies();

        return response()->json(['data' => $currencies]);
    }
}`,
      model: `<?php

namespace App\\Models\\Gaming;

use Illuminate\\Database\\Eloquent\\Model;

class VirtualCurrency extends Model
{
    protected $table = 'virtual_currencies';

    protected $fillable = [
        'code',
        'name',
        'is_hard_currency',
    ];

    protected $casts = [
        'is_hard_currency' => 'boolean',
    ];
}`,
      service: `<?php

namespace App\\Services\\Gaming;

use App\\Events\\Gaming\\VirtualCurrencyBurned;
use App\\Events\\Gaming\\VirtualCurrencyMinted;
use App\\Models\\Gaming\\VirtualCurrency;
use Illuminate\\Support\\Facades\\DB;

class VirtualEconomyService
{
    public function listCurrencies()
    {
        return VirtualCurrency::orderBy('code')->get();
    }

    public function findByCode(string $code): ?VirtualCurrency
    {
        return VirtualCurrency::where('code', $code)->first();
    }

    public function mint(string $code, int $amount): void
    {
        DB::transaction(function () use ($code, $amount) {
            $currency = $this->findByCode($code);
            if (!$currency) {
                abort(422, 'Currency not found.');
            }

            event(new VirtualCurrencyMinted($currency, $amount));
        });
    }

    public function burn(string $code, int $amount): void
    {
        DB::transaction(function () use ($code, $amount) {
            $currency = $this->findByCode($code);
            if (!$currency) {
                abort(422, 'Currency not found.');
            }

            event(new VirtualCurrencyBurned($currency, $amount));
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Gaming;

use Illuminate\\Foundation\\Http\\FormRequest;

class MintCurrencyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('economy.manage');
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:16', 'exists:virtual_currencies,code'],
            'amount' => ['required', 'integer', 'min:1'],
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
        Schema::create('virtual_currencies', function (Blueprint $table) {
            $table->id();
            $table->string('code', 16)->unique();
            $table->string('name', 64);
            $table->boolean('is_hard_currency')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('virtual_currencies');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Gaming;

use App\\Models\\User;

class EconomyPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('economy.manage');
    }

    public function view(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { code: 'NEX-GOLD', name: 'Nexus Gold Credits (Hard)', supply: '1,420,000' },
      { code: 'NEX-SHARD', name: 'Cosmic Shards (Soft)', supply: '89,400,000' }
    ],
    status: 'Configured'
  },
  {
    id: 69,
    code: 'MOD-069',
    name: 'Game Session Management',
    slug: 'game-session-management',
    category: 'Gaming & Entertainment',
    phase: 7,
    iconName: 'Timer',
    purpose: 'Live multiplayer match telemetry, disconnect reconnect grace windows, ping monitor, and match logs.',
    responsibilities: [
      'Maintain match session state across distributed game server nodes',
      'Gracefully handle transient network packet drops and client reconnection',
      'Record high-frequency match telemetry snapshots for replay verification'
    ],
    databaseTables: [
      {
        name: 'game_sessions',
        description: 'Active match telemetry instances.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'game_id', references: 'id', table: 'games' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'game_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'server_ip', type: 'VARCHAR(45)', nullable: false },
          { name: 'duration_seconds', type: 'INT UNSIGNED', nullable: false },
          { name: 'status', type: 'ENUM("initializing","in_progress","finished")', nullable: false }
        ],
        indexes: ['idx_session_status']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/game-sessions/heartbeat', description: 'Server telemetry pulse', authRequired: true }
    ],
    services: ['GameSessionTrackerService'],
    permissions: ['sessions.report'],
    events: ['MatchEnded'],
    jobs: ['ProcessMatchTelemetryJob'],
    dependencies: [61, 62],
    tests: ['SessionDisconnectGraceTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Gaming;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Gaming\\SessionHeartbeatRequest;
use App\\Services\\Gaming\\GameSessionTrackerService;
use Illuminate\\Http\\JsonResponse;

class GameSessionController extends Controller
{
    public function __construct(
        private readonly GameSessionTrackerService $sessionService
    ) {}

    public function heartbeat(SessionHeartbeatRequest $request): JsonResponse
    {
        $result = $this->sessionService->processHeartbeat(
            sessionId: $request->validated('session_id'),
            serverIp: $request->validated('server_ip'),
            duration: $request->validated('duration_seconds')
        );

        return response()->json([
            'message' => 'Heartbeat recorded.',
            'data' => $result,
        ]);
    }
}`,
      model: `<?php

namespace App\\Models\\Gaming;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class GameSession extends Model
{
    protected $table = 'game_sessions';

    protected $fillable = [
        'game_id',
        'server_ip',
        'duration_seconds',
        'status',
    ];

    protected $casts = [
        'duration_seconds' => 'integer',
    ];

    protected $enumCastMap = [
        'status' => ['initializing', 'in_progress', 'finished'],
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}`,
      service: `<?php

namespace App\\Services\\Gaming;

use App\\Events\\Gaming\\MatchEnded;
use App\\Models\\Gaming\\GameSession;
use Illuminate\\Support\\Facades\\DB;

class GameSessionTrackerService
{
    public function processHeartbeat(int $sessionId, string $serverIp, int $duration): array
    {
        return DB::transaction(function () use ($sessionId, $serverIp, $duration) {
            $session = GameSession::findOrFail($sessionId);

            $session->update([
                'server_ip' => $serverIp,
                'duration_seconds' => $duration,
                'status' => 'in_progress',
            ]);

            return [
                'session_id' => $session->id,
                'status' => $session->status,
                'duration_seconds' => $duration,
            ];
        });
    }

    public function endSession(int $sessionId): void
    {
        DB::transaction(function () use ($sessionId) {
            $session = GameSession::findOrFail($sessionId);
            $session->update(['status' => 'finished']);

            event(new MatchEnded($session));
        });
    }

    public function createSession(int $gameId, string $serverIp): GameSession
    {
        return GameSession::create([
            'game_id' => $gameId,
            'server_ip' => $serverIp,
            'duration_seconds' => 0,
            'status' => 'initializing',
        ]);
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Gaming;

use Illuminate\\Foundation\\Http\\FormRequest;

class SessionHeartbeatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'session_id' => ['required', 'exists:game_sessions,id'],
            'server_ip' => ['required', 'ip', 'max:45'],
            'duration_seconds' => ['required', 'integer', 'min:0'],
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
        Schema::create('game_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->string('server_ip', 45);
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->enum('status', ['initializing', 'in_progress', 'finished'])->default('initializing');
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_sessions');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Gaming;

use App\\Models\\Gaming\\GameSession;
use App\\Models\\User;

class GameSessionPolicy
{
    public function report(User $user): bool
    {
        return $user->hasPermission('sessions.report');
    }

    public function view(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 9942, server: 'us-west-pod-12.nexus.net', players: 10, status: 'in_progress' }
    ],
    status: 'Configured'
  },
  {
    id: 70,
    code: 'MOD-070',
    name: 'Entertainment Management',
    slug: 'entertainment-management',
    category: 'Gaming & Entertainment',
    phase: 7,
    iconName: 'Clapperboard',
    purpose: 'Entertainment catalogs, curated playlists, multimedia trivia, interactive mini-games, and shows.',
    responsibilities: [
      'Curate multimedia digital entertainment experiences and playlists',
      'Deliver interactive live trivia sessions with synchronized countdown clocks',
      'Track user engagement time and content popularity rankings'
    ],
    databaseTables: [
      {
        name: 'entertainment_items',
        description: 'Curated entertainment assets and mini-games.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'title', type: 'VARCHAR(128)', nullable: false },
          { name: 'category', type: 'VARCHAR(64)', nullable: false },
          { name: 'views_count', type: 'BIGINT UNSIGNED', nullable: false }
        ],
        indexes: ['idx_ent_category']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/entertainment/featured', description: 'Get featured shows & trivia', authRequired: false }
    ],
    services: ['EntertainmentCatalogService'],
    permissions: ['entertainment.manage'],
    events: ['TriviaCompleted'],
    jobs: ['AggregateEntertainmentStatsJob'],
    dependencies: [1],
    tests: ['EntertainmentCatalogTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Gaming;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Gaming\\EntertainmentCatalogService;
use Illuminate\\Http\\JsonResponse;

class EntertainmentController extends Controller
{
    public function __construct(
        private readonly EntertainmentCatalogService $catalogService
    ) {}

    public function featured(): JsonResponse
    {
        $items = $this->catalogService->getFeatured();

        return response()->json(['data' => $items]);
    }
}`,
      model: `<?php

namespace App\\Models\\Gaming;

use Illuminate\\Database\\Eloquent\\Model;

class EntertainmentItem extends Model
{
    protected $table = 'entertainment_items';

    protected $fillable = [
        'title',
        'category',
        'views_count',
    ];

    protected $casts = [
        'views_count' => 'integer',
    ];
}`,
      service: `<?php

namespace App\\Services\\Gaming;

use App\\Models\\Gaming\\EntertainmentItem;

class EntertainmentCatalogService
{
    public function getFeatured(int $limit = 20)
    {
        return EntertainmentItem::orderByDesc('views_count')
            ->limit($limit)
            ->get();
    }

    public function listByCategory(string $category, int $perPage = 25)
    {
        return EntertainmentItem::where('category', $category)
            ->orderByDesc('views_count')
            ->paginate($perPage);
    }

    public function incrementViews(EntertainmentItem $item): void
    {
        $item->increment('views_count');
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Gaming;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateEntertainmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('entertainment.manage');
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:128'],
            'category' => ['required', 'string', 'max:64'],
            'views_count' => ['sometimes', 'integer', 'min:0'],
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
        Schema::create('entertainment_items', function (Blueprint $table) {
            $table->id();
            $table->string('title', 128);
            $table->string('category', 64);
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamps();

            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entertainment_items');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Gaming;

use App\\Models\\User;

class EntertainmentPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('entertainment.manage');
    }

    public function view(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 10, title: 'Weekly Enterprise Trivia Challenge', category: 'Interactive Trivia', views: 18400 }
    ],
    status: 'Configured'
  },

  // DOMAIN 8: MARKETING & GROWTH (71-80)
  {
    id: 71,
    code: 'MOD-071',
    name: 'Marketing Management',
    slug: 'marketing-management',
    category: 'Marketing & Growth',
    phase: 8,
    iconName: 'TrendingUp',
    purpose: 'Marketing workspace, multi-channel attribution models, UTM parameter tracking, and acquisition analytics.',
    responsibilities: [
      'Parse and store inbound UTM attribution parameters (source, medium, campaign)',
      'Calculate multi-touch customer journey attribution (first-touch, last-touch, linear)',
      'Aggregate customer acquisition cost (CAC) and blended return on ad spend (ROAS)'
    ],
    databaseTables: [
      {
        name: 'marketing_attributions',
        description: 'Session UTM touches and conversions.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
          { name: 'utm_source', type: 'VARCHAR(64)', nullable: false },
          { name: 'utm_medium', type: 'VARCHAR(64)', nullable: false },
          { name: 'utm_campaign', type: 'VARCHAR(128)', nullable: false },
          { name: 'converted', type: 'BOOLEAN', nullable: false }
        ],
        indexes: ['idx_utm_source_campaign']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/marketing/track-touch', description: 'Record UTM touchpoint', authRequired: false },
      { method: 'GET', path: '/api/v1/marketing/attribution-report', description: 'Attribution funnel report', authRequired: true }
    ],
    services: ['AttributionModelingService'],
    permissions: ['marketing.view', 'marketing.manage'],
    events: ['AttributionTouchRecorded', 'MarketingConversionAchieved'],
    jobs: ['ProcessAttributionModelJob'],
    dependencies: [1],
    tests: ['MultiTouchAttributionTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Marketing;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Marketing\\TrackTouchRequest;
use App\\Services\\Marketing\\AttributionModelingService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class MarketingController extends Controller
{
    public function __construct(
        private readonly AttributionModelingService $attributionService
    ) {}

    public function trackTouch(TrackTouchRequest $request): JsonResponse
    {
        $attribution = $this->attributionService->recordTouch($request->validated());

        return response()->json([
            'message' => 'Touchpoint recorded.',
            'data' => $attribution,
        ]);
    }

    public function attributionReport(Request $request): JsonResponse
    {
        $report = $this->attributionService->generateReport(
            model: $request->input('model', 'last_touch'),
            startDate: $request->input('start_date'),
            endDate: $request->input('end_date')
        );

        return response()->json(['data' => $report]);
    }
}`,
      model: `<?php

namespace App\\Models\\Marketing;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class MarketingAttribution extends Model
{
    protected $table = 'marketing_attributions';

    protected $fillable = [
        'user_id',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'converted',
    ];

    protected $casts = [
        'converted' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}`,
      service: `<?php

namespace App\\Services\\Marketing;

use App\\Events\\Marketing\\AttributionTouchRecorded;
use App\\Events\\Marketing\\MarketingConversionAchieved;
use App\\Models\\Marketing\\MarketingAttribution;
use Illuminate\\Support\\Facades\\DB;

class AttributionModelingService
{
    public function recordTouch(array $data): MarketingAttribution
    {
        return DB::transaction(function () use ($data) {
            $attribution = MarketingAttribution::create($data);

            event(new AttributionTouchRecorded($attribution));

            return $attribution;
        });
    }

    public function generateReport(?string $model = 'last_touch', ?string $startDate = null, ?string $endDate = null): array
    {
        $query = MarketingAttribution::query();

        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }

        $touches = $query->get();

        $bySource = $touches->groupBy('utm_source')->map(fn($items) => [
            'total_touches' => $items->count(),
            'conversions' => $items->where('converted', true)->count(),
            'conversion_rate' => $items->count() > 0
                ? round(($items->where('converted', true)->count() / $items->count()) * 100, 2)
                : 0,
        ]);

        $byCampaign = $touches->groupBy('utm_campaign')->map(fn($items) => [
            'total_touches' => $items->count(),
            'conversions' => $items->where('converted', true)->count(),
        ]);

        return [
            'model' => $model,
            'total_touches' => $touches->count(),
            'total_conversions' => $touches->where('converted', true)->count(),
            'by_source' => $bySource,
            'by_campaign' => $byCampaign,
        ];
    }

    public function calculateCAC(string $campaign, float $totalSpend): float
    {
        $conversions = MarketingAttribution::where('utm_campaign', $campaign)
            ->where('converted', true)
            ->count();

        return $conversions > 0 ? round($totalSpend / $conversions, 2) : 0.0;
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Marketing;

use Illuminate\\Foundation\\Http\\FormRequest;

class TrackTouchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['nullable', 'exists:users,id'],
            'utm_source' => ['required', 'string', 'max:64'],
            'utm_medium' => ['required', 'string', 'max:64'],
            'utm_campaign' => ['required', 'string', 'max:128'],
            'converted' => ['sometimes', 'boolean'],
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
        Schema::create('marketing_attributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('utm_source', 64);
            $table->string('utm_medium', 64);
            $table->string('utm_campaign', 128);
            $table->boolean('converted')->default(false);
            $table->timestamps();

            $table->index(['utm_source', 'utm_campaign']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_attributions');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Marketing;

use App\\Models\\User;

class MarketingPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('marketing.view');
    }

    public function manage(User $user): bool
    {
        return $user->hasPermission('marketing.manage');
    }
}`
    },
    sampleRecords: [
      { source: 'google-ads', medium: 'cpc', campaign: 'enterprise-launch-q3', conversion_rate: '4.2%' }
    ],
    status: 'Active'
  },
  {
    id: 72,
    code: 'MOD-072',
    name: 'Campaign Management',
    slug: 'campaign-management',
    category: 'Marketing & Growth',
    phase: 8,
    iconName: 'Target',
    purpose: 'Omnichannel marketing campaigns, budget allocations, schedules, audience segmentation, and performance goals.',
    responsibilities: [
      'Create and schedule marketing campaigns with defined budget caps',
      'Define targeted audience segments based on demographic and purchase behavior',
      'Track real-time conversion rates and spend against target milestones'
    ],
    databaseTables: [
      {
        name: 'campaigns',
        description: 'Marketing campaigns.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'name', type: 'VARCHAR(128)', nullable: false },
          { name: 'budget', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'spent', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'status', type: 'ENUM("draft","active","paused","completed")', nullable: false }
        ],
        indexes: ['idx_campaign_status']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/campaigns', description: 'List campaigns', authRequired: true },
      { method: 'POST', path: '/api/v1/campaigns', description: 'Launch campaign', authRequired: true }
    ],
    services: ['CampaignOrchestratorService'],
    permissions: ['campaigns.manage'],
    events: ['CampaignLaunched', 'CampaignBudgetDepleted'],
    jobs: ['EvaluateCampaignMetricsJob'],
    dependencies: [1, 71],
    tests: ['CampaignBudgetCapTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Marketing;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Marketing\\CreateCampaignRequest;
use App\\Services\\Marketing\\CampaignOrchestratorService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class CampaignController extends Controller
{
    public function __construct(
        private readonly CampaignOrchestratorService $campaignService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $campaigns = $this->campaignService->listCampaigns(
            status: $request->input('status'),
            perPage: $request->integer('per_page', 25)
        );

        return response()->json($campaigns);
    }

    public function store(CreateCampaignRequest $request): JsonResponse
    {
        $campaign = $this->campaignService->createCampaign($request->validated());

        return response()->json([
            'message' => 'Campaign launched.',
            'data' => $campaign,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Models\\Marketing;

use Illuminate\\Database\\Eloquent\\Model;

class Campaign extends Model
{
    protected $table = 'campaigns';

    protected $fillable = [
        'name',
        'budget',
        'spent',
        'status',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'spent' => 'decimal:2',
    ];

    protected $enumCastMap = [
        'status' => ['draft', 'active', 'paused', 'completed'],
    ];
}`,
      service: `<?php

namespace App\\Services\\Marketing;

use App\\Events\\Marketing\\CampaignBudgetDepleted;
use App\\Events\\Marketing\\CampaignLaunched;
use App\\Models\\Marketing\\Campaign;
use Illuminate\\Support\\Facades\\DB;

class CampaignOrchestratorService
{
    public function listCampaigns(?string $status = null, int $perPage = 25)
    {
        $query = Campaign::query();

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function createCampaign(array $data): Campaign
    {
        return DB::transaction(function () use ($data) {
            $data['spent'] = $data['spent'] ?? 0;
            $data['status'] = $data['status'] ?? 'draft';

            $campaign = Campaign::create($data);

            if ($data['status'] === 'active') {
                event(new CampaignLaunched($campaign));
            }

            return $campaign;
        });
    }

    public function pauseCampaign(Campaign $campaign): void
    {
        $campaign->update(['status' => 'paused']);
    }

    public function recordSpend(Campaign $campaign, float $amount): void
    {
        DB::transaction(function () use ($campaign, $amount) {
            $newSpent = $campaign->spent + $amount;
            $campaign->update(['spent' => $newSpent]);

            if ($newSpent >= $campaign->budget) {
                $campaign->update(['status' => 'completed']);
                event(new CampaignBudgetDepleted($campaign));
            }
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Marketing;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('campaigns.manage');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:128'],
            'budget' => ['required', 'numeric', 'min:0', 'max:999999999.99'],
            'spent' => ['sometimes', 'numeric', 'min:0'],
            'status' => ['sometimes', 'in:draft,active,paused,completed'],
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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name', 128);
            $table->decimal('budget', 12, 2)->default(0);
            $table->decimal('spent', 12, 2)->default(0);
            $table->enum('status', ['draft', 'active', 'paused', 'completed'])->default('draft');
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Marketing;

use App\\Models\\User;

class CampaignPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('campaigns.manage');
    }

    public function view(User $user): bool
    {
        return $user->hasPermission('campaigns.manage');
    }
}`
    },
    sampleRecords: [
      { id: 1, name: 'Q4 Enterprise Migration Sprint', budget: 50000.00, spent: 18200.00, status: 'active' }
    ],
    status: 'Active'
  },
  {
    id: 73,
    code: 'MOD-073',
    name: 'Advertising Management',
    slug: 'advertising-management',
    category: 'Marketing & Growth',
    phase: 8,
    iconName: 'Layers',
    purpose: 'In-app ad inventory slots, creative asset banners, CPM/CPC bidding engine, and impression tracking.',
    responsibilities: [
      'Manage ad placements across web and mobile viewports',
      'Track cryptographically verified impressions and click-throughs',
      'Enforce frequency capping to prevent viewer ad fatigue'
    ],
    databaseTables: [
      {
        name: 'ad_creatives',
        description: 'Banner creatives and target links.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'slot_name', type: 'VARCHAR(64)', nullable: false },
          { name: 'impressions_count', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'clicks_count', type: 'BIGINT UNSIGNED', nullable: false }
        ],
        indexes: ['idx_ad_slot']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/ads/serve', description: 'Serve optimized creative', authRequired: false },
      { method: 'POST', path: '/api/v1/ads/impression', description: 'Log impression event', authRequired: false }
    ],
    services: ['AdServingEngineService'],
    permissions: ['ads.manage'],
    events: ['AdServed', 'AdClicked'],
    jobs: ['ProcessAdImpressionBatchJob'],
    dependencies: [1],
    tests: ['FrequencyCappingTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Marketing;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Marketing\\AdServingEngineService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class AdController extends Controller
{
    public function __construct(
        private readonly AdServingEngineService $adService
    ) {}

    public function serve(Request $request): JsonResponse
    {
        $creative = $this->adService->serveAd(
            slotName: $request->input('slot_name'),
            userId: $request->input('user_id')
        );

        return response()->json(['data' => $creative]);
    }

    public function logImpression(Request $request): JsonResponse
    {
        $result = $this->adService->logImpression(
            adId: $request->integer('ad_id'),
            userId: $request->input('user_id'),
            clicked: $request->boolean('clicked', false)
        );

        return response()->json(['data' => $result]);
    }
}`,
      model: `<?php

namespace App\\Models\\Marketing;

use Illuminate\\Database\\Eloquent\\Model;

class AdCreative extends Model
{
    protected $table = 'ad_creatives';

    protected $fillable = [
        'slot_name',
        'impressions_count',
        'clicks_count',
    ];

    protected $casts = [
        'impressions_count' => 'integer',
        'clicks_count' => 'integer',
    ];
}`,
      service: `<?php

namespace App\\Services\\Marketing;

use App\\Events\\Marketing\\AdClicked;
use App\\Events\\Marketing\\AdServed;
use App\\Models\\Marketing\\AdCreative;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\Facades\Cache;

class AdServingEngineService
{
    public function serveAd(string $slotName, ?int $userId = null): ?AdCreative
    {
        $creative = AdCreative::where('slot_name', $slotName)
            ->orderByRaw('impressions_count ASC')
            ->first();

        if (!$creative) {
            return null;
        }

        $frequencyKey = "ad_freq:{$slotName}:" . ($userId ?? 'anon');
        $impressionCount = (int) Cache::get($frequencyKey, 0);

        if ($impressionCount >= 5) {
            $creative = AdCreative::where('slot_name', $slotName)
                ->where('id', '!=', $creative->id)
                ->orderByRaw('impressions_count ASC')
                ->first() ?? $creative;
        }

        event(new AdServed($creative));

        return $creative;
    }

    public function logImpression(int $adId, ?int $userId, bool $clicked = false): array
    {
        return DB::transaction(function () use ($adId, $userId, $clicked) {
            $creative = AdCreative::findOrFail($adId);

            $creative->increment('impressions_count');

            $frequencyKey = "ad_freq:{$creative->slot_name}:" . ($userId ?? 'anon');
            Cache::increment($frequencyKey);
            Cache::put($frequencyKey, Cache::get($frequencyKey, 0), 86400);

            if ($clicked) {
                $creative->increment('clicks_count');
                event(new AdClicked($creative));
            }

            return [
                'ad_id' => $creative->id,
                'impressions' => $creative->impressions_count,
                'clicks' => $creative->clicks_count,
            ];
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Marketing;

use Illuminate\\Foundation\\Http\\FormRequest;

class ServeAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slot_name' => ['required', 'string', 'max:64'],
            'user_id' => ['nullable', 'exists:users,id'],
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
        Schema::create('ad_creatives', function (Blueprint $table) {
            $table->id();
            $table->string('slot_name', 64);
            $table->unsignedBigInteger('impressions_count')->default(0);
            $table->unsignedBigInteger('clicks_count')->default(0);
            $table->timestamps();

            $table->index('slot_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_creatives');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Marketing;

use App\\Models\\User;

class AdPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('ads.manage');
    }

    public function serve(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 10, slot: 'dashboard-top-hero', impressions: 489000, clicks: 14200, ctr: '2.90%' }
    ],
    status: 'Configured'
  },
  {
    id: 74,
    code: 'MOD-074',
    name: 'Promotion Management',
    slug: 'promotion-management',
    category: 'Marketing & Growth',
    phase: 8,
    iconName: 'Flame',
    purpose: 'Flash sales, BOGO (Buy One Get One) promotions, time-decay pricing, and automated banner announcements.',
    responsibilities: [
      'Schedule automated price reductions with precision start and end timestamps',
      'Apply complex promotional rules (e.g. Buy 2 get 1 at 50% off)',
      'Broadcast flash sale countdown timers to customer storefronts'
    ],
    databaseTables: [
      {
        name: 'promotions',
        description: 'Promotional rules and schedules.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'name', type: 'VARCHAR(128)', nullable: false },
          { name: 'rule_type', type: 'ENUM("percentage","flat","bogo")', nullable: false },
          { name: 'discount_value', type: 'DECIMAL(8,2)', nullable: false },
          { name: 'expires_at', type: 'TIMESTAMP', nullable: false }
        ],
        indexes: ['idx_promo_expiry']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/promotions/active', description: 'Fetch active store deals', authRequired: false }
    ],
    services: ['PromotionRuleEngineService'],
    permissions: ['promotions.manage'],
    events: ['PromotionStarted', 'PromotionEnded'],
    jobs: ['ActivateScheduledPromotionsJob'],
    dependencies: [31],
    tests: ['BogoPromotionRuleTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Marketing;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Marketing\\PromotionRuleEngineService;
use Illuminate\\Http\\JsonResponse;

class PromotionController extends Controller
{
    public function __construct(
        private readonly PromotionRuleEngineService $promotionService
    ) {}

    public function active(): JsonResponse
    {
        $promotions = $this->promotionService->getActivePromotions();

        return response()->json(['data' => $promotions]);
    }
}`,
      model: `<?php

namespace App\\Models\\Marketing;

use Illuminate\\Database\\Eloquent\\Model;

class Promotion extends Model
{
    protected $table = 'promotions';

    protected $fillable = [
        'name',
        'rule_type',
        'discount_value',
        'expires_at',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'expires_at' => 'datetime',
    ];

    protected $enumCastMap = [
        'rule_type' => ['percentage', 'flat', 'bogo'],
    ];
}`,
      service: `<?php

namespace App\\Services\\Marketing;

use App\\Events\\Marketing\\PromotionEnded;
use App\\Events\\Marketing\\PromotionStarted;
use App\\Models\\Marketing\\Promotion;
use Illuminate\\Support\\Facades\\DB;

class PromotionRuleEngineService
{
    public function getActivePromotions()
    {
        return Promotion::where('expires_at', '>', now())
            ->orderBy('expires_at')
            ->get();
    }

    public function calculateDiscount(Promotion $promotion, float $cartTotal): float
    {
        return match ($promotion->rule_type) {
            'percentage' => round($cartTotal * ($promotion->discount_value / 100), 2),
            'flat' => min($promotion->discount_value, $cartTotal),
            'bogo' => 0,
            default => 0,
        };
    }

    public function startPromotion(Promotion $promotion): void
    {
        DB::transaction(function () use ($promotion) {
            event(new PromotionStarted($promotion));
        });
    }

    public function expirePromotions(): int
    {
        return DB::transaction(function () {
            $expired = Promotion::where('expires_at', '<=', now())->get();

            foreach ($expired as $promotion) {
                event(new PromotionEnded($promotion));
            }

            return $expired->count();
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Marketing;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreatePromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('promotions.manage');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:128'],
            'rule_type' => ['required', 'in:percentage,flat,bogo'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'expires_at' => ['required', 'date', 'after:now'],
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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 128);
            $table->enum('rule_type', ['percentage', 'flat', 'bogo']);
            $table->decimal('discount_value', 8, 2);
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Marketing;

use App\\Models\\User;

class PromotionPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('promotions.manage');
    }

    public function view(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 1, name: 'Launch Week 20% Off All Nodes', discount: '20.00%', status: 'Active' }
    ],
    status: 'Configured'
  },
  {
    id: 75,
    code: 'MOD-075',
    name: 'Coupon Management',
    slug: 'coupon-management',
    category: 'Marketing & Growth',
    phase: 8,
    iconName: 'Tag',
    purpose: 'Voucher codes, minimum order value thresholds, per-user usage limits, and stacking prevention.',
    responsibilities: [
      'Validate coupon codes against cart subtotals and customer eligibility',
      'Enforce atomic decrement on total allowed coupon uses',
      'Prevent unauthorized stacking of mutually exclusive vouchers'
    ],
    databaseTables: [
      {
        name: 'coupons',
        description: 'Voucher discount codes.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'code', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'discount_type', type: 'ENUM("percentage","fixed")', nullable: false },
          { name: 'value', type: 'DECIMAL(8,2)', nullable: false },
          { name: 'max_uses', type: 'INT UNSIGNED', nullable: false },
          { name: 'used_count', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['coupon_code_unique']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/coupons/validate', description: 'Verify coupon validity against cart', authRequired: true }
    ],
    services: ['CouponValidationService'],
    permissions: ['coupons.manage'],
    events: ['CouponApplied'],
    jobs: ['ExpireStaleCouponsJob'],
    dependencies: [37],
    tests: ['CouponMaxUsageAtomicTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Marketing;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Marketing\\ValidateCouponRequest;
use App\\Services\\Marketing\\CouponValidationService;
use Illuminate\\Http\\JsonResponse;

class CouponController extends Controller
{
    public function __construct(
        private readonly CouponValidationService $couponService
    ) {}

    public function validate(ValidateCouponRequest $request): JsonResponse
    {
        $result = $this->couponService->validate(
            code: $request->validated('code'),
            cartTotal: $request->validated('cart_total'),
            userId: $request->user()->id
        );

        return response()->json([
            'valid' => true,
            'data' => $result,
        ]);
    }
}`,
      model: `<?php

namespace App\\Models\\Marketing;

use Illuminate\\Database\\Eloquent\\Model;

class Coupon extends Model
{
    protected $table = 'coupons';

    protected $fillable = [
        'code',
        'discount_type',
        'value',
        'max_uses',
        'used_count',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'max_uses' => 'integer',
        'used_count' => 'integer',
    ];

    protected $enumCastMap = [
        'discount_type' => ['percentage', 'fixed'],
    ];

    public function isAvailable(): bool
    {
        return $this->used_count < $this->max_uses;
    }

    public function calculateDiscount(float $amount): float
    {
        return match ($this->discount_type) {
            'percentage' => round($amount * ($this->value / 100), 2),
            'fixed' => min($this->value, $amount),
            default => 0,
        };
    }
}`,
      service: `<?php

namespace App\\Services\\Marketing;

use App\\Events\\Marketing\\CouponApplied;
use App\\Models\\Marketing\\Coupon;
use Illuminate\\Support\\Facades\\DB;

class CouponValidationService
{
    public function validate(string $code, float $cartTotal, int $userId): array
    {
        return DB::transaction(function () use ($code, $cartTotal, $userId) {
            $coupon = Coupon::where('code', $code)->first();

            if (!$coupon) {
                abort(422, 'Invalid coupon code.');
            }

            if (!$coupon->isAvailable()) {
                abort(422, 'This coupon has reached its maximum usage limit.');
            }

            $discount = $coupon->calculateDiscount($cartTotal);

            $coupon->increment('used_count');

            event(new CouponApplied($coupon, $userId));

            return [
                'coupon_id' => $coupon->id,
                'discount_type' => $coupon->discount_type,
                'discount_amount' => $discount,
                'final_total' => max(0, $cartTotal - $discount),
                'remaining_uses' => $coupon->max_uses - $coupon->used_count,
            ];
        });
    }

    public function expireStaleCoupons(): int
    {
        return Coupon::where('used_count', '>=', DB::raw('max_uses'))->update(['is_active' => false]);
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Marketing;

use Illuminate\\Foundation\\Http\\FormRequest;

class ValidateCouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:32'],
            'cart_total' => ['required', 'numeric', 'min:0'],
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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code', 32)->unique();
            $table->enum('discount_type', ['percentage', 'fixed']);
            $table->decimal('value', 8, 2);
            $table->unsignedInteger('max_uses')->default(1);
            $table->unsignedInteger('used_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Marketing;

use App\\Models\\User;

class CouponPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('coupons.manage');
    }

    public function view(User $user): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { code: 'ENTERPRISE100', discount: '15% Off', uses: '42 / 500', valid: true }
    ],
    status: 'Active'
  },
  {
    id: 76,
    code: 'MOD-076',
    name: 'Referral Management',
    slug: 'referral-management',
    category: 'Marketing & Growth',
    phase: 8,
    iconName: 'UserPlus',
    purpose: 'User referral links, referral cookie tracking, two-sided reward credits, and viral loop analytics.',
    responsibilities: [
      'Generate personalized user referral invitation links',
      'Track referral cookie attribution across multi-day signup journeys',
      'Reward both the advocate and the new referee with wallet balance credits'
    ],
    databaseTables: [
      {
        name: 'referrals',
        description: 'User invitations and attributed signups.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [
          { column: 'referrer_id', references: 'id', table: 'users' },
          { column: 'referee_id', references: 'id', table: 'users' }
        ],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'referrer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'referee_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
          { name: 'code', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'reward_granted', type: 'BOOLEAN', nullable: false }
        ],
        indexes: ['referral_code_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/referrals/my-link', description: 'Get referral stats', authRequired: true }
    ],
    services: ['ReferralTrackingService', 'TwoSidedRewardService'],
    permissions: ['referrals.view'],
    events: ['ReferralConverted'],
    jobs: ['DisburseReferralRewardsJob'],
    dependencies: [1, 44],
    tests: ['TwoSidedReferralRewardTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Marketing;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Marketing\\ReferralTrackingService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class ReferralController extends Controller
{
    public function __construct(
        private readonly ReferralTrackingService $referralService
    ) {}

    public function myLink(Request $request): JsonResponse
    {
        $stats = $this->referralService->getReferralStats($request->user()->id);

        return response()->json(['data' => $stats]);
    }
}`,
      model: `<?php

namespace App\\Models\\Marketing;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Referral extends Model
{
    protected $table = 'referrals';

    protected $fillable = [
        'referrer_id',
        'referee_id',
        'code',
        'reward_granted',
    ];

    protected $casts = [
        'reward_granted' => 'boolean',
    ];

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referee_id');
    }
}`,
      service: `<?php

namespace App\\Services\\Marketing;

use App\\Events\\Marketing\\ReferralConverted;
use App\\Models\\Marketing\\Referral;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

class ReferralTrackingService
{
    public function generateLink(User $user): string
    {
        $existing = Referral::where('referrer_id', $user->id)->first();

        if ($existing) {
            return $this->buildUrl($existing->code);
        }

        $code = strtoupper(substr($user->name, 0, 4) . $user->id);

        Referral::create([
            'referrer_id' => $user->id,
            'code' => $code,
            'reward_granted' => false,
        ]);

        return $this->buildUrl($code);
    }

    public function trackConversion(string $code, int $refereeId): void
    {
        DB::transaction(function () use ($code, $refereeId) {
            $referral = Referral::where('code', $code)->firstOrFail();

            $referral->update([
                'referee_id' => $refereeId,
                'reward_granted' => true,
            ]);

            event(new ReferralConverted($referral));
        });
    }

    public function getReferralStats(int $userId): array
    {
        $referral = Referral::where('referrer_id', $userId)->first();

        if (!$referral) {
            return [
                'code' => null,
                'link' => null,
                'total_referrals' => 0,
                'successful_referrals' => 0,
            ];
        }

        $total = Referral::where('referrer_id', $userId)->count();
        $successful = Referral::where('referrer_id', $userId)
            ->whereNotNull('referee_id')
            ->count();

        return [
            'code' => $referral->code,
            'link' => $this->buildUrl($referral->code),
            'total_referrals' => $total,
            'successful_referrals' => $successful,
        ];
    }

    private function buildUrl(string $code): string
    {
        return url("/r/{$code}");
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Marketing;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateReferralRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
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
        Schema::create('referrals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referrer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('referee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('code', 32)->unique();
            $table->boolean('reward_granted')->default(false);
            $table->timestamps();

            $table->index('referrer_id');
            $table->index('referee_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Marketing;

use App\\Models\\User;

class ReferralPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('referrals.view');
    }

    public function manage(User $user): bool
    {
        return $user->hasPermission('referrals.view');
    }
}`
    },
    sampleRecords: [
      { user: 'Alex Chen', link: 'https://nexus-enterprise.io/r/ALEX100', successful_referrals: 14, credits_earned: '$350.00' }
    ],
    status: 'Configured'
  },
  {
    id: 77,
    code: 'MOD-077',
    name: 'Affiliate Management',
    slug: 'affiliate-management',
    category: 'Marketing & Growth',
    phase: 8,
    iconName: 'Network',
    purpose: 'Affiliate marketer portals, custom sub-tracking links, tiered payout commissions, and fraud filtering.',
    responsibilities: [
      'Onboard professional publishers and affiliate networks',
      'Generate deep links with sub-ID parameter attribution',
      'Filter suspicious affiliate self-purchases and click-fraud patterns'
    ],
    databaseTables: [
      {
        name: 'affiliates',
        description: 'Affiliate partner profiles.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'affiliate_tag', type: 'VARCHAR(64)', nullable: false, index: true },
          { name: 'commission_rate', type: 'DECIMAL(5,2)', nullable: false },
          { name: 'total_earnings', type: 'DECIMAL(12,2)', nullable: false }
        ],
        indexes: ['affiliate_tag_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/affiliates/portal', description: 'Affiliate performance metrics', authRequired: true }
    ],
    services: ['AffiliateTrackingService', 'AffiliateFraudFilterService'],
    permissions: ['affiliates.manage'],
    events: ['AffiliateConversionRecorded'],
    jobs: ['CalculateAffiliateMonthlyPayoutJob'],
    dependencies: [1, 41],
    tests: ['AffiliateFraudFilterTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Marketing;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Marketing\\AffiliateTrackingService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class AffiliateController extends Controller
{
    public function __construct(
        private readonly AffiliateTrackingService $affiliateService
    ) {}

    public function portal(Request $request): JsonResponse
    {
        $metrics = $this->affiliateService->getPortalMetrics($request->user()->id);

        return response()->json(['data' => $metrics]);
    }
}`,
      model: `<?php

namespace App\\Models\\Marketing;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Affiliate extends Model
{
    protected $table = 'affiliates';

    protected $fillable = [
        'user_id',
        'affiliate_tag',
        'commission_rate',
        'total_earnings',
    ];

    protected $casts = [
        'commission_rate' => 'decimal:2',
        'total_earnings' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}`,
      service: `<?php

namespace App\\Services\\Marketing;

use App\\Events\\Marketing\\AffiliateConversionRecorded;
use App\\Models\\Marketing\\Affiliate;
use Illuminate\\Support\\Facades\\DB;

class AffiliateTrackingService
{
    public function register(int $userId, float $commissionRate): Affiliate
    {
        return DB::transaction(function () use ($userId, $commissionRate) {
            $tag = 'AFF-' . strtoupper(bin2hex(random_bytes(4)));

            return Affiliate::create([
                'user_id' => $userId,
                'affiliate_tag' => $tag,
                'commission_rate' => $commissionRate,
                'total_earnings' => 0,
            ]);
        });
    }

    public function recordConversion(Affiliate $affiliate, float $saleAmount): float
    {
        return DB::transaction(function () use ($affiliate, $saleAmount) {
            $commission = round($saleAmount * ($affiliate->commission_rate / 100), 2);

            $affiliate->increment('total_earnings', $commission);

            event(new AffiliateConversionRecorded($affiliate, $saleAmount, $commission));

            return $commission;
        });
    }

    public function getPortalMetrics(int $userId): array
    {
        $affiliate = Affiliate::where('user_id', $userId)->first();

        if (!$affiliate) {
            return [
                'tag' => null,
                'commission_rate' => 0,
                'total_earnings' => 0,
                'conversions' => 0,
            ];
        }

        return [
            'tag' => $affiliate->affiliate_tag,
            'commission_rate' => $affiliate->commission_rate,
            'total_earnings' => $affiliate->total_earnings,
        ];
    }

    public function findByTag(string $tag): ?Affiliate
    {
        return Affiliate::where('affiliate_tag', $tag)->first();
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Marketing;

use Illuminate\\Foundation\\Http\\FormRequest;

class RegisterAffiliateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('affiliates.manage');
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'commission_rate' => ['required', 'numeric', 'min:0.01', 'max:100'],
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
        Schema::create('affiliates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('affiliate_tag', 64)->unique();
            $table->decimal('commission_rate', 5, 2)->default(0);
            $table->decimal('total_earnings', 12, 2)->default(0);
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliates');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Marketing;

use App\\Models\\User;

class AffiliatePolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('affiliates.manage');
    }

    public function view(User $user): bool
    {
        return $user->hasPermission('affiliates.manage');
    }
}`
    },
    sampleRecords: [
      { tag: 'TECH-RADAR-26', rate: '12.0%', monthly_volume: '$42,800.00', status: 'Active' }
    ],
    status: 'Configured'
  },
  {
    id: 78,
    code: 'MOD-078',
    name: 'Loyalty Management',
    slug: 'loyalty-management',
    category: 'Marketing & Growth',
    phase: 8,
    iconName: 'Crown',
    purpose: 'Points accumulation engine, VIP tiers (Silver, Gold, Platinum), milestone perk redemptions, and point expiration.',
    responsibilities: [
      'Accrue loyalty points on qualifying commerce checkouts',
      'Compute tier progression status (Bronze -> Silver -> Gold -> Platinum)',
      'Manage perk redemption catalog (exclusive discounts, priority support)'
    ],
    databaseTables: [
      {
        name: 'loyalty_accounts',
        description: 'Customer loyalty point balances and tiers.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'points_balance', type: 'INT UNSIGNED', nullable: false },
          { name: 'tier', type: 'ENUM("bronze","silver","gold","platinum")', nullable: false },
          { name: 'lifetime_points', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['loyalty_user_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/loyalty/me', description: 'View points and tier progress', authRequired: true },
      { method: 'POST', path: '/api/v1/loyalty/redeem', description: 'Redeem points for perks', authRequired: true }
    ],
    services: ['LoyaltyPointsEngineService', 'TierProgressionService'],
    permissions: ['loyalty.view', 'loyalty.manage'],
    events: ['LoyaltyPointsAccrued', 'LoyaltyTierUpgraded'],
    jobs: ['ExpireAnnualLoyaltyPointsJob'],
    dependencies: [1, 37],
    tests: ['LoyaltyTierProgressionTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Marketing;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Marketing\\RedeemPointsRequest;
use App\\Services\\Marketing\\LoyaltyPointsEngineService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class LoyaltyController extends Controller
{
    public function __construct(
        private readonly LoyaltyPointsEngineService $loyaltyService
    ) {}

    public function me(Request $request): JsonResponse
    {
        $account = $this->loyaltyService->getAccount($request->user()->id);

        return response()->json(['data' => $account]);
    }

    public function redeem(RedeemPointsRequest $request): JsonResponse
    {
        $result = $this->loyaltyService->redeemPoints(
            userId: $request->user()->id,
            points: $request->validated('points'),
            perkCode: $request->validated('perk_code')
        );

        return response()->json([
            'message' => 'Points redeemed successfully.',
            'data' => $result,
        ]);
    }
}`,
      model: `<?php

namespace App\\Models\\Marketing;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class LoyaltyAccount extends Model
{
    protected $table = 'loyalty_accounts';

    protected $fillable = [
        'user_id',
        'points_balance',
        'tier',
        'lifetime_points',
    ];

    protected $casts = [
        'points_balance' => 'integer',
        'lifetime_points' => 'integer',
    ];

    protected $enumCastMap = [
        'tier' => ['bronze', 'silver', 'gold', 'platinum'],
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}`,
      service: `<?php

namespace App\\Services\\Marketing;

use App\\Events\\Marketing\\LoyaltyPointsAccrued;
use App\\Events\\Marketing\\LoyaltyTierUpgraded;
use App\\Models\\Marketing\\LoyaltyAccount;
use Illuminate\\Support\\Facades\\DB;

class LoyaltyPointsEngineService
{
    private const TIER_THRESHOLDS = [
        'bronze' => 0,
        'silver' => 1000,
        'gold' => 5000,
        'platinum' => 20000,
    ];

    public function getAccount(int $userId): ?LoyaltyAccount
    {
        return LoyaltyAccount::where('user_id', $userId)->first();
    }

    public function accruePoints(int $userId, int $points): void
    {
        DB::transaction(function () use ($userId, $points) {
            $account = LoyaltyAccount::firstOrCreate(
                ['user_id' => $userId],
                ['points_balance' => 0, 'tier' => 'bronze', 'lifetime_points' => 0]
            );

            $account->increment('points_balance', $points);
            $account->increment('lifetime_points', $points);

            event(new LoyaltyPointsAccrued($account, $points));

            $this->checkTierUpgrade($account);
        });
    }

    public function redeemPoints(int $userId, int $points, string $perkCode): array
    {
        return DB::transaction(function () use ($userId, $points, $perkCode) {
            $account = LoyaltyAccount::where('user_id', $userId)->firstOrFail();

            if ($account->points_balance < $points) {
                abort(422, 'Insufficient points balance.');
            }

            $account->decrement('points_balance', $points);

            return [
                'perk_code' => $perkCode,
                'points_redeemed' => $points,
                'remaining_balance' => $account->points_balance,
            ];
        });
    }

    private function checkTierUpgrade(LoyaltyAccount $account): void
    {
        $newTier = 'bronze';
        foreach (self::TIER_THRESHOLDS as $tier => $threshold) {
            if ($account->lifetime_points >= $threshold) {
                $newTier = $tier;
            }
        }

        if ($newTier !== $account->tier) {
            $account->update(['tier' => $newTier]);
            event(new LoyaltyTierUpgraded($account, $newTier));
        }
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Marketing;

use Illuminate\\Foundation\\Http\\FormRequest;

class RedeemPointsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('loyalty.manage');
    }

    public function rules(): array
    {
        return [
            'points' => ['required', 'integer', 'min:1'],
            'perk_code' => ['required', 'string', 'max:64'],
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
        Schema::create('loyalty_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('points_balance')->default(0);
            $table->enum('tier', ['bronze', 'silver', 'gold', 'platinum'])->default('bronze');
            $table->unsignedInteger('lifetime_points')->default(0);
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_accounts');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Marketing;

use App\\Models\\User;

class LoyaltyPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('loyalty.view');
    }

    public function manage(User $user): bool
    {
        return $user->hasPermission('loyalty.manage');
    }
}`
    },
    sampleRecords: [
      { user: 'Alex Chen', points: 4250, tier: 'Platinum Executive', points_to_next: 'Max Tier Reached' }
    ],
    status: 'Configured'
  },
  {
    id: 79,
    code: 'MOD-079',
    name: 'CRM Management',
    slug: 'crm-management',
    category: 'Marketing & Growth',
    phase: 8,
    iconName: 'UsersRound',
    purpose: 'Customer 360 unified view, customer lifecycle stages, interaction history logs, and account health scoring.',
    responsibilities: [
      'Aggregate customer data across support, orders, billing, and activity',
      'Compute churn risk and customer health scores using weighted heuristics',
      'Record account management meeting notes and strategic relationship tags'
    ],
    databaseTables: [
      {
        name: 'crm_accounts',
        description: 'Customer 360 records and relationship health.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'organization_id', references: 'id', table: 'organizations' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'organization_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'health_score', type: 'TINYINT UNSIGNED', nullable: false },
          { name: 'lifecycle_stage', type: 'ENUM("prospect","onboarding","healthy","at_risk","churned")', nullable: false }
        ],
        indexes: ['crm_org_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/crm/accounts/{id}', description: 'Customer 360 overview', authRequired: true, permission: 'crm.view' }
    ],
    services: ['Customer360Service', 'AccountHealthService'],
    permissions: ['crm.view', 'crm.manage'],
    events: ['AccountHealthScoreChanged'],
    jobs: ['RecalculateCrmHealthScoresJob'],
    dependencies: [1, 6, 37, 43],
    tests: ['HealthScoreAlgorithmTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Marketing;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Marketing\\Customer360Service;
use Illuminate\\Http\\JsonResponse;

class CrmController extends Controller
{
    public function __construct(
        private readonly Customer360Service $crmService
    ) {}

    public function show(int $id): JsonResponse
    {
        $account = $this->crmService->getCustomer360($id);

        if (!$account) {
            return response()->json(['message' => 'CRM account not found.'], 404);
        }

        return response()->json(['data' => $account]);
    }
}`,
      model: `<?php

namespace App\\Models\\Marketing;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class CrmAccount extends Model
{
    protected $table = 'crm_accounts';

    protected $fillable = [
        'organization_id',
        'health_score',
        'lifecycle_stage',
    ];

    protected $casts = [
        'health_score' => 'integer',
    ];

    protected $enumCastMap = [
        'lifecycle_stage' => ['prospect', 'onboarding', 'healthy', 'at_risk', 'churned'],
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}`,
      service: `<?php

namespace App\\Services\\Marketing;

use App\\Events\\Marketing\\AccountHealthScoreChanged;
use App\\Models\\Marketing\\CrmAccount;
use Illuminate\\Support\\Facades\\DB;

class Customer360Service
{
    public function getCustomer360(int $organizationId): ?CrmAccount
    {
        return CrmAccount::with('organization')
            ->where('organization_id', $organizationId)
            ->first();
    }

    public function recalculateHealthScore(CrmAccount $account): void
    {
        DB::transaction(function () use ($account) {
            $score = $this->computeHealthScore($account);
            $previousScore = $account->health_score;

            $account->update(['health_score' => $score]);

            if ($score !== $previousScore) {
                event(new AccountHealthScoreChanged($account, $previousScore, $score));
            }
        });
    }

    private function computeHealthScore(CrmAccount $account): int
    {
        $score = 50;

        if ($account->lifecycle_stage === 'healthy') {
            $score += 30;
        } elseif ($account->lifecycle_stage === 'at_risk') {
            $score -= 20;
        } elseif ($account->lifecycle_stage === 'churned') {
            $score -= 40;
        } elseif ($account->lifecycle_stage === 'onboarding') {
            $score += 10;
        }

        return max(0, min(100, $score));
    }

    public function recalculateAllScores(): void
    {
        CrmAccount::chunk(100, function ($accounts) {
            foreach ($accounts as $account) {
                $this->recalculateHealthScore($account);
            }
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Marketing;

use Illuminate\\Foundation\\Http\\FormRequest;

class UpdateCrmAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('crm.manage');
    }

    public function rules(): array
    {
        return [
            'health_score' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'lifecycle_stage' => ['sometimes', 'in:prospect,onboarding,healthy,at_risk,churned'],
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
        Schema::create('crm_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('health_score')->default(50);
            $table->enum('lifecycle_stage', ['prospect', 'onboarding', 'healthy', 'at_risk', 'churned'])->default('prospect');
            $table->timestamps();

            $table->unique('organization_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_accounts');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Marketing;

use App\\Models\\User;

class CrmPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('crm.view');
    }

    public function manage(User $user): bool
    {
        return $user->hasPermission('crm.manage');
    }
}`
    },
    sampleRecords: [
      { org: 'Acme Global Corp', health: 96, stage: 'healthy', ltv: '$124,000.00' }
    ],
    status: 'Configured'
  },
  {
    id: 80,
    code: 'MOD-080',
    name: 'Lead Management',
    slug: 'lead-management',
    category: 'Marketing & Growth',
    phase: 8,
    iconName: 'Magnet',
    purpose: 'Sales lead capture, lead scoring algorithms, pipeline progression stages (MQL, SQL, Opportunity), and rep routing.',
    responsibilities: [
      'Ingest inbound sales inquiries from demo requests and whitepapers',
      'Score leads based on company size, job title, and web engagement velocity',
      'Automatically route qualified leads to matching sales development reps'
    ],
    databaseTables: [
      {
        name: 'leads',
        description: 'Sales leads and pipeline stages.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'company_name', type: 'VARCHAR(128)', nullable: false },
          { name: 'contact_email', type: 'VARCHAR(255)', nullable: false, index: true },
          { name: 'lead_score', type: 'SMALLINT UNSIGNED', nullable: false },
          { name: 'stage', type: 'ENUM("new","mql","sql","opportunity","closed_won","closed_lost")', nullable: false }
        ],
        indexes: ['idx_lead_stage_score']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/leads', description: 'Pipeline lead board', authRequired: true },
      { method: 'POST', path: '/api/v1/leads', description: 'Capture sales lead', authRequired: false }
    ],
    services: ['LeadScoringEngineService', 'LeadRoutingService'],
    permissions: ['leads.view', 'leads.manage'],
    events: ['LeadScored', 'LeadQualified'],
    jobs: ['EnrichLeadCompanyDataJob'],
    dependencies: [1],
    tests: ['LeadScoringRuleTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\V1\\Marketing;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Marketing\\CreateLeadRequest;
use App\\Services\\Marketing\\LeadScoringEngineService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class LeadController extends Controller
{
    public function __construct(
        private readonly LeadScoringEngineService $leadService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $leads = $this->leadService->listLeads(
            stage: $request->input('stage'),
            perPage: $request->integer('per_page', 25)
        );

        return response()->json($leads);
    }

    public function store(CreateLeadRequest $request): JsonResponse
    {
        $lead = $this->leadService->captureLead($request->validated());

        return response()->json([
            'message' => 'Lead captured.',
            'data' => $lead,
        ], 201);
    }
}`,
      model: `<?php

namespace App\\Models\\Marketing;

use Illuminate\\Database\\Eloquent\\Model;

class Lead extends Model
{
    protected $table = 'leads';

    protected $fillable = [
        'company_name',
        'contact_email',
        'lead_score',
        'stage',
    ];

    protected $casts = [
        'lead_score' => 'integer',
    ];

    protected $enumCastMap = [
        'stage' => ['new', 'mql', 'sql', 'opportunity', 'closed_won', 'closed_lost'],
    ];
}`,
      service: `<?php

namespace App\\Services\\Marketing;

use App\\Events\\Marketing\\LeadQualified;
use App\\Events\\Marketing\\LeadScored;
use App\\Models\\Marketing\\Lead;
use Illuminate\\Support\\Facades\\DB;

class LeadScoringEngineService
{
    public function listLeads(?string $stage = null, int $perPage = 25)
    {
        $query = Lead::query();

        if ($stage) {
            $query->where('stage', $stage);
        }

        return $query->orderByDesc('lead_score')->paginate($perPage);
    }

    public function captureLead(array $data): Lead
    {
        return DB::transaction(function () use ($data) {
            $data['stage'] = $data['stage'] ?? 'new';
            $data['lead_score'] = $data['lead_score'] ?? 0;

            $lead = Lead::create($data);

            $score = $this->computeScore($lead);
            $lead->update(['lead_score' => $score]);

            event(new LeadScored($lead, $score));

            return $lead;
        });
    }

    public function advanceStage(Lead $lead, string $newStage): void
    {
        DB::transaction(function () use ($lead, $newStage) {
            $lead->update(['stage' => $newStage]);

            if (in_array($newStage, ['sql', 'opportunity'])) {
                event(new LeadQualified($lead));
            }
        });
    }

    private function computeScore(Lead $lead): int
    {
        $score = 10;

        $largeDomains = ['enterprise', 'corp', 'global', 'group'];
        foreach ($largeDomains as $domain) {
            if (str_contains(strtolower($lead->company_name), $domain)) {
                $score += 30;
                break;
            }
        }

        $email = strtolower($lead->contact_email);
        if (str_ends_with($email, '.com') || str_ends_with($email, '.io')) {
            $score += 10;
        }

        return min(100, $score);
    }

    public function routeLead(Lead $lead): void
    {
        $this->advanceStage($lead, 'mql');
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests\\Marketing;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:128'],
            'contact_email' => ['required', 'email', 'max:255'],
            'lead_score' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'stage' => ['sometimes', 'in:new,mql,sql,opportunity,closed_won,closed_lost'],
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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('company_name', 128);
            $table->string('contact_email', 255);
            $table->unsignedSmallInteger('lead_score')->default(0);
            $table->enum('stage', ['new', 'mql', 'sql', 'opportunity', 'closed_won', 'closed_lost'])->default('new');
            $table->timestamps();

            $table->index('contact_email');
            $table->index(['stage', 'lead_score']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};`,
      policy: `<?php

namespace App\\Policies\\Marketing;

use App\\Models\\User;

class LeadPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('leads.view');
    }

    public function manage(User $user): bool
    {
        return $user->hasPermission('leads.manage');
    }

    public function create(): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { company: 'HyperScale Dynamics', contact: 'vp-eng@hyperscale.io', score: 94, stage: 'opportunity' }
    ],
    status: 'Configured'
  }
];
