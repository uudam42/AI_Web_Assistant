# AI Web Assistant

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome\&logoColor=white)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

AI Web Assistant is a lightweight **Chrome Extension** that allows users to **Translate, Summarize, and Explain** any selected text on the web using the **OpenAI API**.
It’s designed for students, researchers, and curious readers who want instant insights without switching tabs.

---

## Table of Contents

* [Features](#features)
* [Screenshots](#screenshots)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Directory Structure](#directory-structure)
* [Usage](#usage)
* [Demo](#demo)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* Translate: Convert text into natural **Chinese + English**.
* Summarize: Reduce long passages into **3 bullet points**.
* Explain: Break down technical/academic text into plain language.
* Tooltip UI: Results appear inline on the page in a styled tooltip.
* User API Key: Each user provides their own key (no shared costs).

---

## Screenshots

### Popup (API Key & Model setup)

![Popup UI](ui.jpg)

### Right-click Menu

![Context Menu](summary.jpg)

### Translate Tooltip

![Translate Example](translate.jpg)

### Summarize Tooltip

![Summarize Example](summary.jpg)

---

## Prerequisites

* Google Chrome (v110 or later)
* An [OpenAI API Key](https://platform.openai.com/account/api-keys) with credits
  *(Each user must provide and use their **own** OpenAI API Key in the popup. The extension does not include or share keys.)*

---

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/ai-web-assistant.git
   ```
2. Open **Chrome** → go to `chrome://extensions/`
3. Enable **Developer Mode** (top right).
4. Click **Load unpacked** → select this project folder.
5. Pin the extension icon to your toolbar.

---

## Directory Structure

```
ai_web_assistant/
├── manifest.json        # Chrome extension manifest (MV3)
├── background.js        # Service worker (context menus + API calls)
├── content.js           # Injected script to render tooltips
├── popup.html           # Popup UI for key/model setup
├── popup.js             # Popup logic (save/read storage)
├── styles.css           # Tooltip styling
└── README.md
```

---

## Usage

1. Click the extension icon → enter your **OpenAI API Key** (`sk-...`) and select a model.
2. Highlight text on any webpage.
3. Right-click → choose one of:

   * `AI: Translate`
   * `AI: Summarize`
   * `AI: Explain`
4. A tooltip will appear on the page showing the result.

---

## Demo

**Right-click on text → AI Web Assistant → Tooltip result appears instantly.**

Example Workflow:

```text
1. Highlight a paragraph from a news article.
2. Right-click → AI: Summarize
3. Tooltip shows 3 bullet-point summary.
```

Screenshots:

* Popup → API key input and model select
* Context menu → options visible
* Tooltip → shows translated or summarized result

---

## Contributing

Contributions are welcome! Possible ideas:

* Add more models or custom prompts.
* Improve tooltip UI (copy button, dark/light mode).
* Add usage statistics (tokens & cost estimate).

Open issues and pull requests are appreciated.

---

## License

This project is licensed under the [MIT License](LICENSE).
