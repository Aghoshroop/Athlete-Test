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
      mark: '10.09s',
      numericValue: 10.09,
      unit: 's',
      athlete: 'Gurindervir Singh',
      stateOrUnit: 'Punjab',
      year: 2026,
      competition: '29th National Senior Federation Cup Athletics Championships',
      venue: 'Ranchi, Jharkhand (Birsa Munda Athletics Stadium)',
      windMps: 1.2,
      notes: 'First Indian sprinter in history to breach the sub-10.10s barrier. Smashed the national record in a thrilling duel with Animesh Kujur (10.12s). Previous NR: Amlan Borgohain 10.25s (2022).',
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
      menGoldApprox: '10.15s',
      menFinalistApprox: '10.38s',
      womenGoldApprox: '11.45s',
      womenFinalistApprox: '11.85s',
    },
  },
  {
    eventCode: '200m',
    eventName: '200m',
    category: 'track',
    men: {
      mark: '20.32s',
      numericValue: 20.32,
      unit: 's',
      athlete: 'Animesh Kujur',
      stateOrUnit: 'Odisha / Reliance Foundation',
      year: 2025,
      competition: 'Asian Athletics Championships',
      venue: 'Gumi, South Korea',
      windMps: 0.8,
      notes: 'Shattered Amlan Borgohain (20.52s) mark. Dual sprint sensation with Gurindervir Singh.',
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
      menGoldApprox: '20.50s',
      menFinalistApprox: '20.95s',
      womenGoldApprox: '23.40s',
      womenFinalistApprox: '24.20s',
    },
  },
  {
    eventCode: '400m',
    eventName: '400m',
    category: 'track',
    men: {
      mark: '44.98s',
      numericValue: 44.98,
      unit: 's',
      athlete: 'Vishal Thennarasu Kayalvizhi',
      stateOrUnit: 'Tamil Nadu',
      year: 2026,
      competition: '29th National Senior Federation Cup Athletics Championships',
      venue: 'Ranchi, Jharkhand',
      notes: 'First Indian athlete in history to breach the sub-45s barrier. Previous NR: Muhammed Anas (45.21s, 2019).',
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
      menGoldApprox: '45.30s',
      menFinalistApprox: '46.40s',
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
      mark: '1:44.93',
      numericValue: 104.93,
      unit: 'min',
      athlete: 'Mohammed Afsal',
      stateOrUnit: 'Kerala / Indian Army',
      year: 2025,
      competition: 'Poznan Athletics Grand Prix',
      venue: 'Poznan, Poland',
      notes: 'First Indian to dip sub-1:45.00 in the 800m. Broke Jinson Johnson 1:45.65.',
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
      menGoldApprox: '1:46.80',
      menFinalistApprox: '1:49.50',
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
      mark: '13:03.93',
      numericValue: 783.93,
      unit: 'min',
      athlete: 'Gulveer Singh',
      stateOrUnit: 'Uttar Pradesh / Indian Army',
      year: 2026,
      competition: 'Sound Running Track Fest',
      venue: 'Los Angeles, USA',
      notes: 'Consecutive NR improvements: 13:18.92 (2024), 13:11.82 (2025), and 13:03.93 (2026).',
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
      menGoldApprox: '13:30.00',
      menFinalistApprox: '14:10.00',
      womenGoldApprox: '15:45.00',
      womenFinalistApprox: '16:30.00',
    },
  },
  {
    eventCode: '10000m',
    eventName: '10,000m',
    category: 'track',
    men: {
      mark: '27:00.22',
      numericValue: 1620.22,
      unit: 'min',
      athlete: 'Gulveer Singh',
      stateOrUnit: 'Uttar Pradesh / Indian Army',
      year: 2025,
      competition: 'The Ten (Sound Running)',
      venue: 'San Juan Capistrano, USA',
      notes: 'Historic distance masterclass approaching the sub-27 min barrier.',
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
      menGoldApprox: '28:20.00',
      menFinalistApprox: '29:45.00',
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
      mark: '5.50m',
      numericValue: 5.50,
      unit: 'm',
      athlete: 'Dev Kumar Meena',
      stateOrUnit: 'Madhya Pradesh',
      year: 2026,
      competition: 'Asian Games (Final)',
      venue: 'Aichi-Nagoya, Japan (September 29, 2026)',
      notes: 'First Indian pole vaulter in history to clear 5.50m. Successive NR record resets in 2026.',
    },
    women: {
      mark: '4.23m',
      numericValue: 4.23,
      unit: 'm',
      athlete: 'Baranica Elangovan',
      stateOrUnit: 'Tamil Nadu',
      year: 2026,
      competition: 'Indian Indoor Open & Asian Games Trials',
      venue: 'Bhubaneswar, Odisha (May 2026)',
      notes: 'Broke Rosy Meena Paulraj (4.21m) record by clearing 4.22m and 4.23m in Bhubaneswar before winning Asian Games bronze.',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '5.30m',
      menFinalistApprox: '5.00m',
      womenGoldApprox: '4.15m',
      womenFinalistApprox: '3.80m',
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
      mark: '8057 pts',
      numericValue: 8057,
      unit: 'pts',
      athlete: 'Tejaswin Shankar',
      stateOrUnit: 'Delhi',
      year: 2026,
      competition: 'National Combined Events Championship / International Decathlon',
      venue: 'New Delhi',
      notes: 'First Indian in history to breach the 8,000-point decathlon barrier. Previous NR: 7666 pts (Asian Games 2023).',
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
      menGoldApprox: '7500 pts',
      menFinalistApprox: '6900 pts',
      womenGoldApprox: '5600 pts',
      womenFinalistApprox: '5050 pts',
    },
  },
  {
    eventCode: '50m',
    eventName: '50m Sprint (Indoor / Acceleration Phase)',
    category: 'track',
    men: {
      mark: '— (No Official AFI Record)',
      numericValue: 5.76,
      unit: 's',
      athlete: 'AFI does not contest 50m',
      stateOrUnit: 'AFI National Camps',
      year: 2026,
      competition: 'AFI National Camp Timing Gates (Drive Phase Split)',
      venue: 'National Camp',
      notes: '50m is not an official AFI outdoor or indoor championship event (shortest official indoor is 60m: 6.60s). 5.76s is the elite 50m drive split benchmark.',
    },
    women: {
      mark: '— (No Official AFI Record)',
      numericValue: 6.28,
      unit: 's',
      athlete: 'AFI does not contest 50m',
      stateOrUnit: 'AFI National Camps',
      year: 2026,
      competition: 'AFI National Camp Timing Gates (Drive Phase Split)',
      venue: 'National Camp',
      notes: '50m is not an official AFI outdoor or indoor championship event (shortest official indoor is 60m: 7.28s). 6.28s is the elite 50m drive split benchmark.',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '5.85s',
      menFinalistApprox: '6.00s',
      womenGoldApprox: '6.40s',
      womenFinalistApprox: '6.65s',
    },
  },
  {
    eventCode: '60m',
    eventName: '60m (Indoor)',
    category: 'track',
    men: {
      mark: '6.60s',
      numericValue: 6.60,
      unit: 's',
      athlete: 'Gurindervir Singh',
      stateOrUnit: 'Punjab',
      year: 2026,
      competition: 'National Indoor Athletics Championships',
      venue: 'Kalinga Stadium, Bhubaneswar (March 25, 2026)',
      notes: 'Broke Elakkiyadasan Kannada previous indoor national mark (6.71s / 6.67s) with a historic 6.60s sprint in Bhubaneswar.',
    },
    women: {
      mark: '7.28s',
      numericValue: 7.28,
      unit: 's',
      athlete: 'Dutee Chand',
      stateOrUnit: 'Odisha',
      year: 2016,
      competition: 'Asian Indoor Athletics Championships',
      venue: 'Doha, Qatar',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '6.60s',
      menFinalistApprox: '6.75s',
      womenGoldApprox: '7.32s',
      womenFinalistApprox: '7.55s',
    },
  },
  {
    eventCode: '1_mile',
    eventName: 'One Mile',
    category: 'track',
    men: {
      mark: '3:56.59',
      numericValue: 236.59,
      unit: 'min',
      athlete: 'Jinson Johnson',
      stateOrUnit: 'Kerala / Indian Army',
      year: 2019,
      competition: 'British Grand Prix',
      venue: 'Birmingham, UK',
    },
    women: {
      mark: '4:31.90',
      numericValue: 271.90,
      unit: 'min',
      athlete: 'Harmilan Bains',
      stateOrUnit: 'Punjab',
      year: 2023,
      competition: 'Manchester World Athletics Continental Tour',
      venue: 'Manchester, UK',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '4:02.00',
      menFinalistApprox: '4:12.00',
      womenGoldApprox: '4:38.00',
      womenFinalistApprox: '4:50.00',
    },
  },
  {
    eventCode: '3000m',
    eventName: '3000m Flat',
    category: 'track',
    men: {
      mark: '7:34.49',
      numericValue: 454.49,
      unit: 'min',
      athlete: 'Gulveer Singh',
      stateOrUnit: 'Uttar Pradesh / Indian Army',
      year: 2025,
      competition: 'Budapest Continental Tour Gold',
      venue: 'Budapest, Hungary',
      notes: 'Smashed Surendra Singh 17-year-old record (7:50.31).',
    },
    women: {
      mark: '8:57.19',
      numericValue: 537.19,
      unit: 'min',
      athlete: 'Parul Chaudhary',
      stateOrUnit: 'Uttar Pradesh',
      year: 2023,
      competition: 'Sound Running Track Meet',
      venue: 'Los Angeles, USA',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '7:48.00',
      menFinalistApprox: '8:10.00',
      womenGoldApprox: '9:15.00',
      womenFinalistApprox: '9:40.00',
    },
  },
  {
    eventCode: 'half_marathon',
    eventName: 'Half Marathon',
    category: 'road_and_walk',
    men: {
      mark: '1:00:30',
      numericValue: 3630,
      unit: 'min',
      athlete: 'Avinash Sable',
      stateOrUnit: 'Maharashtra / Indian Army',
      year: 2020,
      competition: 'Airtel Delhi Half Marathon',
      venue: 'New Delhi',
    },
    women: {
      mark: '1:10:31',
      numericValue: 4231,
      unit: 'min',
      athlete: 'Suriya Loganathan',
      stateOrUnit: 'Tamil Nadu / Railways',
      year: 2017,
      competition: 'Airtel Delhi Half Marathon',
      venue: 'New Delhi',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '1:04:30',
      menFinalistApprox: '1:09:00',
      womenGoldApprox: '1:14:00',
      womenFinalistApprox: '1:20:00',
    },
  },
  {
    eventCode: 'marathon',
    eventName: 'Marathon',
    category: 'road_and_walk',
    men: {
      mark: '2:11:37',
      numericValue: 7897,
      unit: 'min',
      athlete: 'Sawan Barwal',
      stateOrUnit: 'Himachal Pradesh / Indian Army',
      year: 2026,
      competition: 'Rotterdam Marathon / Asian Games Medalist',
      venue: 'Rotterdam, Netherlands',
      notes: 'Broke Shivnath Singh 48-year-old historic record from 1978 (2:12:00).',
    },
    women: {
      mark: '2:34:43',
      numericValue: 9283,
      unit: 'min',
      athlete: 'Jaisha Orchatteri',
      stateOrUnit: 'Kerala',
      year: 2015,
      competition: 'World Athletics Championships',
      venue: 'Beijing, China',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '2:14:00',
      menFinalistApprox: '2:22:00',
      womenGoldApprox: '2:40:00',
      womenFinalistApprox: '2:56:00',
    },
  },
  {
    eventCode: '10km_race_walk',
    eventName: '10km Race Walk',
    category: 'road_and_walk',
    men: {
      mark: '39:44',
      numericValue: 2384,
      unit: 'min',
      athlete: 'Akshdeep Singh',
      stateOrUnit: 'Punjab',
      year: 2023,
      competition: 'National Open Race Walking Championships',
      venue: 'Ranchi',
    },
    women: {
      mark: '43:38',
      numericValue: 2618,
      unit: 'min',
      athlete: 'Priyanka Goswami',
      stateOrUnit: 'Uttar Pradesh / Indian Railways',
      year: 2022,
      competition: 'Commonwealth Games (Silver Medal)',
      venue: 'Birmingham, UK',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '41:30',
      menFinalistApprox: '45:00',
      womenGoldApprox: '46:30',
      womenFinalistApprox: '51:00',
    },
  },
  {
    eventCode: '20km_race_walk',
    eventName: '20km Race Walk',
    category: 'road_and_walk',
    men: {
      mark: '1:19:38',
      numericValue: 4778,
      unit: 'min',
      athlete: 'Akshdeep Singh',
      stateOrUnit: 'Punjab',
      year: 2024,
      competition: 'National Open Race Walking Championships',
      venue: 'Chandigarh',
      notes: 'Qualified for Paris 2024 Olympics.',
    },
    women: {
      mark: '1:28:45',
      numericValue: 5325,
      unit: 'min',
      athlete: 'Priyanka Goswami',
      stateOrUnit: 'Uttar Pradesh / Indian Railways',
      year: 2021,
      competition: 'National Open Race Walking Championships',
      venue: 'Ranchi',
      notes: 'Tokyo 2020 & Paris 2024 Olympian.',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '1:23:00',
      menFinalistApprox: '1:31:00',
      womenGoldApprox: '1:33:00',
      womenFinalistApprox: '1:44:00',
    },
  },
  {
    eventCode: '35km_race_walk',
    eventName: '35km Race Walk',
    category: 'road_and_walk',
    men: {
      mark: '2:29:56',
      numericValue: 8996,
      unit: 'min',
      athlete: 'Ram Baboo',
      stateOrUnit: 'Uttar Pradesh',
      year: 2023,
      competition: 'Dudinska 50',
      venue: 'Dudince, Slovakia',
    },
    women: {
      mark: '2:57:54',
      numericValue: 10674,
      unit: 'min',
      athlete: 'Manju Rani',
      stateOrUnit: 'Punjab',
      year: 2023,
      competition: 'National Open Race Walking Championships',
      venue: 'Ranchi',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '2:36:00',
      menFinalistApprox: '2:52:00',
      womenGoldApprox: '3:05:00',
      womenFinalistApprox: '3:25:00',
    },
  },
  {
    eventCode: '4x100m',
    eventName: '4x100m Relay',
    category: 'track',
    men: {
      mark: '38.89s',
      numericValue: 38.89,
      unit: 's',
      athlete: 'Rahamatulla Molla, Suresh Sathya, Shameer Naseema, Abdul Najeeb Qureshi',
      stateOrUnit: 'India National Team',
      year: 2010,
      competition: 'Commonwealth Games (Bronze Medal)',
      venue: 'New Delhi',
    },
    women: {
      mark: '43.37s',
      numericValue: 43.37,
      unit: 's',
      athlete: 'Dutee Chand, Hima Das, S. Dhanalakshmi, Archana Suseendran',
      stateOrUnit: 'India National Team',
      year: 2021,
      competition: 'Indian Grand Prix IV',
      venue: 'Patiala',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '39.80s',
      menFinalistApprox: '41.20s',
      womenGoldApprox: '44.50s',
      womenFinalistApprox: '46.80s',
    },
  },
  {
    eventCode: '4x400m',
    eventName: '4x400m Relay',
    category: 'track',
    men: {
      mark: '2:59.05',
      numericValue: 179.05,
      unit: 'min',
      athlete: 'Muhammed Anas Yahiya, Amoj Jacob, Muhammed Ajmal, Rajesh Ramesh',
      stateOrUnit: 'India National Team',
      year: 2023,
      competition: 'World Athletics Championships Finalists (Asian Record)',
      venue: 'Budapest, Hungary',
      notes: 'Sub-3 minute historic milestone for Indian & Asian sprinting.',
    },
    women: {
      mark: '3:26.89',
      numericValue: 206.89,
      unit: 'min',
      athlete: 'Rajwinder Kaur, K.M. Beenamol, Chitra Soman, Manjit Kaur',
      stateOrUnit: 'India National Team',
      year: 2004,
      competition: 'Olympic Games Final',
      venue: 'Athens, Greece',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '3:05.00',
      menFinalistApprox: '3:12.00',
      womenGoldApprox: '3:32.00',
      womenFinalistApprox: '3:45.00',
    },
  },
  {
    eventCode: '4x400m_mixed',
    eventName: '4x400m Mixed Relay',
    category: 'track',
    men: {
      mark: '3:12.87',
      numericValue: 192.87,
      unit: 'min',
      athlete: 'Muhammed Anas, Jyothika Sri Dandi, Muhammad Ajmal, Kiran Pahal',
      stateOrUnit: 'India National Team',
      year: 2024,
      competition: '63rd National Inter-State Senior Athletics Championships',
      venue: 'Panchkula, Haryana',
      notes: 'Broke Bahamas World Relays 3:14.12 mark.',
    },
    women: {
      mark: '3:12.87',
      numericValue: 192.87,
      unit: 'min',
      athlete: 'Muhammed Anas, Jyothika Sri Dandi, Muhammad Ajmal, Kiran Pahal',
      stateOrUnit: 'India National Team',
      year: 2024,
      competition: '63rd National Inter-State Senior Athletics Championships',
      venue: 'Panchkula, Haryana',
      notes: 'Broke Bahamas World Relays 3:14.12 mark.',
    },
    afiNationalChampionshipStandards: {
      menGoldApprox: '3:16.00',
      menFinalistApprox: '3:24.00',
      womenGoldApprox: '3:16.00',
      womenFinalistApprox: '3:24.00',
    },
  },
];

