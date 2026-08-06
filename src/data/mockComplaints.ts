import { Complaint } from '../types';

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2026-8912',
    userId: 'usr-101',
    userName: 'Rahul Sharma',
    userEmail: 'rahul.sharma@example.com',
    userPhone: '+91 98765 43210',
    category: 'ROAD',
    title: 'Deep Pothole on MG Road near Metro Pillar 142',
    description: 'A dangerous 2-foot deep pothole has formed in the middle lane after yesterday heavy rain. Two two-wheelers nearly skidded last night. Needs urgent asphalt patching.',
    locationText: 'MG Road Junction, Ward 45, Indiranagar',
    latitude: 12.9716,
    longitude: 77.5946,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignedDepartment: 'Public Works Department (PWD) - Roads Division',
    autoSuggestion: {
      department: 'Public Works Department (PWD) - Roads Division',
      contactPhone: '1800-111-7623 / 080-22995500',
      contactEmail: 'pwd.roads@stategov.in',
      timeframe: 'Within 48 Hours (Cold-mix Asphalt Patching)',
      steps: [
        'Site coordinates forwarded to PWD Assistant Executive Engineer',
        'Field inspection & safety barricading for large hazards',
        'Cold-mix asphalt or paver block repair executed',
        'Quality audit & closure update uploaded'
      ],
      safetyAdvice: 'If the pothole is deep or hazardous to night traffic, place temporary warning markers or inform local traffic police.'
    },
    adminNotes: 'Inspection team visited at 10:30 AM. Barricades placed. Asphalt patching van scheduled for 3:00 PM today.',
    assignedOfficer: 'Er. K. V. Nagesh (AEE PWD)',
    createdAt: '2026-08-02T09:15:00Z',
    updatedAt: '2026-08-02T11:30:00Z'
  },
  {
    id: 'CMP-2026-8913',
    userId: 'usr-102',
    userName: 'Priya Ananth',
    userEmail: 'priya.a@example.com',
    userPhone: '+91 91234 56789',
    category: 'GARBAGE',
    title: 'Uncollected Garbage Dump Overflowing Near Model School',
    description: 'Commercial waste and plastic bags dumped outside the school boundary wall. Odor is spreading and stray animals are scattering waste on the footpath.',
    locationText: 'Near Gate 2, Model Public School, 5th Main, Jayanagar 4th Block',
    latitude: 12.925,
    longitude: 77.5938,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    status: 'PENDING',
    priority: 'MEDIUM',
    assignedDepartment: 'Department of Municipal Solid Waste & Sanitation',
    autoSuggestion: {
      department: 'Department of Municipal Solid Waste & Sanitation',
      contactPhone: '1800-425-2026 / 080-22660000',
      contactEmail: 'sanitation@citymunicipality.gov.in',
      timeframe: 'Within 24 Hours (Next Morning Route)',
      steps: [
        'Issue logged & auto-dispatched to nearest Sanitary Inspector',
        'Sanitation team assigned for site visit & heavy refuse vehicle dispatch',
        'Area cleared, disinfected with lime powder, and geo-tagged photo captured',
        'Resolution confirmation sent to citizen'
      ],
      safetyAdvice: 'Please refrain from open burning of garbage. Keep wet and dry waste segregated if dumping near community bins.'
    },
    createdAt: '2026-08-03T07:45:00Z',
    updatedAt: '2026-08-03T07:45:00Z'
  },
  {
    id: 'CMP-2026-8901',
    userId: 'usr-103',
    userName: 'Amitabh Sen',
    userEmail: 'amitabh.sen@example.com',
    userPhone: '+91 99887 76655',
    category: 'WATER',
    title: 'Main Pipeline Burst - Drinking Water Wasting Rapidly',
    description: 'A 6-inch water pipe broke near the transformer yard. Clean water is spilling continuously into the storm drain for the past 3 hours.',
    locationText: 'Crossroad 12, Koramangala 3rd Block',
    latitude: 12.9345,
    longitude: 77.6242,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?w=600&auto=format&fit=crop&q=80',
    status: 'RESOLVED',
    priority: 'URGENT',
    assignedDepartment: 'City Water Supply & Sewerage Board (BWSSB)',
    autoSuggestion: {
      department: 'City Water Supply & Sewerage Board (BWSSB)',
      contactPhone: '1916 (24/7 Helpline) / 080-22238888',
      contactEmail: 'water.helpdesk@bwssb.gov.in',
      timeframe: 'Within 12 Hours (Emergency Repair Crew)',
      steps: [
        'Automated alert sent to Ward Water Valve Master & Leakage Response Team',
        'Main supply pipeline pressure inspection to isolate burst section',
        'Pipe repair/replacement and water quality testing',
        'Supply restored & pressure status verified'
      ],
      safetyAdvice: 'Avoid using drinking water from ground sumps if wastewater cross-contamination is suspected until water quality is certified.'
    },
    adminNotes: 'BWSSB Valve Master isolated section at 10:15 AM. Pipe clamp coupling installed and supply re-pressurized. Issue resolved.',
    assignedOfficer: 'S. R. Patel (BWSSB Asst. Engineer)',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T14:20:00Z',
    resolvedAt: '2026-08-01T14:20:00Z',
    feedback: {
      rating: 5,
      comment: 'Very fast response from BWSSB team! Repaired in less than 6 hours.',
      createdAt: '2026-08-01T15:10:00Z'
    }
  },
  {
    id: 'CMP-2026-8910',
    userId: 'usr-104',
    userName: 'Kavita Sundaram',
    userEmail: 'kavita.s@example.com',
    userPhone: '+91 97766 55443',
    category: 'ELECTRICITY',
    title: 'Hanging Low-Voltage Wires & Sparking Pole',
    description: 'Electrical pole wire snapped due to tree branch falling. Wires are dangling near the sidewalk and sparking when touched by wind.',
    locationText: 'Opposite Community Hall, 1st Cross, Malleshwaram',
    latitude: 13.003,
    longitude: 77.568,
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    assignedDepartment: 'State Electricity Distribution Corporation',
    autoSuggestion: {
      department: 'State Electricity Distribution Corporation',
      contactPhone: '1912 (Emergency Power Helpline) / 1800-425-1912',
      contactEmail: 'customercare@electricityboard.gov.in',
      timeframe: 'Within 4 - 6 Hours (High-Priority Emergency)',
      steps: [
        'Emergency ticket dispatched to Division Electrical Linesman Crew',
        'Power feeder isolated if loose high-voltage wires or spark is reported',
        'Transformer fuse replacement, cable re-insulation or pole fix',
        'Feeder re-energized and line safety verified'
      ],
      safetyAdvice: 'STAY AT LEAST 10 METERS AWAY from fallen wires or sparking transformers. Do not touch water or metal poles near electrical faults.'
    },
    adminNotes: 'Feeder 4 temporarily de-energized. Linesmen on site replacing snapped drop wire.',
    assignedOfficer: 'M. S. Reddy (Sub-Divisional Inspector)',
    createdAt: '2026-08-03T18:30:00Z',
    updatedAt: '2026-08-03T19:15:00Z'
  }
];
