import { modulesDomain1_2 } from './modulesDomain1_2';
import { modulesDomain3_4 } from './modulesDomain3_4';
import { modulesDomain5_6 } from './modulesDomain5_6';
import { modulesDomain7_8 } from './modulesDomain7_8';
import { modulesDomain9_10 } from './modulesDomain9_10';
import { modulesDomain11_12 } from './modulesDomain11_12';
import { modulesDomain13_14 } from './modulesDomain13_14';
import { modulesDomain15_16 } from './modulesDomain15_16';
import { modulesDomain17_18 } from './modulesDomain17_18';
import { modulesDomain19_20 } from './modulesDomain19_20';
import { modulesDomain21 } from './modulesDomain21';
import { modulesDomain22 } from './modulesDomain22';
import { modulesDomain23 } from './modulesDomain23';
import { modulesDomain24 } from './modulesDomain24';
import { modulesDomain25 } from './modulesDomain25';
import { modulesDomain26 } from './modulesDomain26';
import { modulesDomain27 } from './modulesDomain27';
import { modulesDomain28_29 } from './modulesDomain28_29';
import { modulesDomain30_31 } from './modulesDomain30_31';
import { modulesDomain32_33 } from './modulesDomain32_33';
import { modulesDomain34 } from './modulesDomain34';
import { modulesDomain35 } from './modulesDomain35';
import { modulesDomain36 } from './modulesDomain36';
import { modulesDomain37 } from './modulesDomain37';
import { modulesDomain38 } from './modulesDomain38';
import { modulesDomain39 } from './modulesDomain39';
import { modulesDomain40 } from './modulesDomain40';
import { modulesDomain41 } from './modulesDomain41';
import { modulesDomain42 } from './modulesDomain42';
import { modulesDomain43 } from './modulesDomain43';
import { modulesDomain44 } from './modulesDomain44';
import { modulesDomain45 } from './modulesDomain45';

export const ALL_MODULES = [
  ...modulesDomain1_2,
  ...modulesDomain3_4,
  ...modulesDomain5_6,
  ...modulesDomain7_8,
  ...modulesDomain9_10,
  ...modulesDomain11_12,
  ...modulesDomain13_14,
  ...modulesDomain15_16,
  ...modulesDomain17_18,
  ...modulesDomain19_20,
  ...modulesDomain21,
  ...modulesDomain22,
  ...modulesDomain23,
  ...modulesDomain24,
  ...modulesDomain25,
  ...modulesDomain26,
  ...modulesDomain27,
  ...modulesDomain28_29,
  ...modulesDomain30_31,
  ...modulesDomain32_33,
  ...modulesDomain34,
  ...modulesDomain35,
  ...modulesDomain36,
  ...modulesDomain37,
  ...modulesDomain38,
  ...modulesDomain39,
  ...modulesDomain40,
  ...modulesDomain41,
  ...modulesDomain42,
  ...modulesDomain43,
  ...modulesDomain44,
  ...modulesDomain45
];

// Alias for backwards compatibility
export const ALL_100_MODULES = ALL_MODULES;

