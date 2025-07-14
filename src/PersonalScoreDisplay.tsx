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

  if (!query.data) {
    return <div>Nothing played yet.</div>;
  }
  const score = query.data;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h4>Last played</h4>
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
      </div>
      <PreviousBests username={props.username} songChartId={score.chart._id} />
      <LeaderboardSlice score={score} />
    </div>
  );
}

function LeaderboardSlice(props: { score: Score }) {
  const lbItems = useLeaderboardNeighbors(props.score);
  if (!lbItems?.length) return null;

  return (
    <div>
      <h4>Global Rank</h4>
      <ol start={lbItems[0].atRank}>
        {lbItems.map((lbScore) => (
          <li key={lbScore._id}>
            {lbScore.gamer.username}{" "}
            <strong>{lbScore.score.toLocaleString()}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}
