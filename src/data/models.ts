export interface Score {
  score: number;
  created_at: string;
  personal_best: number;
  personal_best_previous: number;
  chart: {
    /** the `songChartId` that uniquely identifies this chart */
    _id: number;
    /** the difficulty level */
    difficulty: number;
    /** e.g. "full+" */
    difficulty_display: string;
  };
  song: {
    title: string;
    artist: string;
    cover: string;
    cover_thumb: string;
  };
}
