import { useBestScores } from "./data/personal";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

// const relativeFormatter = new Intl.RelativeTimeFormat(undefined, {
//   style: "short"
// })

export function PreviousBests(props: {
  username: string;
  songChartId: number;
}) {
  const query = useBestScores(props.username, props.songChartId, 3);
  if (query.isPending || query.error) return null;
  return (
    <div>
      Best plays before today:
      <ul>
        {query.data.map((score) => {
          const d = new Date(score.created_at);
          return (
            <li>
              {score.score.toLocaleString()} {dateFormatter.format(d)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
