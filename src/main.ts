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
      // Allow requests with no origin (like mobile apps, Electron apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Allow file:// from Electron production build
      if (origin.startsWith('file://')) {
        return callback(null, true);
      }

      // Allow localhost development servers
      if (
        origin === 'http://localhost:5173' ||
        origin === 'http://localhost:5174' ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('https://localhost:')
      ) {
        return callback(null, true);
      }

      // Allow Electron app origins (they might use custom protocols)
      if (
        origin.startsWith('app://') ||
        origin.startsWith('electron://') ||
        origin.includes('electron')
      ) {
        return callback(null, true);
      }

      // For production, you might want to be more specific about allowed origins
      // For now, allowing all origins for Electron compatibility
      console.log('CORS: Allowing origin:', origin);
      return callback(null, true);
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
