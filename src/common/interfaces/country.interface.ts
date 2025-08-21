export interface Country {
  countryCode: string;
  name: string;
}

export interface CountryInfo {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: BorderCountry[];
}

export interface BorderCountry {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
}

export interface PopulationData {
  country: string;
  code: string;
  populationCounts: Array<number>;
}

export interface FlagData {
  name: string;
  flag: string;
  iso2: string;
  iso3: string;
}

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties?: string[];
  launchYear?: number;
  types: string[];
}
