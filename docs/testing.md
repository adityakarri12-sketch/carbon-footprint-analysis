# Testing Strategy

This document outlines the testing strategy for the CarbonWise application.

## Unit Tests

-   **Location**: `tests/unit`
-   **Framework**: Jest
-   **Description**: Unit tests focus on testing individual functions and modules in isolation.
-   **Examples**:
    -   Carbon footprint calculation logic.
    -   Utility functions.
    -   AI service functions for interacting with the Gemini API.

## Component Tests

-   **Location**: `tests/component`
-   **Framework**: React Testing Library with Jest
-   **Description**: Component tests focus on testing individual React components.
-   **Examples**:
    -   Rendering of UI components.
    -   User interactions with forms and buttons.

## Integration Tests

-   **Location**: `tests/integration`
-   **Framework**: Jest
-   **Description**: Integration tests focus on testing the interaction between different parts of the application.
-   **Examples**:
    -   API route handlers.
    -   Database operations using Prisma.
    -   Server Actions.

## End-to-End (E2E) Tests

-   **Location**: `tests/e2e`
-   **Framework**: Playwright
-   **Description**: E2E tests simulate real user scenarios by testing the entire application from the frontend to the backend.
-   **Examples**:
    -   A user completing the carbon footprint calculator form and seeing the results.
    -   A user logging in, setting a goal, and marking it as complete.

## Test Coverage

The goal is to achieve a test coverage of at least 90%.
