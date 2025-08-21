import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CountriesService', () => {
  let service: CountriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'NAGER_API_BASE_URL') return 'https://nager.test';
              if (key === 'COUNTRIES_NOW_API_BASE_URL')
                return 'https://countriesnow.test';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
  });

  it('should return available countries', async () => {
    const mockCountries = [
      { countryCode: 'US', name: 'United States' },
      { countryCode: 'GB', name: 'United Kingdom' },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockCountries });

    const result = await service.getAvailableCountries();

    expect(result).toEqual(mockCountries);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://nager.test/AvailableCountries',
    );
  });

  it('should return public holidays', async () => {
    const mockHolidays = [
      { name: 'New Year', date: '2025-01-01' },
      { name: 'Christmas', date: '2025-12-25' },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockHolidays });

    const result = await service.getPublicHolidays(2025, 'US');

    expect(result).toEqual(mockHolidays);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://nager.test/PublicHolidays/2025/US',
    );
  });

  it('should return country info with population and flag', async () => {
    const mockCountryInfo = { commonName: 'United States', borders: [] };
    const mockFlagData = { flag: 'https://flags.test/us.png' };
    const mockPopulationData = {
      populationCounts: [{ year: 2025, value: 331 }],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockCountryInfo });
    mockedAxios.post.mockResolvedValueOnce({ data: { data: mockFlagData } });
    mockedAxios.post.mockResolvedValueOnce({
      data: { data: mockPopulationData },
    });

    const result = await service.getCountryInfo('US');

    expect(result).toEqual({
      countryInfo: mockCountryInfo,
      populationData: mockPopulationData,
      flagUrl: 'https://flags.test/us.png',
    });
  });
});
