import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Auth API')
  .setDescription('Authentication system')
  .setVersion('1.0')
  .addBearerAuth()
  .build();