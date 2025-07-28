import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('file://')) {
        // Allow file:// from Electron production build
        return callback(null, true);
      }

      if (origin === 'http://localhost:5173') {
        // Allow dev server origin
        return callback(null, true);
      }

      // Block everything else
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
