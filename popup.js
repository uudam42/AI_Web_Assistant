// Grab DOM elements
const keyEl = document.getElementById("key");
const modelEl = document.getElementById("model");
const statusEl = document.getElementById("status");
const saveBtn = document.getElementById("save");

// Load saved config when popup is opened
chrome.storage.sync.get(["openaiKey", "model"], ({ openaiKey, model }) => {
  if (openaiKey) keyEl.value = openaiKey;
  if (model) modelEl.value = model;
});

// Save new config on button click
saveBtn.addEventListener("click", async () => {
  await chrome.storage.sync.set({
    openaiKey: keyEl.value.trim(),
    model: modelEl.value
  });

  // Show temporary status message
  statusEl.textContent = "✅ Saved. You're good to go.";
  setTimeout(() => {
    statusEl.textContent = "";
  }, 1600);
});
