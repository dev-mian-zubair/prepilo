
# Prepilo

Prepilo is a modern web application designed to help users prepare for job interviews through interactive sessions, metrics tracking, and AI-powered feedback. Built with Next.js, TypeScript, Tailwind CSS, and Prisma, it offers a seamless experience for both candidates and interviewers.

## Features

- **Interview Sessions**: Simulate real job interviews with AI agents and track your performance.
- **Dashboard**: Visualize your interview metrics, scores, and progress over time.
- **Interview Generator**: Create custom interview sessions based on difficulty, topics, and templates.
- **User Authentication**: Secure login and session management.
- **Feedback & Analytics**: Get detailed feedback and analytics on your interview performance.
- **Modern UI**: Responsive and accessible design using Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: Supabase
- **State Management**: React Context API

## Project Structure

```
prisma/           # Prisma schema and migrations
public/           # Static assets
src/
  actions/        # Server actions (dashboard, interview, users)
  app/            # Next.js app directory (routing, layouts, pages)
  components/     # Reusable React components
  config/         # App configuration files
  contexts/       # React context providers
  data/           # Static data
  enums/          # TypeScript enums
  helpers/        # Utility/helper functions
  hooks/          # Custom React hooks
  lib/            # Library code (auth, prisma, utils)
  providers/      # React providers
  schema/         # TypeScript schemas
  styles/         # Global and custom styles
  supabase/       # Supabase client and middleware
  types/          # TypeScript types
```

## Getting Started

1. **Install dependencies**:
	```bash
	npm install
	```
2. **Configure environment variables**:
	- Copy `.env.example` to `.env.local` and fill in required values (database, Supabase, etc).
3. **Run database migrations**:
	```bash
	npx prisma migrate dev
	```
4. **Start the development server**:
	```bash
	npm run dev
	```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npx prisma migrate dev` — Run Prisma migrations

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
