import { AutoSuggestionRule, ComplaintCategory } from '../types';

export const AUTO_SUGGESTION_RULES: Record<ComplaintCategory, AutoSuggestionRule> = {
  GARBAGE: {
    category: 'GARBAGE',
    categoryName: 'Garbage & Solid Waste Management',
    departmentName: 'Department of Municipal Solid Waste & Sanitation',
    departmentCode: 'MUNI-SAN-01',
    contactPhone: '1800-425-2026 / 080-22660000',
    contactEmail: 'sanitation@citymunicipality.gov.in',
    estimatedHours: 24,
    timeframeText: 'Within 24 Hours (Next Morning Route)',
    nodalOfficer: 'Chief Sanitation Officer (Zone East)',
    iconName: 'Trash2',
    steps: [
      'Issue logged & auto-dispatched to nearest Sanitary Inspector',
      'Sanitation team assigned for site visit & heavy refuse vehicle dispatch',
      'Area cleared, disinfected with lime powder, and geo-tagged photo captured',
      'Resolution confirmation sent to citizen'
    ],
    safetyAdvice: 'Please refrain from open burning of garbage. Keep wet and dry waste segregated if dumping near community bins.'
  },
  ROAD: {
    category: 'ROAD',
    categoryName: 'Roads, Potholes & Footpaths',
    departmentName: 'Public Works Department (PWD) - Roads Division',
    departmentCode: 'PWD-ROAD-04',
    contactPhone: '1800-111-7623 / 080-22995500',
    contactEmail: 'pwd.roads@stategov.in',
    estimatedHours: 48,
    timeframeText: 'Within 48 Hours (Cold-mix Asphalt Patching)',
    nodalOfficer: 'Executive Engineer (Infrastructure)',
    iconName: 'Construction',
    steps: [
      'Site coordinates forwarded to PWD Assistant Executive Engineer',
      'Field inspection & safety barricading for large hazards',
      'Cold-mix asphalt or paver block repair executed',
      'Quality audit & closure update uploaded'
    ],
    safetyAdvice: 'If the pothole is deep or hazardous to night traffic, place temporary warning markers or inform local traffic police.'
  },
  WATER: {
    category: 'WATER',
    categoryName: 'Water Leakage & Supply Interruption',
    departmentName: 'City Water Supply & Sewerage Board (BWSSB)',
    departmentCode: 'BWSSB-WAT-02',
    contactPhone: '1916 (24/7 Helpline) / 080-22238888',
    contactEmail: 'water.helpdesk@bwssb.gov.in',
    estimatedHours: 12,
    timeframeText: 'Within 12 Hours (Emergency Repair Crew)',
    nodalOfficer: 'Assistant Engineer (Water Supply Maintenance)',
    iconName: 'Droplets',
    steps: [
      'Automated alert sent to Ward Water Valve Master & Leakage Response Team',
      'Main supply pipeline pressure inspection to isolate burst section',
      'Pipe repair/replacement and water quality testing',
      'Supply restored & pressure status verified'
    ],
    safetyAdvice: 'Avoid using drinking water from ground sumps if wastewater cross-contamination is suspected until water quality is certified.'
  },
  ELECTRICITY: {
    category: 'ELECTRICITY',
    categoryName: 'Electricity, Transformers & Wiring Hazards',
    departmentName: 'State Electricity Distribution Corporation',
    departmentCode: 'EB-ELEC-09',
    contactPhone: '1912 (Emergency Power Helpline) / 1800-425-1912',
    contactEmail: 'customercare@electricityboard.gov.in',
    estimatedHours: 6,
    timeframeText: 'Within 4 - 6 Hours (High-Priority Emergency)',
    nodalOfficer: 'Sub-Divisional Officer (Electrical Safety)',
    iconName: 'Zap',
    steps: [
      'Emergency ticket dispatched to Division Electrical Linesman Crew',
      'Power feeder isolated if loose high-voltage wires or spark is reported',
      'Transformer fuse replacement, cable re-insulation or pole fix',
      'Feeder re-energized and line safety verified'
    ],
    safetyAdvice: 'STAY AT LEAST 10 METERS AWAY from fallen wires or sparking transformers. Do not touch water or metal poles near electrical faults.'
  },
  SEWAGE: {
    category: 'SEWAGE',
    categoryName: 'Sewage Overflow & Drainage Blockage',
    departmentName: 'Drainage & Underground Sewerage Maintenance Cell',
    departmentCode: 'UGD-SEW-05',
    contactPhone: '1800-425-8433 / 080-22123456',
    contactEmail: 'sewerage.cell@citymunicipality.gov.in',
    estimatedHours: 18,
    timeframeText: 'Within 18 Hours (Jetting Machine Team)',
    nodalOfficer: 'Assistant Inspector (Underground Drainage)',
    iconName: 'Waves',
    steps: [
      'High-pressure jetting machine unit dispatched to blockage location',
      'Manhole desilting & blockage removal carried out mechanically',
      'Disinfection spray applied to surrounding street surface',
      'Drain flow restored and manhole cover secured'
    ],
    safetyAdvice: 'Never attempt to open or enter manhole covers manually. Keep children away from overflowing sewage water.'
  },
  TRAFFIC: {
    category: 'TRAFFIC',
    categoryName: 'Traffic Signals, Streetlights & Signage',
    departmentName: 'Traffic Management & Municipal Electrical Wing',
    departmentCode: 'TRF-ELEC-07',
    contactPhone: '103 (Traffic Helpline) / 080-22942222',
    contactEmail: 'traffic.signals@citypolice.gov.in',
    estimatedHours: 24,
    timeframeText: 'Within 24 Hours',
    nodalOfficer: 'Traffic Signal Maintenance Inspector',
    iconName: 'TrafficCone',
    steps: [
      'Control Room notifies mobile electrical maintenance van',
      'LED fixture replacement, timer calibration or wiring check executed',
      'Functional verification during evening hours',
      'Ticket closed with status photo'
    ],
    safetyAdvice: 'At unlit or dark intersections, slow down and use high/low beam headlights carefully.'
  },
  PUBLIC_HEALTH: {
    category: 'PUBLIC_HEALTH',
    categoryName: 'Stray Animals & Vector Control',
    departmentName: 'Department of Public Health & Animal Husbandry',
    departmentCode: 'HEALTH-AH-03',
    contactPhone: '080-22661000 / 1800-425-4325',
    contactEmail: 'publichealth@citymunicipality.gov.in',
    estimatedHours: 36,
    timeframeText: 'Within 36 Hours',
    nodalOfficer: 'Veterinary Inspector & Vector Control Lead',
    iconName: 'ShieldAlert',
    steps: [
      'Public health team scheduled for fogging or animal welfare unit dispatch',
      'Anti-larval treatment or stray animal vaccination drive conducted',
      'Community health check update recorded',
      'Follow-up inspection scheduled in 48 hours'
    ],
    safetyAdvice: 'Ensure no stagnant water collects in empty pots or tires around your residential premises.'
  }
};

