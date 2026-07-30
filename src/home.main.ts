const usernameInput = document.querySelector<HTMLInputElement>("#username")!;
const urlLink = document.querySelector<HTMLAnchorElement>("#widget-url")!;
const copyButton = document.querySelector<HTMLButtonElement>("#copy-url")!;
const copyFeedback = document.querySelector<HTMLElement>("#copy-feedback")!;

function widgetUrl(username: string) {
  const url = new URL("/pb", location.origin);
  url.searchParams.set("user", username);
  return url;
}

function update() {
  const username = usernameInput.value.trim();
  const url = widgetUrl(username || "YourUsername");

  urlLink.textContent = `${url.host}${url.pathname}${url.search}`;
  urlLink.href = url.toString();
  if (username) {
    urlLink.removeAttribute("aria-disabled");
  } else {
    urlLink.setAttribute("aria-disabled", "true");
  }
  copyButton.disabled = !username;
  copyFeedback.hidden = true;
}

usernameInput.addEventListener("input", update);

urlLink.addEventListener("click", (evt) => {
  if (!usernameInput.value.trim()) evt.preventDefault();
});

copyButton.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) return;
  await navigator.clipboard.writeText(widgetUrl(username).toString());
  copyFeedback.hidden = false;
  window.setTimeout(() => {
    copyFeedback.hidden = true;
  }, 1500);
});

update();