export const MODULE_DOMAINS = [
  { id: 1, name: 'Identity & Access', range: '01–10', count: 10, color: 'slate' },
  { id: 2, name: 'Community & Social', range: '11–20', count: 10, color: 'zinc' },
  { id: 3, name: 'Communication', range: '21–30', count: 10, color: 'neutral' },
  { id: 4, name: 'Commerce', range: '31–40', count: 10, color: 'stone' },
  { id: 5, name: 'Financial', range: '41–50', count: 10, color: 'gray' },
  { id: 6, name: 'Booking & Services', range: '51–60', count: 10, color: 'slate' },
  { id: 7, name: 'Gaming & Entertainment', range: '61–70', count: 10, color: 'zinc' },
  { id: 8, name: 'Marketing & Growth', range: '71–80', count: 10, color: 'neutral' },
  { id: 9, name: 'Operations & Productivity', range: '81–90', count: 10, color: 'stone' },
  { id: 10, name: 'System & Governance', range: '91–100', count: 10, color: 'gray' },
  { id: 11, name: 'Logistics & Supply Chain', range: '101–130', count: 30, color: 'slate' },
  { id: 12, name: 'Human Capital & HRMS', range: '131–160', count: 30, color: 'zinc' },
  { id: 13, name: 'Healthcare & Clinical', range: '161–190', count: 30, color: 'neutral' },
  { id: 14, name: 'Real Estate & Assets', range: '191–220', count: 30, color: 'stone' },
  { id: 15, name: 'Manufacturing & Industry', range: '221–250', count: 30, color: 'gray' },
  { id: 16, name: 'Legal & Compliance', range: '251–280', count: 30, color: 'slate' },
  { id: 17, name: 'AI & Machine Intelligence', range: '281–310', count: 30, color: 'zinc' },
  { id: 18, name: 'EdTech & Learning', range: '311–340', count: 30, color: 'neutral' },
  { id: 19, name: 'Media & Entertainment', range: '341–370', count: 30, color: 'stone' },
  { id: 20, name: 'Telecommunications & Utilities', range: '371–400', count: 30, color: 'gray' },
  { id: 21, name: 'Smart Cities & IoT', range: '401–420', count: 20, color: 'slate' },
  { id: 22, name: 'Agriculture & Food', range: '421–440', count: 20, color: 'zinc' },
  { id: 23, name: 'Sports & Fitness', range: '441–460', count: 20, color: 'neutral' },
  { id: 24, name: 'Travel & Hospitality', range: '461–480', count: 20, color: 'stone' },
  { id: 25, name: 'Facility Management', range: '481–500', count: 20, color: 'gray' },
  { id: 26, name: 'Procurement & Purchasing', range: '501–520', count: 20, color: 'slate' },
  { id: 27, name: 'Research & Development', range: '521–540', count: 20, color: 'zinc' },
  { id: 28, name: 'Basic CRUD Operations', range: '541–600', count: 60, color: 'slate' },
  { id: 29, name: 'Extended CRUD Modules', range: '601–660', count: 60, color: 'zinc' },
  { id: 30, name: 'Additional CRUD Modules', range: '661–740', count: 80, color: 'neutral' },
  { id: 31, name: 'DevOps & Cloud Infrastructure', range: '741–765', count: 25, color: 'slate' },
  { id: 32, name: 'Cybersecurity & Threat Intelligence', range: '766–790', count: 25, color: 'zinc' },
  { id: 33, name: 'Environmental & Carbon Management', range: '791–815', count: 25, color: 'neutral' },
  { id: 34, name: 'Aviation & Aerospace', range: '816–840', count: 25, color: 'stone' },
  { id: 35, name: 'Maritime & Shipping', range: '841–865', count: 25, color: 'gray' },
  { id: 36, name: 'Mining & Natural Resources', range: '866–890', count: 25, color: 'slate' },
  { id: 37, name: 'Insurance & Actuarial', range: '891–915', count: 25, color: 'zinc' },
  { id: 38, name: 'Fashion & Apparel', range: '916–940', count: 25, color: 'neutral' },
  { id: 39, name: 'Robotics & Automation', range: '941–990', count: 50, color: 'slate' },
  { id: 40, name: 'Space & Satellite Technology', range: '991–1040', count: 50, color: 'zinc' },
  { id: 41, name: 'Quantum Computing', range: '1041–1090', count: 50, color: 'neutral' },
  { id: 42, name: 'Bioinformatics & Genomics', range: '1091–1140', count: 50, color: 'stone' }
];

export const MODULE_BY_ID = new Map(
  ALL_MODULES.map(m => [m.id, m])
);

export const MODULE_BY_SLUG = new Map(
  ALL_MODULES.map(m => [m.slug, m])
);

export const MODULES_BY_CATEGORY = new Map();
for (const m of ALL_MODULES) {
  const arr = MODULES_BY_CATEGORY.get(m.category) ?? [];
  arr.push(m);
  MODULES_BY_CATEGORY.set(m.category, arr);
}

export const MODULES_BY_PHASE = new Map();
for (const m of ALL_MODULES) {
  const arr = MODULES_BY_PHASE.get(m.phase) ?? [];
  arr.push(m);
  MODULES_BY_PHASE.set(m.phase, arr);
}

export function getModuleById(id) {
  return MODULE_BY_ID.get(id);
}

export function getModuleBySlug(slug) {
  return MODULE_BY_SLUG.get(slug);
}

export function getModulesByCategory(category) {
  return MODULES_BY_CATEGORY.get(category) ?? [];
}

export function getModulesByPhase(phase) {
  return MODULES_BY_PHASE.get(phase) ?? [];
}
