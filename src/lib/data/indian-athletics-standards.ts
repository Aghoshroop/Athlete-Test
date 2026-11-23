// =========================================================================
// INDIAN ATHLETICS NATIONAL STANDARDS & PERFORMANCE NORMS (2024-2026)
// Athletics Federation of India (AFI), SAI High Performance, National Records
// =========================================================================

export interface IndianNationalRecord {
  eventCode: string;
  eventName: string;
  category: 'track' | 'jumps' | 'throws' | 'combined' | 'road_and_walk';
  men: {
    mark: string;
    numericValue: number;
    unit: string;
    athlete: string;
    stateOrUnit: string;
    year: number;
    competition: string;
    venue: string;
    windMps?: number;
    notes?: string;
  };
  women: {
    mark: string;
    numericValue: number;
    unit: string;
    athlete: string;
    stateOrUnit: string;
    year: number;
    competition: string;
    venue: string;
    windMps?: number;
    notes?: string;
  };
  afiNationalChampionshipStandards?: {
    menGoldApprox: string;
    menFinalistApprox: string;
    womenGoldApprox: string;
    womenFinalistApprox: string;
  };
}

export const INDIAN_NATIONAL_RECORDS: IndianNationalRecord[] = [
  // -------------------------------------------------------------
  // SPRINTS & HURDLES
  // -------------------------------------------------------------
  {
    eventCode: '100m',
    eventName: '100m',
    category: 'track',
    men: {
      mark: '10.25s',
      numericValue: 10.25,
      unit: 's',
      athlete: 'Amlan Borgohain',
      stateOrUnit: 'Assam / Reliance Foundation',
      year: 2022,
      competition: 'All-India Inter-Railway Championships',
      venue: 'Raebareli',
      windMps: 1.8,
    },
    women: {
      mark: '11.17s',
      numericValue: 11.17,
      unit: 's',
      athlete: 'Dutee Chand',
      stateOrUnit: 'Odisha',
      year: 2021,
      competition: 'Indian Grand Prix IV',
      venue: 'Patiala',
      windMps: 0.0,
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '10.35s',
      menFinalistApprox: '10.58s',
      womenGoldApprox: '11.45s',
      womenFinalistApprox: '11.85s',
    },
  },
  {
    eventCode: '200m',
    eventName: '200m',
    category: 'track',
    men: {
      mark: '20.52s',
      numericValue: 20.52,
      unit: 's',
      athlete: 'Amlan Borgohain',
      stateOrUnit: 'Assam',
      year: 2022,
      competition: 'Federation Cup National Athletics Championships',
      venue: 'Tenhipalam, Kozhikode',
      windMps: 1.0,
    },
    women: {
      mark: '22.82s',
      numericValue: 22.82,
      unit: 's',
      athlete: 'Saraswati Saha',
      stateOrUnit: 'West Bengal',
      year: 2002,
      competition: 'National Circuit Meet',
      venue: 'Ludhiana',
      windMps: 0.8,
      notes: 'Hima Das ran 22.88s (2021) in Patiala.',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '20.85s',
      menFinalistApprox: '21.30s',
      womenGoldApprox: '23.40s',
      womenFinalistApprox: '24.20s',
    },
  },
  {
    eventCode: '400m',
    eventName: '400m',
    category: 'track',
    men: {
      mark: '45.21s',
      numericValue: 45.21,
      unit: 's',
      athlete: 'Muhammed Anas Yahiya',
      stateOrUnit: 'Kerala / Indian Navy',
      year: 2019,
      competition: 'Kladno Memorial',
      venue: 'Kladno, Czech Republic',
    },
    women: {
      mark: '50.79s',
      numericValue: 50.79,
      unit: 's',
      athlete: 'Hima Das',
      stateOrUnit: 'Assam',
      year: 2018,
      competition: 'Asian Games',
      venue: 'Jakarta, Indonesia',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '45.90s',
      menFinalistApprox: '46.80s',
      womenGoldApprox: '52.30s',
      womenFinalistApprox: '54.50s',
    },
  },
  {
    eventCode: '110mH',
    eventName: '110m Hurdles / 100m Hurdles',
    category: 'track',
    men: {
      mark: '13.41s',
      numericValue: 13.41,
      unit: 's',
      athlete: 'Tejas Shirse',
      stateOrUnit: 'Maharashtra',
      year: 2024,
      competition: 'Motonet GP',
      venue: 'Jyvaskyla, Finland',
      windMps: 1.2,
    },
    women: {
      mark: '12.78s',
      numericValue: 12.78,
      unit: 's',
      athlete: 'Jyothi Yarraji',
      stateOrUnit: 'Andhra Pradesh / Reliance Foundation',
      year: 2023,
      competition: 'World University Games',
      venue: 'Chengdu, China',
      windMps: 1.0,
      notes: 'Asian Champion 2023, Paris 2024 Olympian.',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '13.80s',
      menFinalistApprox: '14.25s',
      womenGoldApprox: '13.20s',
      womenFinalistApprox: '13.80s',
    },
  },
  {
    eventCode: '400mH',
    eventName: '400m Hurdles',
    category: 'track',
    men: {
      mark: '48.80s',
      numericValue: 48.80,
      unit: 's',
      athlete: 'Ayyasamy Dharun',
      stateOrUnit: 'Tamil Nadu',
      year: 2019,
      competition: 'Federation Cup National Championships',
      venue: 'Patiala',
    },
    women: {
      mark: '55.42s',
      numericValue: 55.42,
      unit: 's',
      athlete: 'P.T. Usha (1984) / Vithya Ramraj (2023)',
      stateOrUnit: 'Kerala / Tamil Nadu',
      year: 2023,
      competition: 'Asian Games (Ramraj matched Usha)',
      venue: 'Hangzhou, China / Los Angeles, USA',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '49.80s',
      menFinalistApprox: '51.50s',
      womenGoldApprox: '56.90s',
      womenFinalistApprox: '59.20s',
    },
  },

  // -------------------------------------------------------------
  // MIDDLE & LONG DISTANCE
  // -------------------------------------------------------------
  {
    eventCode: '800m',
    eventName: '800m',
    category: 'track',
    men: {
      mark: '1:45.65',
      numericValue: 105.65,
      unit: 'min',
      athlete: 'Jinson Johnson',
      stateOrUnit: 'Kerala / Indian Army',
      year: 2018,
      competition: 'National Inter-State Senior Championships',
      venue: 'Guwahati',
    },
    women: {
      mark: '1:59.17',
      numericValue: 119.17,
      unit: 'min',
      athlete: 'Tintu Luka',
      stateOrUnit: 'Kerala / Usha School of Athletics',
      year: 2010,
      competition: 'Continental Cup',
      venue: 'Split, Croatia',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '1:47.50',
      menFinalistApprox: '1:50.20',
      womenGoldApprox: '2:03.00',
      womenFinalistApprox: '2:07.50',
    },
  },
  {
    eventCode: '1500m',
    eventName: '1500m',
    category: 'track',
    men: {
      mark: '3:35.24',
      numericValue: 215.24,
      unit: 'min',
      athlete: 'Jinson Johnson',
      stateOrUnit: 'Kerala / Indian Army',
      year: 2019,
      competition: 'ISTAF Berlin',
      venue: 'Berlin, Germany',
    },
    women: {
      mark: '4:04.78',
      numericValue: 244.78,
      unit: 'min',
      athlete: 'Harmilan Bains',
      stateOrUnit: 'Punjab',
      year: 2021,
      competition: 'National Open Athletics Championships',
      venue: 'Warangal',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '3:40.50',
      menFinalistApprox: '3:48.00',
      womenGoldApprox: '4:12.00',
      womenFinalistApprox: '4:22.00',
    },
  },
  {
    eventCode: '3000m_sc',
    eventName: '3000m Steeplechase',
    category: 'track',
    men: {
      mark: '8:09.91',
      numericValue: 489.91,
      unit: 'min',
      athlete: 'Avinash Sable',
      stateOrUnit: 'Maharashtra / Indian Army',
      year: 2024,
      competition: 'Paris Diamond League',
      venue: 'Paris, France',
      notes: 'Commonwealth Games 2022 Silver, Paris 2024 Finalist (8:14.18).',
    },
    women: {
      mark: '9:15.31',
      numericValue: 555.31,
      unit: 'min',
      athlete: 'Parul Chaudhary',
      stateOrUnit: 'Uttar Pradesh',
      year: 2023,
      competition: 'World Athletics Championships Final',
      venue: 'Budapest, Hungary',
      notes: 'Asian Games 2023 Gold medalist.',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '8:25.00',
      menFinalistApprox: '8:55.00',
      womenGoldApprox: '9:40.00',
      womenFinalistApprox: '10:15.00',
    },
  },
  {
    eventCode: '5000m',
    eventName: '5000m',
    category: 'track',
    men: {
      mark: '13:18.92',
      numericValue: 798.92,
      unit: 'min',
      athlete: 'Gulveer Singh',
      stateOrUnit: 'Uttar Pradesh / Indian Army',
      year: 2024,
      competition: 'Portland Track Festival',
      venue: 'Portland, USA',
      notes: 'Avinash Sable holds 13:19.30 (Sound Running 2023).',
    },
    women: {
      mark: '15:10.35',
      numericValue: 910.35,
      unit: 'min',
      athlete: 'Parul Chaudhary',
      stateOrUnit: 'Uttar Pradesh',
      year: 2023,
      competition: 'Sound Running On Track Nights',
      venue: 'Walnut, USA',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '13:50.00',
      menFinalistApprox: '14:25.00',
      womenGoldApprox: '15:45.00',
      womenFinalistApprox: '16:30.00',
    },
  },
  {
    eventCode: '10000m',
    eventName: '10,000m',
    category: 'track',
    men: {
      mark: '27:41.81',
      numericValue: 1661.81,
      unit: 'min',
      athlete: 'Gulveer Singh',
      stateOrUnit: 'Uttar Pradesh / Indian Army',
      year: 2024,
      competition: 'The Ten (Sound Running)',
      venue: 'San Juan Capistrano, USA',
    },
    women: {
      mark: '31:44.20',
      numericValue: 1904.20,
      unit: 'min',
      athlete: 'Preeja Sreedharan',
      stateOrUnit: 'Kerala / Indian Railways',
      year: 2010,
      competition: 'Asian Games',
      venue: 'Guangzhou, China',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '28:55.00',
      menFinalistApprox: '30:15.00',
      womenGoldApprox: '33:15.00',
      womenFinalistApprox: '35:20.00',
    },
  },

  // -------------------------------------------------------------
  // JUMPS
  // -------------------------------------------------------------
  {
    eventCode: 'long_jump',
    eventName: 'Long Jump',
    category: 'jumps',
    men: {
      mark: '8.42m',
      numericValue: 8.42,
      unit: 'm',
      athlete: 'Jeswin Aldrin',
      stateOrUnit: 'Tamil Nadu / Inspire Institute',
      year: 2023,
      competition: 'Indian Open Jumps Competition',
      venue: 'Bellary, Karnataka',
      windMps: 1.8,
      notes: 'Murali Sreeshankar holds 8.41m (Bhubaneswar 2023).',
    },
    women: {
      mark: '6.83m',
      numericValue: 6.83,
      unit: 'm',
      athlete: 'Anju Bobby George',
      stateOrUnit: 'Kerala',
      year: 2004,
      competition: 'Olympic Games (5th Place)',
      venue: 'Athens, Greece',
      windMps: 1.2,
      notes: 'Shaili Singh holds 6.76m (Bengaluru 2023).',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '8.00m',
      menFinalistApprox: '7.60m',
      womenGoldApprox: '6.50m',
      womenFinalistApprox: '6.10m',
    },
  },
  {
    eventCode: 'triple_jump',
    eventName: 'Triple Jump',
    category: 'jumps',
    men: {
      mark: '17.37m',
      numericValue: 17.37,
      unit: 'm',
      athlete: 'Praveen Chithravel',
      stateOrUnit: 'Tamil Nadu / Reliance Foundation',
      year: 2023,
      competition: 'Prueba de Confrontacion',
      venue: 'Havana, Cuba',
      windMps: 1.5,
      notes: 'Abdulla Aboobacker 17.19m, Eldhose Paul 16.99m (CWG Gold).',
    },
    women: {
      mark: '14.11m',
      numericValue: 14.11,
      unit: 'm',
      athlete: 'Mayookha Johny',
      stateOrUnit: 'Kerala / ONGC',
      year: 2011,
      competition: 'Asian Athletics Championships',
      venue: 'Kobe, Japan',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '16.75m',
      menFinalistApprox: '15.90m',
      womenGoldApprox: '13.60m',
      womenFinalistApprox: '12.80m',
    },
  },
  {
    eventCode: 'high_jump',
    eventName: 'High Jump',
    category: 'jumps',
    men: {
      mark: '2.29m',
      numericValue: 2.29,
      unit: 'm',
      athlete: 'Tejaswin Shankar',
      stateOrUnit: 'Delhi / Kansas State',
      year: 2018,
      competition: 'Texas Tech Corky/Crofoot Shootout',
      venue: 'Lubbock, USA',
      notes: 'Sarvesh Kushare 2.27m (Paris 2024 Olympian).',
    },
    women: {
      mark: '1.92m',
      numericValue: 1.92,
      unit: 'm',
      athlete: 'Sahana Kumari',
      stateOrUnit: 'Karnataka',
      year: 2012,
      competition: 'National Inter-State Senior Championships',
      venue: 'Hyderabad',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '2.23m',
      menFinalistApprox: '2.14m',
      womenGoldApprox: '1.83m',
      womenFinalistApprox: '1.74m',
    },
  },
  {
    eventCode: 'pole_vault',
    eventName: 'Pole Vault',
    category: 'jumps',
    men: {
      mark: '5.31m',
      numericValue: 5.31,
      unit: 'm',
      athlete: 'Subramani Siva (2022) / Devraj (2024)',
      stateOrUnit: 'Tamil Nadu / Services',
      year: 2022,
      competition: 'National Games',
      venue: 'Gandhinagar, Gujarat',
    },
    women: {
      mark: '4.21m',
      numericValue: 4.21,
      unit: 'm',
      athlete: 'Rosy Meena Paulraj',
      stateOrUnit: 'Tamil Nadu',
      year: 2022,
      competition: 'National Open Athletics Championships',
      venue: 'Bengaluru',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '5.10m',
      menFinalistApprox: '4.80m',
      womenGoldApprox: '4.05m',
      womenFinalistApprox: '3.70m',
    },
  },

  // -------------------------------------------------------------
  // THROWS
  // -------------------------------------------------------------
  {
    eventCode: 'javelin_throw',
    eventName: 'Javelin Throw',
    category: 'throws',
    men: {
      mark: '89.94m',
      numericValue: 89.94,
      unit: 'm',
      athlete: 'Neeraj Chopra',
      stateOrUnit: 'Haryana / JSW Sports',
      year: 2022,
      competition: 'Stockholm Diamond League',
      venue: 'Stockholm, Sweden',
      notes: 'Tokyo 2020 Olympic Champion, Paris 2024 Silver (89.45m), World Champion 2023. Kishore Jena holds 87.54m.',
    },
    women: {
      mark: '63.82m',
      numericValue: 63.82,
      unit: 'm',
      athlete: 'Annu Rani',
      stateOrUnit: 'Uttar Pradesh / Indian Oil',
      year: 2022,
      competition: 'Indian Open Javelin Throw Competition',
      venue: 'Jamshedpur',
      notes: 'Asian Games 2023 Gold medalist (62.92m).',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '82.50m',
      menFinalistApprox: '75.00m',
      womenGoldApprox: '56.50m',
      womenFinalistApprox: '50.00m',
    },
  },
  {
    eventCode: 'shot_put',
    eventName: 'Shot Put',
    category: 'throws',
    men: {
      mark: '21.77m',
      numericValue: 21.77,
      unit: 'm',
      athlete: 'Tajinderpal Singh Toor',
      stateOrUnit: 'Punjab / Indian Navy',
      year: 2023,
      competition: 'National Inter-State Senior Championships',
      venue: 'Bhubaneswar, Odisha',
      notes: 'Asian Record holder, 2x Asian Games Gold medalist.',
    },
    women: {
      mark: '18.41m',
      numericValue: 18.41,
      unit: 'm',
      athlete: 'Abha Khatua',
      stateOrUnit: 'Maharashtra',
      year: 2024,
      competition: 'National Federation Cup Senior Championships',
      venue: 'Bhubaneswar, Odisha',
      notes: 'Manpreet Kaur also recorded 18.06m.',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '20.00m',
      menFinalistApprox: '18.20m',
      womenGoldApprox: '17.20m',
      womenFinalistApprox: '15.50m',
    },
  },
  {
    eventCode: 'discus_throw',
    eventName: 'Discus Throw',
    category: 'throws',
    men: {
      mark: '66.28m',
      numericValue: 66.28,
      unit: 'm',
      athlete: 'Vikas Gowda',
      stateOrUnit: 'Karnataka',
      year: 2012,
      competition: 'Old Hamptonians Invitational',
      venue: 'Norman, Oklahoma, USA',
      notes: 'Commonwealth Games 2014 Gold medalist.',
    },
    women: {
      mark: '66.59m',
      numericValue: 66.59,
      unit: 'm',
      athlete: 'Kamalpreet Kaur',
      stateOrUnit: 'Punjab',
      year: 2021,
      competition: 'Indian Grand Prix IV',
      venue: 'Patiala',
      notes: 'Seema Antil Punia threw 64.84m (2004).',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '59.00m',
      menFinalistApprox: '53.50m',
      womenGoldApprox: '58.00m',
      womenFinalistApprox: '51.50m',
    },
  },
  {
    eventCode: 'hammer_throw',
    eventName: 'Hammer Throw',
    category: 'throws',
    men: {
      mark: '70.73m',
      numericValue: 70.73,
      unit: 'm',
      athlete: 'Neeraj Kumar',
      stateOrUnit: 'Rajasthan / Services',
      year: 2016,
      competition: 'National Open Athletics Championships',
      venue: 'Lucknow',
    },
    women: {
      mark: '65.25m',
      numericValue: 65.25,
      unit: 'm',
      athlete: 'Sarita Romit Singh',
      stateOrUnit: 'Uttar Pradesh / Indian Railways',
      year: 2017,
      competition: 'Federation Cup National Senior Championships',
      venue: 'Patiala',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '67.00m',
      menFinalistApprox: '61.50m',
      womenGoldApprox: '62.00m',
      womenFinalistApprox: '55.00m',
    },
  },

  // -------------------------------------------------------------
  // COMBINED EVENTS
  // -------------------------------------------------------------
  {
    eventCode: 'decathlon',
    eventName: 'Decathlon / Heptathlon',
    category: 'combined',
    men: {
      mark: '7666 pts',
      numericValue: 7666,
      unit: 'pts',
      athlete: 'Tejaswin Shankar',
      stateOrUnit: 'Delhi',
      year: 2023,
      competition: 'Asian Games (Silver Medal)',
      venue: 'Hangzhou, China',
    },
    women: {
      mark: '6211 pts',
      numericValue: 6211,
      unit: 'pts',
      athlete: 'J.J. Shobha',
      stateOrUnit: 'Andhra Pradesh',
      year: 2004,
      competition: 'National Circuit Meet',
      venue: 'New Delhi',
      notes: 'Swapna Barman won Asian Games Gold in 2018 with 6026 pts.',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '7250 pts',
      menFinalistApprox: '6700 pts',
      womenGoldApprox: '5600 pts',
      womenFinalistApprox: '5050 pts',
    },
  },
];

