# ⚡ QuickPulse AI

**QuickPulse AI** is a React Native mobile application that delivers real-time news headlines with AI-generated short summaries. Powered by GNews and DeepSeek via OpenRouter, it keeps users informed with concise, categorized news on the go.

---

## 🚀 Features

- 📰 Fetches trending news from the **GNews API**
- 🤖 Summarizes articles using **DeepSeek LLM via OpenRouter**
- 🔍 In-app **search functionality**
- 🗂️ **Category-based filters** (e.g., Sports, Business, Technology)
- 📄 Clean modal view for **AI Quick Read**
- 🌐 **Open full article** in the browser
- 🔁 **Pull-to-refresh** for live updates

---

## 🛠️ Tech Stack

- **React Native (CLI + TypeScript)**
- **GNews API** – for news data
- **OpenRouter + DeepSeek LLM** – for summarization
- **React Navigation** – screen navigation
- **Gesture Handler & Modal** – for interactive UI

---

## 🔧 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/quickpulse-ai.git
   cd quickpulse-ai
2. Install dependecies:
   ```bash
   npm install
3. Configure Environment Variables:
   Create a .env file in the root:
   ```bash
   GNEWS_API_KEY=your_gnews_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
4. Run the App:
   ```bash
   npx react-native run-android
   # or for iOS
   npx react-native run-ios

   
