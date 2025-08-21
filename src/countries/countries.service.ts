import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  Country,
  CountryInfo,
  PopulationData,
  FlagData,
  Holiday,
} from '../common/interfaces/country.interface';

@Injectable()
export class CountriesService {
  private readonly nagerApiUrl: string;
  private readonly countriesNowApiUrl: string;

  constructor(private configService: ConfigService) {
    this.nagerApiUrl =
      this.configService.get<string>('NAGER_API_BASE_URL') || '';
    this.countriesNowApiUrl =
      this.configService.get<string>('COUNTRIES_NOW_API_BASE_URL') || '';
  }

  async getAvailableCountries(): Promise<Country[]> {
    try {
      const response = await axios.get(
        `${this.nagerApiUrl}/AvailableCountries`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch available countries, ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCountryInfo(countryCode: string) {
    try {
      const [countryInfo, flagData] = await Promise.all([
        this.getCountryBorders(countryCode),
        this.getFlagData(countryCode),
      ]);
      const populationData = await this.getPopulationData(
        countryInfo.commonName,
      );

      return {
        countryInfo,
        populationData,
        flagUrl: flagData?.flag || null,
      };
    } catch (error) {
      console.error(`Error fetching country info for ${countryCode}:`, error);
      throw new HttpException(
        'Failed to fetch country information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPublicHolidays(
    year: number,
    countryCode: string,
  ): Promise<Holiday[]> {
    try {
      const response = await axios.get(
        `${this.nagerApiUrl}/PublicHolidays/${year}/${countryCode}`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch public holidays, ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getCountryBorders(countryCode: string): Promise<CountryInfo> {
    const response = await axios.get(
      `${this.nagerApiUrl}/CountryInfo/${countryCode}`,
    );
    return response.data;
  }

  private async getPopulationData(
    countryName: string,
  ): Promise<PopulationData> {
    const response = await axios.post(`${this.countriesNowApiUrl}/population`, {
      country: countryName,
    });
    return response.data.data;
  }

  private async getFlagData(countryCode: string): Promise<FlagData> {
    const response = await axios.post(
      `${this.countriesNowApiUrl}/flag/images`,
      {
        iso2: countryCode,
      },
    );
    return response.data.data;
  }
}
