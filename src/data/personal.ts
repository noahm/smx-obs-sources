import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Score } from "./models";

// const keyForLatest = (username: string) => ["latest-score", username];
const latestScores = (username: string, proto: "https" | "wss") =>
  `${proto}://api.smx.573.no/scores?q=${encodeURIComponent(
    JSON.stringify({ "gamer.username": username, _take: 1 }),
  )}`;

export function useLiveLatestScore(username: string): Score | null {
  const [latestScore, setLatestScore] = useState<Score | null>(null);
  // const client = useQueryClient();
  useEffect(() => {
    const socket = new WebSocket(latestScores(username, "wss"));
    socket.addEventListener("message", (evt: MessageEvent<Score>) => {
      // client.setQueryData(keyForLatest(username), [evt.data]);
      setLatestScore(evt.data);
    });
    return () => {
      socket.close();
    };
  }, [username]);
  return latestScore;

  // return useQuery({
  //   queryKey: keyForLatest(username),
  //   queryFn: async ({ signal }) => {
  //     const req = await fetch(latestScores(username, "https"), { signal });
  //     return (await req.json()) as Array<Score>;
  //   },
  // });
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
    }),
  )}`;

export function useBestScores(
  username: string,
  songChartId: number,
  count: number,
) {
  return useQuery({
    queryKey: keyForPersonalScores(username, songChartId, count),
    queryFn: async ({ signal }) => {
      const req = await fetch(
        personalScoresOnChart(username, songChartId, count),
        {
          signal,
        },
      );
      return (await req.json()) as Array<Score>;
    },
  });
}
