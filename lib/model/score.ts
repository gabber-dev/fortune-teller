export interface Score {
  wit: 'poor' | 'fair' | 'good';
  wit_summary: string;
  humor: 'poor' | 'fair' | 'good';
  humor_summary: string;
  confidence: 'poor' | 'fair' | 'good';
  confidence_summary: string;
  seductiveness: 'poor' | 'fair' | 'good';
  seductiveness_summary: string;
  flow: 'poor' | 'fair' | 'good';
  flow_summary: string;
  kindness: 'poor' | 'fair' | 'good';
  kindness_summary: string;
  overall_summary: string;
  rizz_score: number;
}