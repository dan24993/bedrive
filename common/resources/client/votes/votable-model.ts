export interface VotableModel {
  id: number;
  upvotes: number;
  downvotes: number;
  score: number;
  model_type: string;
  current_vote?: 'upvote' | 'downvote';
  reports_count?: number;
}
