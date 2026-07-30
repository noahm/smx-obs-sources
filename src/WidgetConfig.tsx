import { useMemo, useState } from "react";
import { DEFAULT_ORDER, PANELS } from "./panels";

interface PanelItem {
  key: string;
  label: string;
  enabled: boolean;
}

const initialItems: Array<PanelItem> = PANELS.map((panel) => ({
  key: panel.key,
  label: panel.label,
  enabled: true,
}));

function selectionIsDefault(items: Array<PanelItem>): boolean {
  const selected = items.filter((item) => item.enabled).map((item) => item.key);
  return (
    selected.length === DEFAULT_ORDER.length &&
    selected.every((key, i) => key === DEFAULT_ORDER[i])
  );
}

function buildWidgetUrl(username: string, items: Array<PanelItem>) {
  const url = new URL("/widget", location.origin);
  url.searchParams.set("user", username || "YourUsername");
  // Omit `panels` for the full default set so the common URL stays clean.
  if (!selectionIsDefault(items)) {
    const selected = items
      .filter((item) => item.enabled)
      .map((item) => item.key);
    url.searchParams.set("panels", selected.join(","));
  }
  return url;
}

export function WidgetConfig() {
  const [username, setUsername] = useState("");
  const [items, setItems] = useState<Array<PanelItem>>(initialItems);
  const [copied, setCopied] = useState(false);

  const trimmedUser = username.trim();
  const hasUser = trimmedUser.length > 0;
  const enabledCount = items.filter((item) => item.enabled).length;

  const url = useMemo(
    () => buildWidgetUrl(trimmedUser, items),
    [trimmedUser, items],
  );
  const displayUrl = `${url.host}${url.pathname}${url.search}`;

  function toggle(key: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, enabled: !item.enabled } : item,
      ),
    );
    setCopied(false);
  }

  function move(index: number, delta: number) {
    setItems((prev) => {
      const next = prev.slice();
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setCopied(false);
  }

  async function copy() {
    if (!hasUser || enabledCount === 0) return;
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <p>Add a new Browser Source to OBS using your personal widget url:</p>

      <div className="widget-form">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="YourUsername"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={username}
          onChange={(evt) => {
            setUsername(evt.target.value);
            setCopied(false);
          }}
          data-1p-ignore="true"
          data-lpignore="true"
          data-bwignore="true"
          data-protonpass-ignore="true"
          data-form-type="other"
        />
      </div>

      <p className="panel-picker-label">Choose which panels to show, and their order:</p>
      <ul className="panel-picker">
        {items.map((item, index) => (
          <li
            key={item.key}
            className={item.enabled ? undefined : "panel-off"}
          >
            <label className="panel-toggle">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={() => toggle(item.key)}
              />
              <span>{item.label}</span>
            </label>
            <span className="panel-reorder">
              <button
                type="button"
                aria-label={`Move ${item.label} up`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                ▲
              </button>
              <button
                type="button"
                aria-label={`Move ${item.label} down`}
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                ▼
              </button>
            </span>
          </li>
        ))}
      </ul>

      {enabledCount === 0 && (
        <p className="panel-empty-hint">Select at least one panel to show.</p>
      )}

      <p className="widget-url-row">
        <code>
          <a
            href={url.toString()}
            target="_blank"
            rel="noopener"
            aria-disabled={hasUser ? undefined : "true"}
            onClick={(evt) => {
              if (!hasUser) evt.preventDefault();
            }}
          >
            {displayUrl}
          </a>
        </code>
        <button
          type="button"
          onClick={copy}
          disabled={!hasUser || enabledCount === 0}
        >
          Copy
        </button>
        {copied && <span className="copy-feedback">Copied to clipboard!</span>}
      </p>
    </>
  );
}
