import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggingService } from './common/logging.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [LoggingService],
})
export class AppModule {}