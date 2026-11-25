import type { AthleteProfile } from './athlete';

export type SportZone = 'track_and_field' | 'multi_sports';

export interface MultiSportDefinition {
  id: string;
  name: string;
  defaultRoles: string[];
}

export const MULTI_SPORTS_CATALOG: MultiSportDefinition[] = [
  {
    id: 'sport-football',
    name: 'Football (Soccer)',
    defaultRoles: ['Striker / Forward', 'Winger', 'Attacking Midfielder', 'Central Midfielder', 'Defender', 'Goalkeeper'],
  },
  {
    id: 'sport-cricket',
    name: 'Cricket',
    defaultRoles: ['Fast Bowler', 'Spin Bowler', 'Top-Order Batter', 'Middle-Order Batter', 'Wicketkeeper', 'All-Rounder'],
  },
  {
    id: 'sport-basketball',
    name: 'Basketball',
    defaultRoles: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
  },
  {
    id: 'sport-badminton',
    name: 'Badminton',
    defaultRoles: ['Men/Women Singles', 'Doubles Specialist', 'Mixed Doubles'],
  },
  {
    id: 'sport-hockey',
    name: 'Field Hockey',
    defaultRoles: ['Forward / Striker', 'Midfielder', 'Defender', 'Drag-Flicker', 'Goalkeeper'],
  },
  {
    id: 'sport-tennis',
    name: 'Tennis',
    defaultRoles: ['Singles Specialist', 'Doubles Specialist', 'All-Court Player'],
  },
  {
    id: 'sport-kabaddi',
    name: 'Kabaddi',
    defaultRoles: ['Raider', 'Corner Defender', 'Cover Defender', 'All-Rounder'],
  },
  {
    id: 'sport-volleyball',
    name: 'Volleyball',
    defaultRoles: ['Outside Hitter', 'Opposite Hitter', 'Middle Blocker', 'Setter', 'Libero'],
  },
  {
    id: 'sport-swimming',
    name: 'Swimming',
    defaultRoles: ['Sprint Freestyle', 'Distance Freestyle', 'Backstroke / Butterfly', 'Breaststroke', 'Individual Medley'],
  },
  {
    id: 'sport-combat',
    name: 'Combat Sports (Wrestling / Boxing / Judo)',
    defaultRoles: ['Freestyle Wrestler', 'Boxer', 'Judoka / Martial Artist'],
  },
  {
    id: 'sport-table-tennis',
    name: 'Table Tennis & Squash',
    defaultRoles: ['Singles Player', 'Doubles Player'],
  },
  {
    id: 'sport-conditioning',
    name: 'General Conditioning & Academy Combine',
    defaultRoles: ['All-Rounder Prospect', 'Youth Development', 'Strength & Power Focus', 'Endurance Focus'],
  },
];

export const CONDITIONING_FOCUS_TAGS = [
  'Speed & Acceleration',
  'Explosive Power & Jump',
  'Maximal Strength',
  'Agility & Change of Direction',
  'Yo-Yo / Aerobic Endurance',
  'Core & Flexibility',
  'Bilateral Balance & Rehab',
];

export function getAthleteZone(athlete: Pick<AthleteProfile, 'sportZone'>): SportZone {
  return athlete.sportZone === 'multi_sports' ? 'multi_sports' : 'track_and_field';
}
