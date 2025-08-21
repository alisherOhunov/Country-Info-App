# Country Info App

A NestJS-based REST API that provides country information and calendar management functionality. Users can fetch country data, view border countries, population data, flag images, and add national holidays to their personal calendar.

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:alisherOhunov/Country-Info-App.git
cd country-info-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/country_info_db"

# API URLs (Default values - don't change unless needed)
NAGER_API_BASE_URL="https://date.nager.at/api/v3"
COUNTRIES_NOW_API_BASE_URL="https://countriesnow.space/api/v0.1/countries"

# Application Settings
PORT=3000
NODE_ENV=development
```

**Important:** Replace `username`, `password`, and database name in the DATABASE_URL with your actual MySQL credentials.

### 4. Database Setup

#### Create MySQL Database

```sql
-- Login to MySQL and create the database
CREATE DATABASE country_info_db;
```

#### Generate Prisma Client and Setup Database

```bash
# Generate the Prisma client
npm run db:generate

# Push the database schema (creates tables)
npm run db:push
```

**Alternative:** If you prefer migrations:

```bash
# Create and apply migration
npm run db:migrate
```

### 5. Start the Application

#### Development Mode (with hot reload)

```bash
npm run start:dev
```

#### Production Mode

```bash
# Build the application
npm run build
```

The application will be available at:
- **API:** http://localhost:3000

## 📚 API Documentation

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/countries` | Get list of available countries |
| GET | `/countries/{countryCode}` | Get detailed country information |
| GET | `/countries/{countryCode}/holidays/{year}` | Get public holidays for a country |
| POST | `/users/{userId}/calendar/holidays` | Add holidays to user's calendar |
| GET | `/users/{userId}/calendar` | Get user's calendar events |

### Example API Calls

#### 1. Get Available Countries

```bash
curl -X GET http://localhost:3000/countries
```

**Response:**
```json
[
  {
    "countryCode": "AD",
    "name": "Andorra"
  },
  {
    "countryCode": "US",
    "name": "United States"
  }
]
```

#### 2. Get Country Information

```bash
curl -X GET http://localhost:3000/countries/US
```

**Response:**
```json
{
  "countryInfo": {
    "commonName": "United States",
    "officialName": "United States of America",
    "countryCode": "US",
    "region": "Americas",
    "borders": [
      {
        "commonName": "Canada",
        "officialName": "Canada",
        "countryCode": "CA",
        "region": "Americas"
      }
    ]
  },
  "populationData": {
    "country": "United States",
    "code": "US",
    "populationCounts": [
      {
        "year": 2022,
        "value": 331900000
      }
    ]
  },
  "flagUrl": "https://flagcdn.com/w320/us.png"
}
```

#### 3. Get Public Holidays

```bash
curl -X GET http://localhost:3000/countries/US/holidays/2025
```

#### 4. Add Holidays to User Calendar

```bash
curl -X POST http://localhost:3000/users/1/calendar/holidays \
  -H "Content-Type: application/json" \
  -d '{
    "countryCode": "US",
    "year": 2025,
    "holidays": ["New Year'\''s Day", "Independence Day"]
  }'
```

**Request Body Parameters:**
- `countryCode` (string, required): ISO 3166-1 alpha-2 country code
- `year` (number, required): Year between 2000-2030
- `holidays` (string[], optional): Specific holidays to add. If not provided, all holidays will be added

**Response:**
```json
{
  "message": "Successfully added 2 holidays to calendar",
  "count": 2,
  "holidays": [
    {
      "name": "New Year's Day",
      "date": "2025-01-01"
    },
    {
      "name": "Independence Day",
      "date": "2025-07-04"
    }
  ]
}
```

#### 5. Get User Calendar Events

```bash
curl -X GET http://localhost:3000/users/1/calendar
```

## 🛠️ Available Scripts

```bash
# Development
npm run start:dev        # Start with hot reload
npm run start:debug      # Start in debug mode

# Production
npm run build           # Build the application

# Database
npm run db:generate     # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Create and run migrations
# Code Quality
npm run lint           # Run ESLint
# Code Testing
npm run test           # Run Unit Test
```

## 📊 Database Schema

### Users Table
- `id`: Primary key (auto-increment)
- `name`: Optional user name
- `email`: Optional unique email
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Calendar Events Table
- `id`: Primary key (auto-increment)
- `userId`: Foreign key to users table
- `title`: Holiday name
- `date`: Holiday date
- `countryCode`: ISO country code
- `year`: Year of the holiday
- `createdAt`: Timestamp