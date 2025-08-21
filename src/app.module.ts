import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { CountriesModule } from './countries/countries.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CountriesModule,
    CalendarModule,
  ],
})
export class AppModule {}
