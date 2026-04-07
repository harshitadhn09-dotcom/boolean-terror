# Matcha Frontend

This directory contains the Next.js frontend for Matcha.

For the full project overview, setup steps, and feature summary, see the root [README](../README.md).

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Required Environment Variables

Create `.env.local` in this folder with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Optional Quiz Dependency

The AI quiz route expects a local Ollama server with:

```bash
ollama pull qwen2.5-coder:7b
ollama serve
```
