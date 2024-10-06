export interface Candidate {
    id: number;
    name: string;
    description: string;
    image_url: string;
  }
  
  export interface CandidateStats {
    id: number;
    name: string;
    votes: number;
  }
  
  export interface VoteStatus {
    has_voted: boolean;
  }
  
  export interface Stats {
    total_votes: number;
    candidates: CandidateStats[];
  }