// Quick index for fast lookup by code
export const INDIAN_RECORDS_BY_CODE: Record<string, IndianNationalRecord> = {};
INDIAN_NATIONAL_RECORDS.forEach((rec) => {
  INDIAN_RECORDS_BY_CODE[rec.eventCode.toLowerCase()] = rec;
  // Also index common aliases
  if (rec.eventCode === '110mH') {
    INDIAN_RECORDS_BY_CODE['100mh'] = rec;
    INDIAN_RECORDS_BY_CODE['hurdles'] = rec;
  }
  if (rec.eventCode === '3000m_sc') {
    INDIAN_RECORDS_BY_CODE['3000msc'] = rec;
    INDIAN_RECORDS_BY_CODE['steeplechase'] = rec;
  }
  if (rec.eventCode === 'decathlon') {
    INDIAN_RECORDS_BY_CODE['heptathlon'] = rec;
    INDIAN_RECORDS_BY_CODE['combined'] = rec;
  }
});

// =========================================================================
// INDIAN ATHLETIC TESTING BATTERY NORMS (AFI / SAI NATIONAL CAMPS)
// Field test calibration reference tables for Senior & Junior Indian athletes
// =========================================================================

export interface IndianFieldTestNormBracket {
  testCode: string;
  sex: 'male' | 'female';
  unit: string;
  direction: 'higher_is_better' | 'lower_is_better';
  // Percentiles: 10, 25, 50, 75, 90, 95 (AFI National Camp Calibrated)
  percentiles: { percentile: number; value: number }[];
}

