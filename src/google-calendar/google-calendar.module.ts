import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { GoogleCalendarController } from './google-calendar.controller';

@Module({
  controllers: [GoogleCalendarController],
  providers: [GoogleCalendarService]
})
export class GoogleCalendarModule {}
