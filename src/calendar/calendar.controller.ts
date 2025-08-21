import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AddHolidaysDto } from './dto/add-holidays.dto';

@Controller('users')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post(':userId/calendar/holidays')
  async addHolidaysToCalendar(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() addHolidaysDto: AddHolidaysDto,
  ) {
    return await this.calendarService.addHolidaysToCalendar(
      userId,
      addHolidaysDto,
    );
  }

  @Get(':userId/calendar')
  async getUserCalendarEvents(@Param('userId', ParseIntPipe) userId: number) {
    return await this.calendarService.getUserCalendarEvents(userId);
  }
}
