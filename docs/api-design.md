# API Design

## Authentication

-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Log in a user and create a session.
-   `POST /api/auth/logout`: Log out a user and destroy the session.

## Carbon Footprint

-   `POST /api/footprint`: Calculate and save a new carbon footprint record.
-   `GET /api/footprint`: Get all footprint records for the logged-in user.
-   `GET /api/footprint/:id`: Get a specific footprint record.

## AI Advisor

-   `POST /api/advisor/recommendations`: Get AI-powered sustainability recommendations from Gemini.

## Goals

-   `POST /api/goals`: Create a new goal.
-   `GET /api/goals`: Get all goals for the logged-in user.
-   `PUT /api/goals/:id`: Update a goal (e.g., mark as complete).
-   `DELETE /api/goals/:id`: Delete a goal.
