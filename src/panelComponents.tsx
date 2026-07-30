import type { UseQueryResult } from "@tanstack/react-query";
import { useLeaderboardNeighbors } from "./data/global";
import type { Score } from "./data/models";
import { useWeeklyLeaderboard } from "./data/weekly";
import { PreviousBests } from "./PreviousBest";
import styles from "./pb.module.css";

/** Props shared by every configurable panel. */
export interface PanelProps {
  username: string;
  /** the shared live-latest-score query, owned once by the container */
  scoreQuery: UseQueryResult<Score | undefined>;
}

function pbDiff(s: Score) {
  if (!s.personal_best_previous) return null;
  if (s.score === s.personal_best) {
    return `(+${(s.score - s.personal_best_previous).toLocaleString()})`;
  }
  return `(${(s.score - s.personal_best).toLocaleString()})`;
}

export function LastPlayedPanel({ scoreQuery }: PanelProps) {
  return (
    <div>
      <h4>Last played</h4>
      <LastPlayedInfo query={scoreQuery} />
    </div>
  );
}

function LastPlayedInfo({
  query,
}: {
  query: UseQueryResult<Score | undefined>;
}) {
  if (query.isPending) return "loading...";
  if (!query.data) return null;
  const score = query.data;
  return (
    <>
      <img
        className={styles.jacketThumb}
        src={`https://data.stepmaniax.com/${score.song.cover_thumb}`}
      />
      {score.song.title}{" "}
      <em>
        {/* TODO, color-code by difficulty type, add icons */}
        {score.chart.difficulty_display} {score.chart.difficulty}
      </em>
      <br />{" "}
      <strong>
        {score.score.toLocaleString()} {pbDiff(score)}
      </strong>
    </>
  );
}

export function BestBeforeTodayPanel({ username, scoreQuery }: PanelProps) {
  return (
    <div>
      <h4>Best Before Today</h4>
      <PreviousBests
        username={username}
        songChartId={scoreQuery.data?.chart._id}
      />
    </div>
  );
}

export function SongRankingsPanel({ username, scoreQuery }: PanelProps) {
  return (
    <div>
      <h4>Song Rankings</h4>
      <LeaderboardSlice username={username} score={scoreQuery.data} />
    </div>
  );
}

function LeaderboardSlice(props: {
  username: string;
  score: Score | undefined;
}) {
  const lbItems = useLeaderboardNeighbors(props.score);
  if (!lbItems?.length) return null;

  return (
    <ol start={lbItems[0].atRank} className={styles.leaderboardSlice}>
      {lbItems.map((lbScore) => (
        <li
          key={lbScore._id}
          className={
            lbScore.gamer.username.toLowerCase() ===
            props.username.toLowerCase()
              ? styles.highlightRow
              : undefined
          }
        >
          {lbScore.gamer.username}{" "}
          <strong>{lbScore.score.toLocaleString()}</strong>
        </li>
      ))}
    </ol>
  );
}

export function WeeklyLeaderboardPanel({ username, scoreQuery }: PanelProps) {
  return (
    <div>
      <h4>Weekly Leaderboard</h4>
      <WeeklyLeaderboardBody username={username} score={scoreQuery.data} />
    </div>
  );
}

function WeeklyLeaderboardBody(props: {
  username: string;
  score: Score | undefined;
}) {
  const query = useWeeklyLeaderboard(props.username, props.score?._id);
  if (query.isPending) return "loading...";
  if (query.isError || !query.data) return null;
  const board = query.data;

  return (
    <>
      {board.rank === null ? (
        <div>Unranked this week</div>
      ) : (
        <ol start={board.context[0].rank} className={styles.leaderboardSlice}>
          {board.context.map((row) => (
            <li
              key={row.rank}
              className={
                row.username.toLowerCase() === props.username.toLowerCase()
                  ? styles.highlightRow
                  : undefined
              }
            >
              {row.username} <strong>{row.points.toLocaleString()}</strong>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