export const INDIAN_ATHLETIC_TEST_NORMS: Record<string, { male: IndianFieldTestNormBracket; female: IndianFieldTestNormBracket }> = {
  // 1. 10m Sprint (Pure Acceleration)
  '10M': {
    male: {
      testCode: '10M',
      sex: 'male',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 1.88 },
        { percentile: 25, value: 1.80 },
        { percentile: 50, value: 1.72 },
        { percentile: 75, value: 1.66 },
        { percentile: 90, value: 1.60 },
        { percentile: 95, value: 1.54 }, // Senior AFI Sprinter caliber
      ],
    },
    female: {
      testCode: '10M',
      sex: 'female',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 2.05 },
        { percentile: 25, value: 1.96 },
        { percentile: 50, value: 1.88 },
        { percentile: 75, value: 1.80 },
        { percentile: 90, value: 1.74 },
        { percentile: 95, value: 1.68 },
      ],
    },
  },

  // 2. 30m Sprint (Acceleration & Transition)
  '30M': {
    male: {
      testCode: '30M',
      sex: 'male',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 4.30 },
        { percentile: 25, value: 4.15 },
        { percentile: 50, value: 3.98 },
        { percentile: 75, value: 3.84 },
        { percentile: 90, value: 3.72 },
        { percentile: 95, value: 3.65 },
      ],
    },
    female: {
      testCode: '30M',
      sex: 'female',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 4.65 },
        { percentile: 25, value: 4.50 },
        { percentile: 50, value: 4.32 },
        { percentile: 75, value: 4.18 },
        { percentile: 90, value: 4.05 },
        { percentile: 95, value: 3.95 },
      ],
    },
  },

  // 3. Flying 10m (Maximum Velocity / Vmax)
  'FLY10M': {
    male: {
      testCode: 'FLY10M',
      sex: 'male',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 1.15 },
        { percentile: 25, value: 1.08 },
        { percentile: 50, value: 1.02 },
        { percentile: 75, value: 0.97 },
        { percentile: 90, value: 0.92 },
        { percentile: 95, value: 0.88 }, // > 11.36 m/s
      ],
    },
    female: {
      testCode: 'FLY10M',
      sex: 'female',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 1.26 },
        { percentile: 25, value: 1.19 },
        { percentile: 50, value: 1.12 },
        { percentile: 75, value: 1.06 },
        { percentile: 90, value: 1.00 },
        { percentile: 95, value: 0.96 }, // > 10.4 m/s
      ],
    },
  },

  // 4. Countermovement Jump (CMJ) - cm
  'CMJ': {
    male: {
      testCode: 'CMJ',
      sex: 'male',
      unit: 'cm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 35.0 },
        { percentile: 25, value: 40.5 },
        { percentile: 50, value: 46.5 },
        { percentile: 75, value: 52.0 },
        { percentile: 90, value: 58.5 },
        { percentile: 95, value: 63.0 },
      ],
    },
    female: {
      testCode: 'CMJ',
      sex: 'female',
      unit: 'cm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 27.0 },
        { percentile: 25, value: 31.5 },
        { percentile: 50, value: 36.5 },
        { percentile: 75, value: 41.5 },
        { percentile: 90, value: 46.5 },
        { percentile: 95, value: 50.0 },
      ],
    },
  },

  // 5. Standing Long Jump (SLJ) - meters
  'SLJ': {
    male: {
      testCode: 'SLJ',
      sex: 'male',
      unit: 'm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 2.15 },
        { percentile: 25, value: 2.35 },
        { percentile: 50, value: 2.55 },
        { percentile: 75, value: 2.75 },
        { percentile: 90, value: 2.92 },
        { percentile: 95, value: 3.05 },
      ],
    },
    female: {
      testCode: 'SLJ',
      sex: 'female',
      unit: 'm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 1.80 },
        { percentile: 25, value: 1.95 },
        { percentile: 50, value: 2.15 },
        { percentile: 75, value: 2.32 },
        { percentile: 90, value: 2.48 },
        { percentile: 95, value: 2.60 },
      ],
    },
  },

  // 6. Reactive Strength Index (RSI Drop Jump)
  'RSI': {
    male: {
      testCode: 'RSI',
      sex: 'male',
      unit: 'ratio',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 1.45 },
        { percentile: 25, value: 1.80 },
        { percentile: 50, value: 2.15 },
        { percentile: 75, value: 2.55 },
        { percentile: 90, value: 2.95 },
        { percentile: 95, value: 3.25 },
      ],
    },
    female: {
      testCode: 'RSI',
      sex: 'female',
      unit: 'ratio',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 1.20 },
        { percentile: 25, value: 1.50 },
        { percentile: 50, value: 1.80 },
        { percentile: 75, value: 2.15 },
        { percentile: 90, value: 2.50 },
        { percentile: 95, value: 2.80 },
      ],
    },
  },

  // 7. Backward Overhead Medicine Ball Throw (BOMST / Medball) - meters
  'BOMST': {
    male: {
      testCode: 'BOMST',
      sex: 'male',
      unit: 'm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 11.5 },
        { percentile: 25, value: 13.2 },
        { percentile: 50, value: 15.0 },
        { percentile: 75, value: 16.8 },
        { percentile: 90, value: 18.5 },
        { percentile: 95, value: 20.0 },
      ],
    },
    female: {
      testCode: 'BOMST',
      sex: 'female',
      unit: 'm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 9.0 },
        { percentile: 25, value: 10.5 },
        { percentile: 50, value: 12.2 },
        { percentile: 75, value: 13.8 },
        { percentile: 90, value: 15.2 },
        { percentile: 95, value: 16.5 },
      ],
    },
  },

  // 8. Cooper 12-Minute Aerobic Run - meters
  'COOPER': {
    male: {
      testCode: 'COOPER',
      sex: 'male',
      unit: 'm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 2500 },
        { percentile: 25, value: 2800 },
        { percentile: 50, value: 3150 },
        { percentile: 75, value: 3450 },
        { percentile: 90, value: 3750 },
        { percentile: 95, value: 3950 },
      ],
    },
    female: {
      testCode: 'COOPER',
      sex: 'female',
      unit: 'm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 2200 },
        { percentile: 25, value: 2450 },
        { percentile: 50, value: 2750 },
        { percentile: 75, value: 3050 },
        { percentile: 90, value: 3300 },
        { percentile: 95, value: 3500 },
      ],
    },
  },

  // 9. Yo-Yo Intermittent Recovery Test Level 1 (m)
  'YOYO_IR1': {
    male: {
      testCode: 'YOYO_IR1',
      sex: 'male',
      unit: 'm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 1200 },
        { percentile: 25, value: 1560 },
        { percentile: 50, value: 1960 },
        { percentile: 75, value: 2320 },
        { percentile: 90, value: 2680 },
        { percentile: 95, value: 2920 },
      ],
    },
    female: {
      testCode: 'YOYO_IR1',
      sex: 'female',
      unit: 'm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 880 },
        { percentile: 25, value: 1160 },
        { percentile: 50, value: 1480 },
        { percentile: 75, value: 1800 },
        { percentile: 90, value: 2120 },
        { percentile: 95, value: 2360 },
      ],
    },
  },

  // 10. 5-0-5 Pro Agility Test (s)
  'PRO_AGILITY': {
    male: {
      testCode: 'PRO_AGILITY',
      sex: 'male',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 2.55 },
        { percentile: 25, value: 2.44 },
        { percentile: 50, value: 2.32 },
        { percentile: 75, value: 2.22 },
        { percentile: 90, value: 2.14 },
        { percentile: 95, value: 2.08 },
      ],
    },
    female: {
      testCode: 'PRO_AGILITY',
      sex: 'female',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 2.75 },
        { percentile: 25, value: 2.62 },
        { percentile: 50, value: 2.50 },
        { percentile: 75, value: 2.38 },
        { percentile: 90, value: 2.28 },
        { percentile: 95, value: 2.20 },
      ],
    },
  },

  // 11. Sit and Reach Flexibility (cm)
  'SIT_REACH': {
    male: {
      testCode: 'SIT_REACH',
      sex: 'male',
      unit: 'cm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 24 },
        { percentile: 25, value: 29 },
        { percentile: 50, value: 35 },
        { percentile: 75, value: 41 },
        { percentile: 90, value: 46 },
        { percentile: 95, value: 50 },
      ],
    },
    female: {
      testCode: 'SIT_REACH',
      sex: 'female',
      unit: 'cm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 28 },
        { percentile: 25, value: 33 },
        { percentile: 50, value: 38 },
        { percentile: 75, value: 44 },
        { percentile: 90, value: 49 },
        { percentile: 95, value: 53 },
      ],
    },
  },
};

