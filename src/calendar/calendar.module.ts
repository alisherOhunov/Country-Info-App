import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CountriesModule } from '../countries/countries.module';

@Module({
  imports: [PrismaModule, CountriesModule],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
