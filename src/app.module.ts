import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggingService } from './common/logging.service';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [LoggingService, AppService],
})
export class AppModule {}