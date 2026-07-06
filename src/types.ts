export interface User {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  bio: string;
  offers: string[];
  wants: string[];
  rating: number;
  email: string;
  github?: string;
  linkedin?: string;
  isCurrent?: boolean;
}

export interface Match {
  id: string;
  matchedWith: User;
  type: 'perfect' | 'give' | 'receive';
  matchedSkillsToReceive: string[]; // Skills they have that you want
  matchedSkillsToGive: string[];    // Skills they want that you have
  score: number;                     // Smart pairing compatibility percentage
}
