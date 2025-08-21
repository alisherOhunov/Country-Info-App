import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AddHolidaysDto {
  @IsString()
  countryCode: string;

  @IsNumber()
  @Min(2000)
  @Max(2030)
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  holidays?: string[];
}
