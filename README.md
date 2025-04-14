# StudyBuddy Flash Cards

A modern, interactive flashcard application for effective studying. Create AI-generated flashcards on any topic or build your own custom sets. Study, save, and organize your cards for efficient learning.

## Tech Stack

- **Frontend**:

  - [Next.js 14](https://nextjs.org/) with App Router
  - [TypeScript](https://www.typescriptlang.org/) for type safety
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [shadcn/ui](https://ui.shadcn.com/) for UI components
  - [Framer Motion](https://www.framer.com/motion/) for animations

- **Backend**:

  - [Supabase](https://supabase.io/) for database and authentication
  - Server components for data fetching
  - API routes for AI integration

- **AI Integration**:

  - OpenAI API for generating flashcards
  - Fallback to mock data when API calls are unsuccessful

- **Additional Libraries**:
  - [date-fns](https://date-fns.org/) for date formatting
  - [Lucide Icons](https://lucide.dev/) for UI icons

## Features

### Core Functionality

- **AI-Generated Flashcards**: Generate study cards on any topic with a single click
- **Manual Card Creation**: Build your own custom flashcards
- **Topic Organization**: Organize cards by topics for better study management
- **Study Mode**: Interactive study interface with flashcard flipping
- **Auto-Play**: Hands-free studying with adjustable speed
- **Hint System**: Get helpful hints before revealing answers

### User Experience

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Switch between themes for comfortable studying
- **Progress Tracking**: Track your progress through card sets
- **Card Management**: Edit, delete, and organize your flashcards

### Data Management

- **Persistent Storage**: Save your cards to Supabase for access across devices
- **Card Sets**: Create multiple sets for different subjects
- **Import/Export**: Share your card sets with others (coming soon)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/flashcards.git
cd flashcards
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

> **Note:** The application will use the OpenAI API for generating flashcards when an API key is provided. If the API key is invalid or the API call fails, the application will automatically fall back to using pre-defined mock data sets, ensuring you can still test and use the application without an OpenAI API key.

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

Create a `card_sets` table in Supabase with the following schema:

```sql
CREATE TABLE public.card_sets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    topic TEXT NOT NULL,
    cards JSONB NOT NULL,
    is_ai_generated BOOLEAN NOT NULL DEFAULT false
);
```

## Project Structure

```
/app                  # Next.js App Router pages
  /api                # API routes for AI generation
  /page.tsx           # Main application page
/components           # React components
  /ui                 # UI components (buttons, cards, etc.)
  /generation-view    # Flashcard generation interface
  /study-view         # Study mode interface
  /card-list          # Card listing component
  /card-set-list      # Card set management
/hooks                # Custom React hooks
  /useFlashcards      # Main flashcard management hook
  /useSupabaseFlashcards # Supabase integration hook
/lib                  # Utility functions and libraries
  /supabase           # Supabase client
/types                # TypeScript type definitions
/public               # Static assets
```

## License

MIT

---

Built with ❤️ for effective studying
