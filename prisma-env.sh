#!/bin/bash

# Extract DATABASE_URL from .env.development
DATABASE_URL=$(grep DATABASE_URL .env.development | cut -d '=' -f2-)

# Export it for Prisma CLI
export DATABASE_URL

# Run the Prisma command passed as arguments
npx prisma "$@"
