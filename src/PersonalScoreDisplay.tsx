import type { Score } from "./data/models";
import { useLiveLatestScore } from "./data/personal";
import { PreviousBests } from "./PreviousBest";

function pbDiff(s: Score) {
  if (!s.personal_best_previous) return null;
  if (s.score === s.personal_best) {
    return `(+${(s.score - s.personal_best_previous).toLocaleString()})`;
  }
  return `(${(s.personal_best - s.score).toLocaleString()})`;
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
  const score = useLiveLatestScore(props.username);

  if (!score) {
    return <div>Nothing played yet.</div>;
  }
  return (
    <div>
      Last play:
      <br />
      <img
        style={{ height: "2lh", float: "left", marginInlineEnd: "0.5em" }}
        src={`https://data.stepmaniax.com/${score.song.cover_thumb}`}
      />
      {score.song.title}{" "}
      <em>
        {score.chart.difficulty_display} {score.chart.difficulty}
      </em>
      <br />{" "}
      <strong>
        {score.score.toLocaleString()} {pbDiff(score)}
      </strong>
      <PreviousBests username={props.username} songChartId={score.chart._id} />
    </div>
  );
}