// Aliases for full seed test codes
INDIAN_ATHLETIC_TEST_NORMS['SPRINT_10M'] = INDIAN_ATHLETIC_TEST_NORMS['10M'];
INDIAN_ATHLETIC_TEST_NORMS['SPRINT_30M'] = INDIAN_ATHLETIC_TEST_NORMS['30M'];
INDIAN_ATHLETIC_TEST_NORMS['FLYING_10M_VELOCITY'] = INDIAN_ATHLETIC_TEST_NORMS['FLY10M'];
INDIAN_ATHLETIC_TEST_NORMS['FLYING_30M'] = INDIAN_ATHLETIC_TEST_NORMS['FLY10M'];
INDIAN_ATHLETIC_TEST_NORMS['RSI_DROP_JUMP'] = INDIAN_ATHLETIC_TEST_NORMS['RSI'];
INDIAN_ATHLETIC_TEST_NORMS['BOMST_MEDBALL'] = INDIAN_ATHLETIC_TEST_NORMS['BOMST'];
INDIAN_ATHLETIC_TEST_NORMS['COOPER_12MIN'] = INDIAN_ATHLETIC_TEST_NORMS['COOPER'];
INDIAN_ATHLETIC_TEST_NORMS['YOYO_IR2'] = INDIAN_ATHLETIC_TEST_NORMS['YOYO_IR1'];
INDIAN_ATHLETIC_TEST_NORMS['SHUTTLE_20M'] = INDIAN_ATHLETIC_TEST_NORMS['YOYO_IR1'];
INDIAN_ATHLETIC_TEST_NORMS['SIT_AND_REACH'] = INDIAN_ATHLETIC_TEST_NORMS['SIT_REACH'];
INDIAN_ATHLETIC_TEST_NORMS['ILLINOIS_AGILITY'] = INDIAN_ATHLETIC_TEST_NORMS['PRO_AGILITY'];
INDIAN_ATHLETIC_TEST_NORMS['T_TEST_AGILITY'] = INDIAN_ATHLETIC_TEST_NORMS['PRO_AGILITY'];

