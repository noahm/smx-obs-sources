import { useQuery } from "@tanstack/react-query";
import type { Score } from "./models";

const queryKey = (songChartId: number) => ["leaderboard", songChartId];
const leaderboardUrl = (songChartId: number) =>
  `https://api.smx.573.no/scores?q={"song_chart_id":${songChartId},"_group_by":["gamer_id","song_chart_id"]}`;

export function useLeaderboardScores(songChartId: number) {
  return useQuery({
    queryKey: queryKey(songChartId),
    queryFn: async ({ signal }) => {
      const req = await fetch(leaderboardUrl(songChartId), { signal });
      return (await req.json()) as Array<Score>;
    },
  });
}
