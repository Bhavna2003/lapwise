# LapWise – AI Laptop Advisor 💻🤖

> **Finding the absolute best laptop for your budget and specific workload, powered by open-source AI and transparent hardware benchmarks.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Groq & Llama 3](https://img.shields.io/badge/AI-Llama%203.3%20%2F%20Gemini-orange?logo=meta)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Submission for the **[Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)**.*

---

## 🌟 The Story & Problem

Buying a laptop today is notoriously frustrating:
- Tech storefronts hide actual hardware specs behind confusing marketing jargon.
- Retailers fluctuate prices daily across Amazon, Best Buy, Micro Center, and B&H Photo.
- Friends and students get stuck with laptops that throttle under load or die within 3 hours on campus.

**LapWise** was built to solve this. It combines a structured laptop hardware database with **honest, open-source AI reasoning** (Llama 3 / Gemini) to evaluate specs, compare live retailer deals, and tell you *exactly* why a laptop fits your budget and use case.

---

## ✨ Features

- 🎯 **Tailored Requirement Matching:** Input your budget range, target workflows (Coding, Gaming, Video Editing, Everyday Student, Travel), and priorities (Battery Life, Display, Weight, Storage).
- 🏷️ **Multi-Retailer Price Matrix:** Cross-references pricing and availability across **Best Buy, Amazon, Micro Center, and B&H Photo**, highlighting actual discounts against MSRP.
- ⚡ **Dual AI & Algorithmic Engine:**
  - **Algorithmic Filter:** Filters laptops based on CPU/GPU benchmark scores, memory requirements, and portability ratings.
  - **Open AI Reasoning (Groq Llama 3 / Google Gemini):** Delivers clear, plain-language summaries and specific bullet-point reasons citing concrete specs.
- 🛡️ **Graceful Fallback:** If no API key is provided, LapWise automatically uses its built-in heuristic scoring engine without crashing.
- 🌓 **Modern UI:** Built with Next.js, Tailwind CSS, Shadcn UI, dark mode support, and interactive comparison views.

---

## 🏗️ Architecture

```
User Input (Budget, Workloads, Preferences)
                  │
                  ▼
          Next.js App Router
         (/api/recommend POST)
                  │
                  ▼
     Candidate Filtering & Benchmark Scoring
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
  Groq API              Google Gemini
(Llama 3.3 70B)        (Gemini 2.5 Flash)
      │                       │
      └───────────┬───────────┘
                  ▼
       Validated JSON Response (Zod)
                  │
                  ▼
    Frontend Visual Cards & Comparison Matrix
```

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have **Node.js 18+** installed on your system.
- If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/) or install via Windows terminal:
  ```powershell
  winget install OpenJS.NodeJS.LTS
  ```

### 2. Clone the Repository

```bash
git clone https://github.com/Bhavna2003/lapwise.git
cd lapwise
```

### 3. Install Dependencies

You can use `npm` or `pnpm`:

```bash
npm install
# or
pnpm install
```

### 4. Configure Your AI API Key (Optional but Recommended)

LapWise works right out of the box with heuristic scoring! To enable full AI reasoning:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and add your free key:
   - **Groq (Open-Source Llama 3):** Get a free key at [console.groq.com](https://console.groq.com/keys)
   - **Google Gemini:** Get a free key at [aistudio.google.com](https://aistudio.google.com/app/apikey)

```env
GROQ_API_KEY=gsk_your_key_here
# or
GEMINI_API_KEY=AIzaSy_your_key_here
```

### 5. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application!

---

## 📁 Project Structure

```
lapwise/
├── app/
│   ├── api/recommend/route.ts   # AI Backend Recommendation Engine (Groq / Gemini)
│   ├── globals.css              # Tailwind styles
│   ├── layout.tsx               # Root layout & providers
│   └── page.tsx                 # Main application view
├── components/
│   ├── laptopwise/              # Custom LapWise UI components
│   │   ├── advisor.tsx          # Main interactive container
│   │   ├── requirement-builder.tsx # Form for budget & use-cases
│   │   ├── top-pick-card.tsx    # Recommendation showcase card
│   │   ├── comparison-section.tsx # Compare all candidate laptops
│   │   └── site-header.tsx      # Header & theme toggle
│   └── ui/                      # Reusable Shadcn UI primitives
├── lib/
│   ├── laptops.ts               # Laptops specifications & retailer prices database
│   ├── recommend.ts             # Heuristic scoring & ranking algorithms
│   └── utils.ts                 # Helper utilities
├── .env.example                 # Environment configuration template
└── package.json
```

---

## 🤝 Contributing

Contributions are very welcome! Feel free to:
1. Open an issue for bugs or suggestions.
2. Submit a PR adding new laptop models to `lib/laptops.ts`.
3. Improve prompts, add retailer parsers, or enhance benchmark formulas.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
