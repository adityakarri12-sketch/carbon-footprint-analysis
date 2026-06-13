# Security Documentation

This document outlines the security measures implemented in the CarbonWise application.

## Authentication

-   **Password Hashing**: Passwords are hashed using Argon2, a strong, modern, and recommended hashing algorithm.
-   **Secure Session Handling**: Sessions are managed using secure, HTTP-only cookies to prevent XSS attacks from accessing session tokens.

## Authorization

-   **Route Protection**: API routes and server-side rendered pages that require authentication are protected. Unauthorized access attempts are redirected to the login page.

## Input Validation

-   **Schema Validation**: All incoming data from forms and API requests is validated on the server-side using Zod to ensure type safety and prevent malformed data from being processed.
-   **Input Sanitization**: While Zod provides strong validation, additional sanitization is performed where necessary to prevent XSS attacks.

## CSRF Protection

-   **Server Actions**: Next.js Server Actions have built-in CSRF protection.
-   **API Routes**: For traditional API routes, a double-submit cookie or a similar CSRF token-based strategy will be implemented if needed.

## Other Security Measures

-   **Secure Headers**: The application uses security headers (e.g., `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`) to protect against common web vulnerabilities.
-   **Rate Limiting**: Rate limiting is applied to sensitive endpoints like login and registration to prevent brute-force attacks.
-   **Environment Variables**: Sensitive information like API keys and database credentials are stored in environment variables and are not exposed to the client-side. Environment variables are also validated on application startup.
-   **SQL Injection Prevention**: The use of Prisma ORM prevents SQL injection attacks by parameterizing queries.
-   **Error Handling**: Generic error messages are shown to the user, while detailed error information is logged on the server for debugging purposes, preventing sensitive information leakage.
