import "./main.css";
import { actions } from "./actions";

for (const action of actions.keys()) {
  document.getElementById(action)?.addEventListener("click", async (_event) => {
    await chrome.runtime.sendMessage({ action: action });
  });
}
