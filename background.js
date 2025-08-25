// Register context menus (when extension is installed/updated)
chrome.runtime.onInstalled.addListener(async () => {
  try {
    // Optional: clear existing menus first with await chrome.contextMenus.removeAll();
    const items = [
      { id: "ai-translate", title: 'AI: Translate "%s"' },
      { id: "ai-summarize", title: 'AI: Summarize "%s"' },
      { id: "ai-explain",   title: 'AI: Explain "%s"' }
    ];
    items.forEach(i => chrome.contextMenus.create({ ...i, contexts: ["selection"] }));
    console.log("[AI Web Assistant] context menus registered.");
  } catch (e) {
    console.error("[ctxmenu] register error:", e);
  }
});

// Handle right-click menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    if (!info.selectionText || !tab?.id) return;

    const action = String(info.menuItemId).replace("ai-", ""); // translate/summarize/explain
    const text = info.selectionText;
    console.log("[AI] action =", action, "len =", text.length);

    // Load settings (API Key / Model)
    const { openaiKey, model } = await chrome.storage.sync.get(["openaiKey", "model"]);
    if (!openaiKey) {
      return notify(tab.id, action, text, "⚠️ Missing OpenAI API Key. Set it in the extension popup.");
    }

    const prompt = buildPrompt(action, text);
    const finalModel = model || "gpt-4o-mini";

    let result = "";
    try {
      result = await callOpenAI(openaiKey, finalModel, prompt);
    } catch (apiErr) {
      console.error("[OpenAI] call error:", apiErr);
      result = "⚠️ OpenAI Error: " + (apiErr?.message || apiErr);
    }

    // Send result back to content.js to render on the page
    await safeSendMessage(tab.id, {
      type: "AI_RESPONSE",
      payload: { action, input: text, output: result }
    });

  } catch (e) {
    console.error("[onClicked] unexpected error:", e);
    if (tab?.id) {
      await safeSendMessage(tab.id, {
        type: "AI_RESPONSE",
        payload: { action: "error", input: info.selectionText || "", output: "⚠️ Error: " + (e?.message || e) }
      });
    }
  }
});

// Prompt builder
function buildPrompt(action, text) {
  if (action === "translate") {
    return `Translate the following text into natural, fluent Chinese and then into concise English:\n\n${text}\n\nFormat:\n- Chinese:\n- English:`;
  }
  if (action === "summarize") {
    return `Summarize the following text in 3 bullet points, capturing key facts and implications:\n\n${text}`;
  }
  // explain
  return `Explain the following text like a helpful tutor. Define any jargon and give a concise, clear explanation:\n\n${text}`;
}

// OpenAI API call
async function callOpenAI(apiKey, model, prompt) {
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model,
    messages: [
      { role: "system", content: "You are a concise, helpful assistant." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`OpenAI API error ${resp.status}: ${t}`);
  }
  const data = await resp.json();
  const out = data?.choices?.[0]?.message?.content?.trim();
  return out || "(No response)";
}

// Unified notify function (always sends action/input/output for consistency with content.js)
function notify(tabId, action, input, message) {
  return safeSendMessage(tabId, {
    type: "AI_RESPONSE",
    payload: { action, input, output: message }
  });
}

// Safe sendMessage wrapper (avoids crashing if content.js not injected or unsupported pages like chrome://, PDF, Web Store)
async function safeSendMessage(tabId, msg) {
  try {
    await chrome.tabs.sendMessage(tabId, msg);
  } catch (e) {
    console.warn("[sendMessage] failed on tab", tabId, e?.message || e);
  }
}