export function getAutoSuggestion(
  category: ComplaintCategory,
  descriptionText: string
): {
  department: string;
  contactPhone: string;
  contactEmail: string;
  timeframe: string;
  steps: string[];
  safetyAdvice: string;
  detectedKeywords: string[];
} {
  const rule = AUTO_SUGGESTION_RULES[category] || AUTO_SUGGESTION_RULES.GARBAGE;
  
  // Keyword detection logic for smart classification boost
  const keywordsFound: string[] = [];
  const text = descriptionText.toLowerCase();

  if (text.includes('urgent') || text.includes('hazard') || text.includes('fire') || text.includes('spark') || text.includes('danger')) {
    keywordsFound.push('High Severity Hazard');
  }
  if (text.includes('smell') || text.includes('stink') || text.includes('waste')) {
    keywordsFound.push('Bio-Hazard / Odor');
  }
  if (text.includes('accident') || text.includes('vehicle') || text.includes('deep')) {
    keywordsFound.push('Road Safety Risk');
  }
  if (text.includes('overflow') || text.includes('flood') || text.includes('leak')) {
    keywordsFound.push('Water/Sewage Spillage');
  }

  return {
    department: rule.departmentName,
    contactPhone: rule.contactPhone,
    contactEmail: rule.contactEmail,
    timeframe: rule.timeframeText,
    steps: rule.steps,
    safetyAdvice: rule.safetyAdvice,
    detectedKeywords: keywordsFound
  };
}
