export interface ProfileAnalysis {
  name: string;
  recentRole: string;
  experiences: string[];
  skills: string[];
  careerGoal: string;
  linkedinUrl?: string;
  goodThings?: string[];
  badThings?: string[];
  profileSuggestions?: string[];
  avatarUrl?: string;
}

export interface RecommendedSkill {
  skillName: string;
  explanation: string;
}

export interface ProfileOptimization {
  headline: string;
  aboutSection: string;
  skillsToAdd: RecommendedSkill[];
  photoAndBannerTips: string;
  connectionStrategy: string;
}

export interface LinkedInPost {
  topic: string;
  hook: string;
  fullPost: string;
  imageSuggestion: string;
  bestTimeToPost: string;
  hashtags: string[];
}

export interface WeeklyPostPlan {
  day: string;
  topic: string;
  description: string;
}

export interface WeekPlan {
  weekNumber: number;
  posts: WeeklyPostPlan[];
}

export interface OptimizeResponse {
  profile: ProfileAnalysis;
  optimization: ProfileOptimization;
  posts: LinkedInPost[];
  weeklyPlan: WeekPlan[];
  isQuotaFallback?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface TerminalSimulation {
  showTerminal: boolean;
  directory: string;
  command: string;
  outputLines: string[];
}

export interface CodeSimulation {
  language: string;
  fileName: string;
  codeLineList: string[];
}

export interface TopicPostResponse {
  post: LinkedInPost;
  terminalSimulation?: TerminalSimulation;
  codeSimulation?: CodeSimulation;
  isQuotaFallback?: boolean;
}

export interface MemoryItem {
  id: string;
  type: 'link' | 'text' | 'name' | 'prompt' | 'other';
  label: string;
  value: string;
  enabled: boolean;
  lastUsedAt?: string;
}

