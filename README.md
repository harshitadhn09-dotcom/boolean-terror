# Matcha

Matcha is a hackathon teammate-matching platform built for the Web Development Project 2 brief in webDev-2.md. It helps students create a profile, assess their skills, and discover compatible teammates based on technical overlap, experience level, and shared interests.

## Overview

Hackathons move fast, and finding the right teammates is usually harder than it should be. Matcha is designed to make that process easier by turning profile data into ranked match suggestions through a simple swipe-based flow.

## Features

- Profile creation with skills, experience level, interests, and links
- Skill-based teammate matching
- Swipe flow for browsing candidates
- Match and like tracking
- AI-assisted skill assessment quiz
- GitHub profile verification
- Demo auth fallback for local development

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Supabase
- Tailwind CSS 4
- Framer Motion
- Ollama for the local AI quiz flow

## Project Structure

```text
boolean-terror/
├── frontend/         # Next.js app
├── webDev-2.md       # Original project brief
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- A Supabase project

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create `frontend/.env.local` and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run the App

```bash
cd frontend
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Optional AI Quiz Setup

The skill quiz route uses a local Ollama server at `http://localhost:11434/api/chat` and currently expects the `qwen2.5-coder:7b` model.

If you want the quiz flow to work locally:

```bash
ollama pull qwen2.5-coder:7b
ollama serve
```

If Ollama is not running, the rest of the app can still be used, but the quiz feature will not work correctly.

## How Matching Works

The matching system first filters out users with incompatible hackathon type or availability. For valid candidates, the score is currently weighted like this:

- Skills: 60%
- Experience: 30%
- Interests: 10%

This makes technical compatibility the main ranking factor, with experience level as a secondary signal and interests as a lighter tie-breaker.

## API Routes

The frontend app includes these API routes:

- `POST /api/user` to create or update a user profile
- `GET /api/user?email=...` to look up a user by email
- `GET /api/match?userId=...` to fetch ranked candidates
- `POST /api/like` to record a swipe or like
- `GET /api/matches?userId=...` to fetch matches
- `POST /api/quiz` to run the skill quiz

## Supabase Requirements

This project relies on Supabase for:

- Authentication
- User profile storage
- Like and match data

The app expects at least a `users` table and a `likes` table.

## Engineering Challenges

- Designing a fair match score in a short project timeline
- Handling sparse user data and empty candidate pools
- Supporting local demo auth alongside normal auth
- Integrating an AI quiz without making the MVP too heavy

## Future Improvements

- Real-time chat between matched users
- Better explanations for why two people matched
- Smarter complementary-skill matching
- Improved profile verification and profile editing

## Deliverables

- Source code
- Setup instructions
- Working MVP focused on profile creation and matching
