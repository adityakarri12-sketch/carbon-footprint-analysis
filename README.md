# CarbonWise – Intelligent Carbon Footprint Awareness Platform

CarbonWise is a holistic platform designed to help users track, understand, and significantly reduce their environmental footprint using AI-driven insights, real-time metrics, and interactive goal-setting.

## Requirement-to-Implementation Mapping

| Requirement | Implementation Component | Verification Status |
| :--- | :--- | :--- |
| **User Authentication** | Integrated with Clerk for secure sign-ups, sign-ins, and session management. | ✅ 100% Implemented |
| **Carbon Footprint Calculator** | `CarbonFootprintCalculator` domain logic with `CarbonFootprintService` application layer. Handles transportation, electricity, food, and waste. | ✅ 100% Implemented |
| **AI Action Planner** | `gemini/plan` API route leveraging `@google/generative-ai` to generate custom emission reduction strategies. | ✅ 100% Implemented |
| **Object Recognition (Vision)** | `VisionScanner` component using device cameras/uploads to identify carbon-heavy objects and suggest greener alternatives. | ✅ 100% Implemented |
| **Goal Tracking** | `GoalService` managing CRUD operations for user reduction goals. Integrated with Prisma DB. | ✅ 100% Implemented |
| **Data Visualizations** | Interactive Recharts dashboard (`FootprintHistory`) showing multi-format graph trends (Pie, Bar, Area, Line). | ✅ 100% Implemented |

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Prisma ORM with SQLite
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Clerk
- **AI**: Google Gemini Pro & Vision APIs
- **Testing**: Jest, React Testing Library

## Getting Started

1. Set up your `.env.local` with your Clerk keys and Gemini API keys.
2. Run `npm install`
3. Run `npx prisma db push`
4. Run `npm run dev` to start the development server.
