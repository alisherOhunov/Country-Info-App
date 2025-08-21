import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CountriesService } from '../countries/countries.service';

describe('CalendarService', () => {
  let service: CalendarService;
  let prisma: PrismaService;
  let countriesService: CountriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            calendarEvent: {
              deleteMany: jest.fn(),
              createMany: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: CountriesService,
          useValue: {
            getPublicHolidays: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    prisma = module.get<PrismaService>(PrismaService);
    countriesService = module.get<CountriesService>(CountriesService);
  });

  it('should successfully add holidays to calendar', async () => {
    const userId = 1;
    const dto = {
      countryCode: 'US',
      year: 2025,
      holidays: ['New Year'],
    };

    const holidaysMock = [
      { name: 'New Year', date: '2025-01-01' },
      { name: 'Christmas', date: '2025-12-25' },
    ];

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: userId });
    (countriesService.getPublicHolidays as jest.Mock).mockResolvedValue(
      holidaysMock,
    );
    (prisma.calendarEvent.deleteMany as jest.Mock).mockResolvedValue({});
    (prisma.calendarEvent.createMany as jest.Mock).mockResolvedValue({
      count: 1,
    });

    const result = await service.addHolidaysToCalendar(userId, dto);

    expect(result).toEqual({
      message: 'Successfully added 1 holidays to calendar',
      count: 1,
      holidays: [{ name: 'New Year', date: '2025-01-01' }],
    });
  });

  it('should successfully get user calendar events', async () => {
    const userId = 2;
    const eventsMock = [
      { id: 1, title: 'New Year', date: new Date('2025-01-01'), userId: 2 },
    ];

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: userId });
    (prisma.calendarEvent.findMany as jest.Mock).mockResolvedValue(eventsMock);

    const result = await service.getUserCalendarEvents(userId);

    expect(result).toEqual(eventsMock);
  });
});
