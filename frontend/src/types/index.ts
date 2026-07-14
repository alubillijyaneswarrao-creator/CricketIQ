export interface PlayerStats {
  matches: number;
  runs?: number;
  wickets?: number;
  average: number;
  strike_rate?: number;
  economy?: number;
  hundreds?: number;
  fifties?: number;
  five_wickets?: number;
  highest_score?: string;
  best_bowling?: string;
}

export interface PlayerRecentForm {
  opponent: string;
  format: string;
  runs?: number;
  balls?: number;
  wickets?: number;
  runs_conceded?: number;
  overs?: number;
}

export interface PlayerTimeline {
  year: string;
  event: string;
}

export interface Player {
  id: number;
  name: string;
  country: string;
  role: string;
  batting_style?: string;
  bowling_style?: string;
  image_url?: string;
  icc_rankings: Record<string, number>;
  stats: Record<string, PlayerStats>;
  recent_form: PlayerRecentForm[];
  timeline: PlayerTimeline[];
  bio?: string;
  ai_summary?: string;
}

export interface MatchBatter {
  name: string;
  status: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  sr: number;
}

export interface MatchBowler {
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface MatchInnings {
  team: string;
  score: string;
  wickets: string;
  overs: string;
  batting: MatchBatter[];
  bowling: MatchBowler[];
}

export interface MatchScorecard {
  innings_1: MatchInnings;
  innings_2: MatchInnings;
}

export interface MatchCharts {
  worm_graph: Array<{ over: number; team_a_runs: number; team_b_runs: number }>;
  partnership: Array<{ players: string; runs: number; balls: number; team: string }>;
  live_meta?: {
    overs: string;
    run_rate: string;
    projected_score_8: string;
    projected_score_10: string;
    recent_balls: string[];
  };
}

export interface Match {
  id: number;
  title: string;
  team_a: string;
  team_b: string;
  status: string; // completed, live, scheduled
  format: string; // Test, ODI, T20I
  date?: string;
  venue?: string;
  scorecard?: MatchScorecard;
  charts_data?: MatchCharts;
  summary?: string;
  turning_points?: string[];
  momentum_data?: Array<{ over: number; intensity: number }>;
  predictions?: {
    win_probability?: Record<string, number>;
    win_probability_final?: Record<string, number>;
    projected_score?: string;
    ai_insights?: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface SavedChat {
  id: string;
  title: string;
  messages: ChatMessage[];
  is_bookmarked: boolean;
  created_at: string;
}

export interface SearchResult {
  id: string;
  content: string;
  category: string;
  confidence: number;
  metadata: {
    source?: string;
    filename?: string;
    page?: number;
  };
}

export interface IngestedDocument {
  id: number;
  filename: string;
  uploaded_at: string;
  chunk_count: number;
}
