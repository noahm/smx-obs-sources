import { useLiveLatestScore } from "./data/personal";
import { PANEL_MAP } from "./panels";
import styles from "./pb.module.css";

const OG_PANELS = ["last", "best", "rank"];

export function PersonalScoreDisplay(props: {
  username: string | null;
  /** ordered panel keys to render; omit for the default full set */
  panels?: Array<string>;
}) {
  if (!props.username) {
    return (
      <div>
        You must provide a user as a query in the url. e.g.{" "}
        <code>?user=Cathadan</code>
      </div>
    );
  }
  return (
    <PersonalScore
      username={props.username}
      panels={props.panels ?? OG_PANELS}
    />
  );
}

function PersonalScore(props: { username: string; panels: Array<string> }) {
  const scoreQuery = useLiveLatestScore(props.username);

  return (
    <div className={styles.pbContainer}>
      {props.panels.map((key) => {
        const panel = PANEL_MAP.get(key);
        if (!panel) return null;
        return (
          <panel.Component
            key={key}
            username={props.username}
            scoreQuery={scoreQuery}
          />
        );
      })}
    </div>
  );
}
