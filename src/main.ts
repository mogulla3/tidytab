import "./main.css";
import { actions } from "./actions";

for (const action of actions.keys()) {
  document.getElementById(action)?.addEventListener("click", async (_event) => {
    await chrome.runtime.sendMessage({ action: action });
  });
}

document.getElementById("go-to-options")?.addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  }
});
