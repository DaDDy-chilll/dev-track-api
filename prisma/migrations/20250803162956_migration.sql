
> dev-track-api@0.0.1 prisma:prod-env
> DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datasource prisma/schema.prisma --script

-- This is an empty migration.

