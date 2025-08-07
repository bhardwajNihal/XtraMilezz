# XtraMilezz – AI Career Coach
    XtraMilezz is an AI-powered career coach designed to help job seekers and learners stay ahead in the ever-evolving tech landscape. It combines real-time industry insights, personalized guidance, and weekly updates to empower users with clarity, preparation, and strategy for their career journey.

# Features
    🔍 Personalized Career Coaching powered by AI (OpenAI GPT-4)

    🗓️ Weekly Industry Insights via Cron Jobs using Inngest

    🧠 Smart Prompts for career advice, resume reviews, role-based prep, etc.

    📧 Google Auth + Email Auth using NextAuth.js

    🗂️ User Dashboard with saved insights and recommendations

    📊 Future Additions: Google Calendar integration for interview prep planning

# Tech Stack

Frontend	    Next.js 15 App Router, TypeScript, TailwindCSS, ShadCN UI
Backend      	Next.js API Routes, Edge Functions, REST
Authentication	NextAuth.js (Google + github providers)
Database	    PostgreSQL via Prisma ORM
AI Integration	gemini 2.5 flash
Scheduling	    Inngest for cron jobs (weekly insights fetcher)
Styling	        TailwindCSS, ShadCN
