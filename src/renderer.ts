/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 */

import "./index.css";
import "@yaireo/tagify/dist/tagify.css";
import Tagify from "@yaireo/tagify";

console.log(
  "👋 This message is being logged by the renderer process, included via Vite",
);

const smashMe = document.getElementById("btn") as HTMLButtonElement;
const commandInput = document.getElementById(
  "command-input",
) as HTMLInputElement;
const directoryInput = document.getElementById(
  "directory-input",
) as HTMLInputElement;
const commandOutput = document.getElementById("commandOutput");
const status = document.getElementById("status");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const resetButton = document.getElementById(
  "reset-btn",
) as HTMLButtonElement;
const actionBtns = document.getElementsByClassName("action-btns");

const tagify = new Tagify(commandInput);

smashMe?.addEventListener("click", async () => {
  const directory = directoryInput.value.trim();

  const commands = commandInput.value
    ? JSON.parse(commandInput.value)
        .map((item: any) => item.value.trim())
        .filter(Boolean)
    : [];

  if (!directory) {
    setStatus("failed", "Kannu ilvā? Modalu folder āyke māḍu! 👆");
    return;
  }

  if (commands.length === 0) {
    setStatus("failed", "Ayyo… ondu command ādru koḍu! 🤷‍♂️");
    return;
  }

  smashMe.disabled = true;
  commandOutput!.textContent = "";

  setStatus("running", "swalpa wait maadi..😁");
  setTimeout(async () => {
    try {
      const result = await window.electronAPI.runCommand(commands, directory);

      setStatus(result.success ? "success" : "failed", "Mugītu bro, next ēnu? 😏");
    } catch {
      setStatus(
        "failed",
        "something went wrong bruh.. but no idea what went wrong",
      );
    } finally {
      smashMe.disabled = false;
    }
  }, 2000);
});

// open folder
document
  .getElementById("directory-input")
  ?.addEventListener("click", async () => {
    const response = await window.electronAPI.openFolder();
    console.log(response);
    directoryInput.value = response;
  });

window.electronAPI.onCommandOutput((data: any) => {
  if (!commandOutput) return;

  commandOutput.textContent += data.text;
});

function setStatus(
  type: "ready" | "running" | "success" | "failed",
  customMsg?: string,
) {
  if (!status || !statusDot || !statusText) return;

  // Reset
  status.className =
    "inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-2 text-sm font-medium text-slate-400 shadow-sm";

  statusDot.className = "h-2 w-2 rounded-full";

  switch (type) {
    case "ready":
      status.classList.add("border-green-200", "bg-green-50", "text-green-600");

      statusDot.classList.add("bg-green-400");
      statusText.textContent = customMsg || "Ready";
      break;

    case "running":
      status.classList.add("border-blue-200", "bg-blue-50", "text-blue-700");

      statusDot.classList.add("bg-blue-500", "animate-pulse");

      statusText.textContent = customMsg || "Running...";
      break;

    case "success":
      status.classList.add(
        "border-emerald-200",
        "bg-emerald-50",
        "text-emerald-700",
      );

      statusDot.classList.add("bg-emerald-500");

      statusText.textContent = customMsg || "Completed ✓";
      break;

    case "failed":
      status.classList.add("border-red-200", "bg-red-50", "text-red-700");

      statusDot.classList.add("bg-red-500");

      statusText.textContent = customMsg || "Failed ✕";
      break;
  }
}

setStatus("ready", "All ready bro.");

resetButton?.addEventListener("click", () => {
  // Clear commands
  commandInput.value = "";

  // Clear directory
  directoryInput.value = "";

  // Clear output
  if (commandOutput) {
    commandOutput.textContent = "";
    tagify.removeAllTags();
  }

  // Reset status
  setStatus("ready");
});


actionBtns?.addEventListener("click", () => {
  alert("That is just prop.. dont expect it will work 🤨")
})