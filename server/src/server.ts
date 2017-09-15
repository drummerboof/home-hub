import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';

export async function bootstrap () {
  const app = await NestFactory.create(ApplicationModule);
  app.setGlobalPrefix(ApplicationModule.PREFIX);
  await app.listen(3000);
}

bootstrap();
