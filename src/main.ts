import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { setupEnv } from './config/env.config';

setupEnv();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('file://')) {
        // Allow file:// from Electron production build
        return callback(null, true);
      }

      if (
        origin === 'http://localhost:5173' ||
        origin === 'http://localhost:5174'
      ) {
        // Allow dev server origins
        return callback(null, true);
      }

      // Block everything else
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // Serve static files from the 'uploads' directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/images/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
