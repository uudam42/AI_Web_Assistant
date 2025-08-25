let tooltipEl;

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "AI_RESPONSE") {
    const { output } = msg.payload || { output: "" };
    showTooltip(output);
  }
});

// Render tooltip near the current text selection; fall back to bottom-right
function showTooltip(text) {
  removeTooltip();

  tooltipEl = document.createElement("div");
  tooltipEl.className = "ai-tooltip";
  tooltipEl.innerText = text && String(text).trim() ? text : "(No content)";

  // Try to position near the selection; otherwise use bottom-right as a fallback
  const range = getSelectionRange();
  if (range) {
    const rect = range.getBoundingClientRect();
    tooltipEl.style.top = `${window.scrollY + rect.bottom + 8}px`;
    tooltipEl.style.left = `${window.scrollX + rect.left}px`;
  } else {
    tooltipEl.style.bottom = "20px";
    tooltipEl.style.right = "20px";
  }

  // Close button (×)
  const closeBtn = document.createElement("button");
  closeBtn.className = "ai-tooltip-close";
  closeBtn.innerText = "×";
  closeBtn.onclick = removeTooltip;
  tooltipEl.appendChild(closeBtn);

  document.body.appendChild(tooltipEl);

  // Allow closing with Escape key
  document.addEventListener("keydown", onEscToClose, { once: true });
}

// Remove tooltip if present
function removeTooltip() {
  if (tooltipEl && tooltipEl.parentNode) {
    tooltipEl.parentNode.removeChild(tooltipEl);
    tooltipEl = null;
  }
  document.removeEventListener("keydown", onEscToClose, { once: true });
}

// Get the current selection range (or null if none)
function getSelectionRange() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  return sel.getRangeAt(0);
}

// Close handler for Escape key
function onEscToClose(e) {
  if (e.key === "Escape") removeTooltip();
}
