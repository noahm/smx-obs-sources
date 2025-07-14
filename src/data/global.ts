import { useInfiniteQuery } from "@tanstack/react-query";
import type { Score } from "./models";

const queryKey = (songChartId: number | undefined) => [
  "leaderboard",
  songChartId,
];
const leaderboardUrl = (songChartId: number, page: number) => {
  const params = JSON.stringify({
    song_chart_id: songChartId,
    _group_by: ["gamer_id", "song_chart_id"],
    _sort_by: "score",
    _take: 100,
    _skip: page * 100,
  });
  return `https://api.smx.573.no/scores?q=${params}`;
};

export function useLeaderboardScores(songChartId: number | undefined) {
  return useInfiniteQuery({
    enabled: !!songChartId,
    queryKey: queryKey(songChartId),
    queryFn: async ({ signal, pageParam }) => {
      const req = await fetch(leaderboardUrl(songChartId!, pageParam), {
        signal,
      });
      return (await req.json()) as Array<Score>;
    },
    initialPageParam: 0,
    getNextPageParam(lastPage, _allPages, lastPageParam) {
      if (lastPage.length < 100) {
        return null;
      }
      return lastPageParam + 1;
    },
  });
}

export function useLeaderboardNeighbors(score: Score | undefined) {
  const query = useLeaderboardScores(score?.chart._id);
  if (!score || !query.data) return null;
  const scores = query.data.pages.flatMap((page) => page) as Array<
    Score & { atRank?: number }
  >;
  let scoreIdx = scores.findIndex((lbScore) => {
    return lbScore._id === score._id;
  });
  if (scoreIdx === -1) {
    // score doesn't exist in leaderboard, so let's find where it would be
    scoreIdx = scores.findIndex((lbScore) => {
      return lbScore.score <= score.score;
    });
    if (scoreIdx === -1) {
      if (query.hasNextPage) {
        if (!query.isFetching) query.fetchNextPage();
        return null;
      }
      scoreIdx = scores.length;
    }
  }
  if (scoreIdx === 0) {
    return scores
      .slice(0, 2)
      .map((score, idx) => ({ ...score, atRank: idx + 1 }));
  }
  return scores
    .slice(scoreIdx - 1, scoreIdx + 2)
    .map((score, idx) => ({ ...score, atRank: idx + scoreIdx }));
}
