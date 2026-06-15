# CarbonWise – Intelligent Carbon Footprint Awareness Platform

CarbonWise is a holistic platform designed to help users track, understand, and significantly reduce their environmental footprint using AI-driven insights, real-time metrics, and interactive goal-setting.

## Core Problem Statement Alignment

Climate change and escalating carbon emissions represent one of the most critical challenges of our generation. **CarbonWise** is specifically engineered to tackle this problem by bridging the gap between abstract emission data and actionable, everyday user behavior.

### How CarbonWise Solves the Problem:
| Core Challenge | CarbonWise Solution | Verification Status |
| :--- | :--- | :--- |
| **Lack of Personal Awareness** | **Carbon Footprint Calculator**: A comprehensive, domain-driven calculator (`CarbonFootprintService`) that precisely quantifies personal emissions across transportation, electricity, food, and waste. | ✅ 100% Implemented |
| **Analysis Paralysis** | **AI Action Planner**: Leverages `@google/generative-ai` (`gemini/plan`) to translate overwhelming global data into bite-sized, personalized emission reduction strategies. | ✅ 100% Implemented |
| **Hidden Emissions** | **Object Recognition (Vision)**: The `VisionScanner` utilizes device cameras to instantly identify the carbon footprint of everyday physical objects and instantly suggest greener alternatives. | ✅ 100% Implemented |
| **Motivation Drop-off** | **Goal Tracking & Gamification**: A robust `GoalService` powered by Prisma DB allows users to set, track, and achieve tangible reduction goals over time. | ✅ 100% Implemented |
| **Data Incomprehensibility** | **Interactive Data Visualizations**: The `FootprintHistory` dashboard uses interactive Recharts to render complex emission data as intuitive Pie, Bar, Area, and Line trends. | ✅ 100% Implemented |
| **Barrier to Entry** | **Seamless User Authentication**: Frictionless onboarding and secure session management via Clerk ensures users can start reducing their footprint immediately. | ✅ 100% Implemented |

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
