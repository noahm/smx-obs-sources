import type { UseQueryResult } from "@tanstack/react-query";
import { useLeaderboardNeighbors } from "./data/global";
import type { Score } from "./data/models";
import { useLiveLatestScore } from "./data/personal";
import { PreviousBests } from "./PreviousBest";

function pbDiff(s: Score) {
  if (!s.personal_best_previous) return null;
  if (s.score === s.personal_best) {
    return `(+${(s.score - s.personal_best_previous).toLocaleString()})`;
  }
  return `(${(s.score - s.personal_best).toLocaleString()})`;
}

export function PersonalScoreDisplay(props: { username: string | null }) {
  if (!props.username) {
    return (
      <div>
        You must provide a user as a query in the url. e.g.{" "}
        <code>?user=Cathadan</code>
      </div>
    );
  }
  return <PersonalScore username={props.username} />;
}

function PersonalScore(props: { username: string }) {
  const query = useLiveLatestScore(props.username);

  const score = query.data;
  return (
    <div
      style={{
        display: "grid",
        gridAutoFlow: "column",
        gap: "1em",
      }}
    >
      <div>
        <h4>Last played</h4>
        <LastPlayedInfo query={query} />
      </div>

      <div>
        <h4>Best Before Today</h4>
        <PreviousBests
          username={props.username}
          songChartId={score?.chart._id}
        />
      </div>

      <div>
        <h4>Global Rank</h4>
        <LeaderboardSlice score={score} />
      </div>
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
        style={{ height: "3em", float: "left", marginInlineEnd: "0.5em" }}
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

function LeaderboardSlice(props: { score: Score | undefined }) {
  const lbItems = useLeaderboardNeighbors(props.score);
  if (!lbItems?.length) return null;

  return (
    <ol start={lbItems[0].atRank} style={{ paddingInlineStart: "4ch" }}>
      {lbItems.map((lbScore) => (
        <li key={lbScore._id}>
          {lbScore.gamer.username}{" "}
          <strong>{lbScore.score.toLocaleString()}</strong>
        </li>
      ))}
    </ol>
  );
}
