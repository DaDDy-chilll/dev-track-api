import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

export function setupEnv() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envPath = path.resolve(process.cwd(), `.env.${nodeEnv}`);

  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));

    // Set other environment variables
    for (const key in envConfig) {
      if (!process.env[key]) {
        process.env[key] = envConfig[key];
      }
    }
  }
}
