import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Score } from "./models";

const keyForLatest = (username: string) => ["latest-score", username];
const latestScores = (username: string, proto: "https" | "wss") => {
  const params: Record<string, string | number | boolean> = {
    "gamer.username": username,
  };
  if (proto === "https") {
    params._take = 1;
  }
  return `${proto}://api.smx.573.no/scores?q=${encodeURIComponent(
    JSON.stringify(params),
  )}`;
};

export function useLiveLatestScore(username: string) {
  // const [latestScore, setLatestScore] = useState<Score | null>(null);
  const client = useQueryClient();
  useEffect(() => {
    if (!username) return;
    const socket = new WebSocket(latestScores(username, "wss"));
    socket.addEventListener("message", (evt: MessageEvent) => {
      try {
        const score: Score = JSON.parse(evt.data);
        client.setQueryData(keyForLatest(username), score);
      } catch {
        console.warn("failed to parse score update", { data: evt.data });
      }
    });
    return () => {
      socket.close();
    };
  }, [username, client]);

  return useQuery({
    queryKey: keyForLatest(username),
    queryFn: async ({ signal }) => {
      const req = await fetch(latestScores(username, "https"), { signal });
      const scores = (await req.json()) as Array<Score>;
      if (scores.length) return scores[0];
    },
  });
}

const now = new Date();

const keyForPersonalScores = (
  username: string,
  songChartId: number,
  count: number,
) => ["personal-best-two", username, songChartId, count];
const personalScoresOnChart = (
  username: string,
  songChartId: number,
  count: number,
) =>
  `https://api.smx.573.no/scores?q=${encodeURIComponent(
    JSON.stringify({
      "gamer.username": username,
      song_chart_id: songChartId,
      created_at: {
        lt: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      },
      _take: count,
      _sort_by: "score",
    }),
  )}`;

export function useBestScores(
  username: string,
  songChartId: number | undefined,
  count: number,
) {
  return useQuery({
    enabled: !!songChartId,
    queryKey: keyForPersonalScores(username, songChartId!, count),
    queryFn: async ({ signal }) => {
      const req = await fetch(
        personalScoresOnChart(username, songChartId!, count),
        {
          signal,
        },
      );
      return (await req.json()) as Array<Score>;
    },
  });
}
