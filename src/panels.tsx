import type { FC } from "react";
import type { PanelProps } from "./panelComponents";
import {
  BestBeforeTodayPanel,
  LastPlayedPanel,
  SongRankingsPanel,
  WeeklyLeaderboardPanel,
} from "./panelComponents";

/** A panel that can be shown, hidden, and reordered in the widget. */
export interface PanelDef {
  /** stable key used in the `panels` url param */
  key: string;
  /** human label shown in the landing-page configurator */
  label: string;
  Component: FC<PanelProps>;
}

/** Every panel, in the default order used by `/pb` and an all-panels `/widget`. */
export const PANELS: Array<PanelDef> = [
  { key: "last", label: "Last played", Component: LastPlayedPanel },
  { key: "best", label: "Best Before Today", Component: BestBeforeTodayPanel },
  { key: "rank", label: "Song Rankings", Component: SongRankingsPanel },
  {
    key: "weekly",
    label: "Weekly Leaderboard",
    Component: WeeklyLeaderboardPanel,
  },
];

export const PANEL_MAP = new Map(PANELS.map((panel) => [panel.key, panel]));

export const DEFAULT_ORDER = PANELS.map((panel) => panel.key);
