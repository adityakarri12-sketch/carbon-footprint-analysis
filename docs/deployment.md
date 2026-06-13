# Deployment Guide

This guide provides instructions for deploying the CarbonWise application to Google Cloud Run.

## Prerequisites

-   A Google Cloud Platform (GCP) project.
-   The `gcloud` CLI installed and authenticated.
-   Docker installed.
-   A GitHub repository for the project.

## Configuration

1.  **Environment Variables**: Create a `.env` file in the root of the project and add the following environment variables:

    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```

2.  **GitHub Secrets**: In your GitHub repository, go to `Settings > Secrets and variables > Actions` and add the following secrets:
    -   `GCP_PROJECT_ID`: Your GCP project ID.
    -   `GCP_SA_KEY`: The JSON key for a service account with the "Cloud Run Admin" and "Storage Admin" roles.

## Deployment

The application is automatically deployed to Google Cloud Run when changes are pushed to the `main` branch, using the GitHub Actions workflow defined in `.github/workflows/ci-cd.yml`.

The workflow will:
1.  Build and test the application.
2.  Build and push a Docker image to Google Container Registry (GCR).
3.  Deploy the image to Google Cloud Run.