// Quick index for fast lookup by code
export const INDIAN_RECORDS_BY_CODE: Record<string, IndianNationalRecord> = {};
INDIAN_NATIONAL_RECORDS.forEach((rec) => {
  const c = rec.eventCode.toLowerCase();
  INDIAN_RECORDS_BY_CODE[c] = rec;
  INDIAN_RECORDS_BY_CODE[c.replace(/[^a-z0-9]/g, '')] = rec;
  
  // Specific event alias indexing
  if (c === '110mh') {
    INDIAN_RECORDS_BY_CODE['100mh'] = rec;
    INDIAN_RECORDS_BY_CODE['110m_hurdles'] = rec;
    INDIAN_RECORDS_BY_CODE['100m_hurdles'] = rec;
    INDIAN_RECORDS_BY_CODE['hurdles'] = rec;
  }
  if (c === '400mh') {
    INDIAN_RECORDS_BY_CODE['400m_hurdles'] = rec;
  }
  if (c === '1_mile') {
    INDIAN_RECORDS_BY_CODE['1mile'] = rec;
    INDIAN_RECORDS_BY_CODE['mile'] = rec;
  }
  if (c === '3000m_sc') {
    INDIAN_RECORDS_BY_CODE['3000msc'] = rec;
    INDIAN_RECORDS_BY_CODE['3000m_steeplechase'] = rec;
    INDIAN_RECORDS_BY_CODE['2000m_sc'] = rec;
    INDIAN_RECORDS_BY_CODE['2000m_steeplechase'] = rec;
    INDIAN_RECORDS_BY_CODE['steeplechase'] = rec;
  }
  if (c === 'decathlon') {
    INDIAN_RECORDS_BY_CODE['heptathlon'] = rec;
    INDIAN_RECORDS_BY_CODE['indoor_heptathlon'] = rec;
    INDIAN_RECORDS_BY_CODE['indoor_pentathlon'] = rec;
    INDIAN_RECORDS_BY_CODE['combined'] = rec;
  }
  if (c === '10km_race_walk') {
    INDIAN_RECORDS_BY_CODE['10km_walk'] = rec;
    INDIAN_RECORDS_BY_CODE['10kmwalk'] = rec;
  }
  if (c === '20km_race_walk') {
    INDIAN_RECORDS_BY_CODE['20km_walk'] = rec;
    INDIAN_RECORDS_BY_CODE['20kmwalk'] = rec;
    INDIAN_RECORDS_BY_CODE['marathon_walk_mixed_relay'] = rec;
  }
  if (c === '35km_race_walk') {
    INDIAN_RECORDS_BY_CODE['35km_walk'] = rec;
    INDIAN_RECORDS_BY_CODE['35kmwalk'] = rec;
  }
  if (c === '4x100m') {
    INDIAN_RECORDS_BY_CODE['4x100'] = rec;
    INDIAN_RECORDS_BY_CODE['4x200m'] = rec;
  }
  if (c === '4x400m') {
    INDIAN_RECORDS_BY_CODE['4x400'] = rec;
    INDIAN_RECORDS_BY_CODE['4x800m'] = rec;
    INDIAN_RECORDS_BY_CODE['dmr'] = rec;
  }
  if (c === '4x400m_mixed') {
    INDIAN_RECORDS_BY_CODE['4x400_mixed'] = rec;
  }
  if (c === 'long_jump') {
    INDIAN_RECORDS_BY_CODE['longjump'] = rec;
  }
  if (c === 'triple_jump') {
    INDIAN_RECORDS_BY_CODE['triplejump'] = rec;
  }
  if (c === 'high_jump') {
    INDIAN_RECORDS_BY_CODE['highjump'] = rec;
  }
  if (c === 'pole_vault') {
    INDIAN_RECORDS_BY_CODE['polevault'] = rec;
  }
  if (c === 'shot_put') {
    INDIAN_RECORDS_BY_CODE['shotput'] = rec;
  }
  if (c === 'discus_throw') {
    INDIAN_RECORDS_BY_CODE['discusthrow'] = rec;
    INDIAN_RECORDS_BY_CODE['discus'] = rec;
  }
  if (c === 'hammer_throw') {
    INDIAN_RECORDS_BY_CODE['hammerthrow'] = rec;
    INDIAN_RECORDS_BY_CODE['hammer'] = rec;
    INDIAN_RECORDS_BY_CODE['weight_throw'] = rec;
  }
  if (c === 'javelin_throw') {
    INDIAN_RECORDS_BY_CODE['javelinthrow'] = rec;
    INDIAN_RECORDS_BY_CODE['javelin'] = rec;
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

  // 12. Flying 30m Sprint (s) - Maximum Velocity
  'FLYING_30M': {
    male: {
      testCode: 'FLYING_30M',
      sex: 'male',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 3.42 },
        { percentile: 25, value: 3.24 },
        { percentile: 50, value: 3.04 },
        { percentile: 75, value: 2.88 },
        { percentile: 90, value: 2.76 },
        { percentile: 95, value: 2.66 },
      ],
    },
    female: {
      testCode: 'FLYING_30M',
      sex: 'female',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 3.82 },
        { percentile: 25, value: 3.60 },
        { percentile: 50, value: 3.36 },
        { percentile: 75, value: 3.18 },
        { percentile: 90, value: 3.02 },
        { percentile: 95, value: 2.92 },
      ],
    },
  },

  // 13. Illinois Agility Run Test (s)
  'ILLINOIS_AGILITY': {
    male: {
      testCode: 'ILLINOIS_AGILITY',
      sex: 'male',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 17.6 },
        { percentile: 25, value: 16.7 },
        { percentile: 50, value: 15.8 },
        { percentile: 75, value: 15.1 },
        { percentile: 90, value: 14.5 },
        { percentile: 95, value: 14.0 },
      ],
    },
    female: {
      testCode: 'ILLINOIS_AGILITY',
      sex: 'female',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 19.4 },
        { percentile: 25, value: 18.5 },
        { percentile: 50, value: 17.4 },
        { percentile: 75, value: 16.6 },
        { percentile: 90, value: 15.8 },
        { percentile: 95, value: 15.2 },
      ],
    },
  },

  // 14. T-Test Agility (s)
  'T_TEST_AGILITY': {
    male: {
      testCode: 'T_TEST_AGILITY',
      sex: 'male',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 11.2 },
        { percentile: 25, value: 10.4 },
        { percentile: 50, value: 9.7 },
        { percentile: 75, value: 9.2 },
        { percentile: 90, value: 8.8 },
        { percentile: 95, value: 8.5 },
      ],
    },
    female: {
      testCode: 'T_TEST_AGILITY',
      sex: 'female',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 12.4 },
        { percentile: 25, value: 11.6 },
        { percentile: 50, value: 10.8 },
        { percentile: 75, value: 10.1 },
        { percentile: 90, value: 9.6 },
        { percentile: 95, value: 9.2 },
      ],
    },
  },

  // 15. Yo-Yo Intermittent Recovery Test Level 2 (m)
  'YOYO_IR2': {
    male: {
      testCode: 'YOYO_IR2',
      sex: 'male',
      unit: 'm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 480 },
        { percentile: 25, value: 680 },
        { percentile: 50, value: 880 },
        { percentile: 75, value: 1080 },
        { percentile: 90, value: 1280 },
        { percentile: 95, value: 1440 },
      ],
    },
    female: {
      testCode: 'YOYO_IR2',
      sex: 'female',
      unit: 'm',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 360 },
        { percentile: 25, value: 520 },
        { percentile: 50, value: 680 },
        { percentile: 75, value: 840 },
        { percentile: 90, value: 1000 },
        { percentile: 95, value: 1160 },
      ],
    },
  },

  // 16. 20m Multi-Stage Shuttle Run (Beep Test) - Laps
  'SHUTTLE_20M': {
    male: {
      testCode: 'SHUTTLE_20M',
      sex: 'male',
      unit: 'laps',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 55 },
        { percentile: 25, value: 72 },
        { percentile: 50, value: 90 },
        { percentile: 75, value: 108 },
        { percentile: 90, value: 124 },
        { percentile: 95, value: 135 },
      ],
    },
    female: {
      testCode: 'SHUTTLE_20M',
      sex: 'female',
      unit: 'laps',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 42 },
        { percentile: 25, value: 56 },
        { percentile: 50, value: 70 },
        { percentile: 75, value: 85 },
        { percentile: 90, value: 98 },
        { percentile: 95, value: 108 },
      ],
    },
  },

  // 17. Relative Back Squat 1RM (Ratio to Bodyweight)
  'SQUAT_1RM_RATIO': {
    male: {
      testCode: 'SQUAT_1RM_RATIO',
      sex: 'male',
      unit: 'ratio',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 1.45 },
        { percentile: 25, value: 1.70 },
        { percentile: 50, value: 2.00 },
        { percentile: 75, value: 2.30 },
        { percentile: 90, value: 2.55 },
        { percentile: 95, value: 2.75 },
      ],
    },
    female: {
      testCode: 'SQUAT_1RM_RATIO',
      sex: 'female',
      unit: 'ratio',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 1.15 },
        { percentile: 25, value: 1.35 },
        { percentile: 50, value: 1.60 },
        { percentile: 75, value: 1.85 },
        { percentile: 90, value: 2.10 },
        { percentile: 95, value: 2.30 },
      ],
    },
  },

  // 18. 30s Wingate Anaerobic Power (W/kg)
  'WINGATE_30S': {
    male: {
      testCode: 'WINGATE_30S',
      sex: 'male',
      unit: 'W/kg',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 11.2 },
        { percentile: 25, value: 12.8 },
        { percentile: 50, value: 14.5 },
        { percentile: 75, value: 16.2 },
        { percentile: 90, value: 17.8 },
        { percentile: 95, value: 19.0 },
      ],
    },
    female: {
      testCode: 'WINGATE_30S',
      sex: 'female',
      unit: 'W/kg',
      direction: 'higher_is_better',
      percentiles: [
        { percentile: 10, value: 9.0 },
        { percentile: 25, value: 10.4 },
        { percentile: 50, value: 11.8 },
        { percentile: 75, value: 13.2 },
        { percentile: 90, value: 14.6 },
        { percentile: 95, value: 15.6 },
      ],
    },
  },

  // 19. Lactate Tolerance 6x400m Average Lap (s)
  'LACTATE_TOLERANCE_6X400': {
    male: {
      testCode: 'LACTATE_TOLERANCE_6X400',
      sex: 'male',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 72.0 },
        { percentile: 25, value: 66.0 },
        { percentile: 50, value: 61.0 },
        { percentile: 75, value: 57.0 },
        { percentile: 90, value: 54.0 },
        { percentile: 95, value: 52.0 },
      ],
    },
    female: {
      testCode: 'LACTATE_TOLERANCE_6X400',
      sex: 'female',
      unit: 's',
      direction: 'lower_is_better',
      percentiles: [
        { percentile: 10, value: 82.0 },
        { percentile: 25, value: 75.0 },
        { percentile: 50, value: 69.5 },
        { percentile: 75, value: 64.5 },
        { percentile: 90, value: 61.0 },
        { percentile: 95, value: 58.5 },
      ],
    },
  },
};

// Aliases for full seed test codes
INDIAN_ATHLETIC_TEST_NORMS['SPRINT_10M'] = INDIAN_ATHLETIC_TEST_NORMS['10M'];
INDIAN_ATHLETIC_TEST_NORMS['SPRINT_30M'] = INDIAN_ATHLETIC_TEST_NORMS['30M'];
INDIAN_ATHLETIC_TEST_NORMS['FLYING_10M_VELOCITY'] = INDIAN_ATHLETIC_TEST_NORMS['FLY10M'];
INDIAN_ATHLETIC_TEST_NORMS['RSI_DROP_JUMP'] = INDIAN_ATHLETIC_TEST_NORMS['RSI'];
INDIAN_ATHLETIC_TEST_NORMS['BOMST_MEDBALL'] = INDIAN_ATHLETIC_TEST_NORMS['BOMST'];
INDIAN_ATHLETIC_TEST_NORMS['COOPER_12MIN'] = INDIAN_ATHLETIC_TEST_NORMS['COOPER'];
INDIAN_ATHLETIC_TEST_NORMS['SIT_AND_REACH'] = INDIAN_ATHLETIC_TEST_NORMS['SIT_REACH'];

