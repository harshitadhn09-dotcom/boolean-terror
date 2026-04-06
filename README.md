# DevMatch

DevMatch is a hackathon teammate-matching app built for the Web Development Project 2 brief in [webDev-2.md](/home/anirudh/Desktop/Coding Projects/boolean-terror/webDev-2.md). The goal is simple: help students create a profile, discover relevant teammates, and find better hackathon matches based on skills, experience, and shared interests.

## Problem

Hackathon participants often struggle to find teammates quickly, especially when time is limited and people have very different technical backgrounds. DevMatch focuses on solving that by making profile setup lightweight and surfacing compatible teammates through a matching flow.

## MVP

- Student profile setup
- Skill and interest selection
- Matching based on profile compatibility
- Swipe-style browsing of candidates
- Match persistence through likes

## Advanced Features

- AI-assisted skill assessment quiz
- GitHub profile verification
- Demo auth fallback for local/demo use

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Supabase
- Tailwind CSS 4
- Framer Motion
- Ollama for the local AI quiz flow

## How It Works

Users create a profile with their basics, skills, experience level, interests, and links. After signup, DevMatch stores the profile in Supabase and uses a compatibility score to rank other users.

The current matching flow gives the highest weight to shared skills, then experience level, with interests acting as a smaller tie-breaker. Users can then swipe through recommended profiles and like candidates they want to connect with.

## Project Structure

```text
.
├── frontend/               # Next.js application
│   ├── app/                # App Router pages and API routes
│   ├── components/         # UI components
│   ├── lib/                # Matching, storage, auth helpers, Supabase client
│   ├── types/              # Shared TypeScript types
│   └── package.json
└── webDev-2.md             # Original project brief
```

## Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment variables

Create `frontend/.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the app

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`.

## Optional Local AI Quiz Setup

The skill assessment quiz calls a local Ollama server at `http://localhost:11434/api/chat` and expects the `qwen2.5-coder:7b` model.

If you want the quiz flow to work locally:

```bash
ollama pull qwen2.5-coder:7b
ollama serve
```

If Ollama is not running, the rest of the app can still be developed independently, but the quiz endpoint will not respond correctly.

## Supabase Notes

This project expects Supabase to provide:

- Authentication for signup/login
- A `users` table for profile data
- A `likes` table for swipe decisions and mutual-match style flows

At minimum, user records currently include fields such as:

- `id`
- `name`
- `university`
- `skills`
- `level`
- `interests`
- `linkedin`
- `email`
- `skill_ratings`
- `github_verified`
- `hackathon_type`
- `availability`

## API Overview

The app currently exposes these Next.js API routes inside `frontend/app/api`:

- `POST /api/user` to create or update a user profile
- `GET /api/user?email=...` to look up a user ID by email
- `GET /api/match?userId=...` to fetch ranked match candidates
- `POST /api/like` to record a like
- `GET /api/matches?userId=...` to fetch matched users
- `POST /api/quiz` to run the AI skill assessment

## Engineering Challenges

- Designing a matching score that feels fair in a short hackathon build
- Handling sparse user data and empty match pools
- Blending real auth with a lightweight demo fallback
- Making the quiz flow useful without overcomplicating the MVP

## Edge Cases Considered

- Users with no skills or no interests selected
- Mismatched hackathon type or availability
- Empty candidate pools
- Broken or unavailable local AI quiz service
- Local demo login fallback when auth fails

## Evaluation Criteria Alignment

This project is designed to map directly to the brief:

- Innovation: skill-based teammate discovery with quiz-assisted profiling
- System Design: clear separation between UI, API routes, storage, and matching logic
- Code Quality: typed frontend and API flow with reusable helpers
- Completeness: profile creation, matching, and swipe flow are implemented
- UX: focused onboarding and a lightweight match discovery experience

## Deliverables

- Source code in this repository
- Setup instructions in this README

## Future Improvements

- Real-time chat between matched users
- Better explainability for match scores
- More robust ranking using complementary skills and team balance
- Profile editing and richer verification signals

