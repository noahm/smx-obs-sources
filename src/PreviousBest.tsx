import { useBestScores } from "./data/personal";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

// const relativeFormatter = new Intl.RelativeTimeFormat(undefined, {
//   style: "short"
// })

export function PreviousBests(props: {
  username: string;
  songChartId: number | undefined;
}) {
  const query = useBestScores(props.username, props.songChartId, 3);
  if (query.error) return null;
  if (query.isPending) return "loading...";
  if (!query.data.length) return null;
  return (
    <ul>
      {query.data.map((score) => {
        const d = new Date(score.created_at);
        return (
          <li key={score._id}>
            <strong>{score.score.toLocaleString()}</strong>{" "}
            {dateFormatter.format(d)}
          </li>
        );
      })}
    </ul>
  );
}
