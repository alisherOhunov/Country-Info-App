import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CountriesService } from '../countries/countries.service';
import { AddHolidaysDto } from './dto/add-holidays.dto';

@Injectable()
export class CalendarService {
  constructor(
    private prisma: PrismaService,
    private countriesService: CountriesService,
  ) {}

  async addHolidaysToCalendar(userId: number, addHolidaysDto: AddHolidaysDto) {
    const { countryCode, year, holidays } = addHolidaysDto;

    await this.ensureUserExists(userId);
    const publicHolidays = await this.countriesService.getPublicHolidays(
      year,
      countryCode,
    );

    if (!publicHolidays || publicHolidays.length === 0) {
      throw new HttpException(
        'No holidays found for the specified country and year',
        HttpStatus.NOT_FOUND,
      );
    }

    const filteredHolidays = holidays
      ? publicHolidays.filter((holiday) => holidays.includes(holiday.name))
      : publicHolidays;

    if (filteredHolidays.length === 0) {
      throw new HttpException(
        'No matching holidays found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.calendarEvent.deleteMany({
      where: {
        userId,
        countryCode,
        year,
      },
    });

    const calendarEvents = filteredHolidays.map((holiday) => ({
      userId,
      title: holiday.name,
      date: new Date(holiday.date),
      countryCode,
      year,
    }));

    const createdEvents = await this.prisma.calendarEvent.createMany({
      data: calendarEvents,
    });

    return {
      message: `Successfully added ${createdEvents.count} holidays to calendar`,
      count: createdEvents.count,
      holidays: filteredHolidays.map((h) => ({
        name: h.name,
        date: h.date,
      })),
    };
  }

  async getUserCalendarEvents(userId: number) {
    await this.ensureUserExists(userId);

    return await this.prisma.calendarEvent.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }

  private async ensureUserExists(userId: number) {
    let user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { id: userId },
      });
    }

    return user;
  }
}
