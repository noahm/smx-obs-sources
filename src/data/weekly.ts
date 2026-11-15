import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export interface WeeklyBoardRow {
  rank: number;
  username: string;
  points: number;
}

export interface WeeklyBoard {
  user: string;
  period_start: string;
  period_end: string;
  rank: number | null;
  points: number;
  total_players: number;
  context: Array<WeeklyBoardRow>;
}

const IDLE_POLL_MS = 45_000;
/** server-side data refreshes on ~10s minimum interval, so wait a bit past that before re-fetching after a new score is posted */
const POST_SCORE_REFETCH_DELAY_MS = 12_000;

const queryKey = (username: string) => ["weekly-leaderboard", username];
const weeklyLeaderboardUrl = (username: string) =>
  `https://unplayed.smx.tools/?board=weekly&user=${encodeURIComponent(username)}&context=1&format=json`;

export function useWeeklyLeaderboard(username: string, scoreTrigger?: unknown) {
  const client = useQueryClient();

  const query = useQuery({
    enabled: !!username,
    queryKey: queryKey(username),
    queryFn: async ({ signal }) => {
      const req = await fetch(weeklyLeaderboardUrl(username), { signal });
      if (!req.ok) {
        const body = (await req.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          body?.error ?? `weekly leaderboard request failed (${req.status})`,
        );
      }
      return (await req.json()) as WeeklyBoard;
    },
    refetchInterval: IDLE_POLL_MS,
  });

  useEffect(() => {
    if (!username || scoreTrigger === undefined) return;
    const timeout = setTimeout(() => {
      client.invalidateQueries({ queryKey: queryKey(username) });
    }, POST_SCORE_REFETCH_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [username, scoreTrigger, client]);

  return query;
}
