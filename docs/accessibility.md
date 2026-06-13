# Accessibility Documentation

This document outlines the accessibility features and best practices implemented in the CarbonWise application to meet WCAG 2.2 AA standards.

## General Principles

-   **Semantic HTML**: The application uses semantic HTML5 elements (`<main>`, `<nav>`, `<header>`, `<footer>`, etc.) to provide a meaningful structure for screen readers and other assistive technologies.
-   **Keyboard Navigation**: All interactive elements are reachable and operable via the keyboard. The focus order is logical and intuitive.
-   **Focus Management**: Focus is managed programmatically in dynamic components (e.g., modals, forms) to ensure a smooth user experience for keyboard users.
-   **Color Contrast**: The color palette for both light and dark modes has been chosen to ensure sufficient color contrast between text and background, meeting WCAG AA requirements.

## Forms

-   **Labels**: All form inputs have associated `<label>` elements.
-   **Error Handling**: Form validation errors are clearly communicated to the user and associated with the respective form fields using `aria-describedby`.
-   **Accessible Names**: Buttons and other controls have clear and descriptive accessible names.

## Charts and Data Visualizations

-   **ARIA Attributes**: Recharts are made accessible by adding appropriate ARIA roles and properties to the chart elements.
-   **Alternative Text**: A textual summary of the data presented in charts is provided for users who cannot see the charts.

## ARIA (Accessible Rich Internet Applications)

-   ARIA attributes are used judiciously to enhance the accessibility of dynamic components where native HTML semantics are not sufficient.

## Testing

-   The application is tested with screen readers (e.g., NVDA, VoiceOver) and automated accessibility testing tools (e.g., Axe) to identify and fix accessibility issues.
