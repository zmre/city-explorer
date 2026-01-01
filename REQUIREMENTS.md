# City Livability & Climate Research Requirements

## Project Overview

This research project aims to identify and rank cities globally based on climate quality, livability factors, and forward-thinking urban policies. The goal is to find ideal relocation candidates that balance excellent weather, quality of life, and progressive infrastructure.

## Target Regions

- **North America**: USA, Canada, Mexico
- **Central America**: All countries
- **South America**: All countries
- **Europe**: Western and Eastern Europe
- **Oceania**: Australia, New Zealand

## City Selection Criteria

### Population Requirements
- **Minimum**: 50,000 residents
- **Maximum**: 1,000,000 residents
- **Rationale**: Large enough for amenities, small enough to avoid mega-city problems

### Geographic Requirements (Bonus Points)
- Near mountains (+1 point)
- Near ocean/coast (+1 point)
- Both mountains AND ocean (+3 points - maximum)

## Climate Criteria

### Reference Baseline: Boulder, Colorado
Boulder serves as our climate benchmark with:
- ~300 sunny days per year
- Low relative humidity (typically 30-50%)
- Four distinct seasons
- Mild winters with occasional snow
- Warm but not hot summers

### Climate Data Points to Collect
1. **Sunshine**
   - Annual sunny days (full sun + partly cloudy)
   - Average daily sunshine hours by season

2. **Temperature**
   - Average high/low by season (Spring, Summer, Fall, Winter)
   - Number of days above 90°F (32°C)
   - Number of days below 32°F (0°C)
   - Temperature range/variability

3. **Humidity**
   - Average relative humidity by season
   - Dew point averages (comfort indicator)

4. **Precipitation**
   - Annual rainfall (inches/mm)
   - Rainy days per year
   - Snow days (where applicable)

5. **Extreme Weather**
   - Hurricane/cyclone risk
   - Tornado risk
   - Flood risk
   - Earthquake risk
   - Wildfire risk

## Livability Criteria

### Accessibility
1. **Airport Proximity**
   - Distance to international airport
   - Number of direct flight destinations

2. **City Connectivity**
   - Distance to nearest major city (500k+ population)
   - Public transportation quality

3. **Walkability**
   - Walk Score (where available)
   - Pedestrian infrastructure quality

### Cost of Living
1. **Housing**
   - Median home price
   - Median rent (1BR, 2BR, 3BR)

2. **General Expenses**
   - Cost of living index (relative to baseline)
   - Healthcare costs
   - Grocery costs

### Family-Friendliness
1. **Education**
   - School quality ratings
   - University presence

2. **Safety**
   - Crime rates
   - General safety perception

3. **Activities**
   - Parks and recreation
   - Family-oriented activities
   - Cultural amenities

## Forward-Thinking Criteria

### Sustainable Transportation
1. **Biking Infrastructure**
   - Bike lane miles/km
   - Bike share programs
   - Cycling mode share percentage

2. **Walking Infrastructure**
   - Pedestrian zones
   - Sidewalk coverage
   - Trail systems

3. **Public Transit**
   - Transit score
   - Coverage area
   - Frequency/reliability

### Electric Vehicle Support
1. **Charging Infrastructure**
   - EV charging stations per capita
   - DC fast charging availability

2. **Policy Support**
   - EV incentives
   - Emissions regulations

### Environmental Progress
1. **Renewable Energy**
   - Clean energy percentage
   - Solar/wind adoption

2. **Climate Goals**
   - Net-zero commitments
   - Sustainability initiatives

## Scoring Methodology

### Category Weights (Total: 100 points)

| Category | Weight | Description |
|----------|--------|-------------|
| Climate Quality | 30 pts | Sunny days, temperature, humidity |
| Geographic Features | 10 pts | Mountains, ocean, natural beauty |
| Accessibility | 15 pts | Airports, connectivity, walkability |
| Cost of Living | 15 pts | Housing, general expenses |
| Family-Friendliness | 15 pts | Schools, safety, activities |
| Forward-Thinking | 15 pts | Biking, EVs, sustainability |

### Climate Scoring Detail

**Sunny Days (0-10 points)**
- 300+ days: 10 points (Boulder baseline)
- 250-299 days: 8 points
- 200-249 days: 6 points
- 150-199 days: 4 points
- 100-149 days: 2 points
- <100 days: 0 points

**Humidity Comfort (0-10 points)**
- <40% average: 10 points (ideal)
- 40-50%: 8 points
- 50-60%: 6 points
- 60-70%: 4 points
- 70-80%: 2 points
- >80%: 0 points

**Temperature Mildness (0-10 points)**
- Based on deviation from ideal range (60-80°F / 15-27°C for highs)
- Fewer extreme hot/cold days = higher score

### Geographic Scoring
- Near mountains only: 3 points
- Near ocean only: 3 points
- Both mountains AND ocean: 10 points
- Neither: 0 points

## Data Sources

### Primary Sources
- Climate-Data.org
- WeatherSpark.com
- Numbeo (cost of living)
- WalkScore.com
- OECD Regional Well-Being
- Government census data

### Secondary Sources
- Expat forums and guides
- "Best places to live" rankings (Condé Nast, Monocle, etc.)
- Academic research on livability

## Output Requirements

### CSV Data File
File: `city_data.csv`

Columns:
- city_name
- country
- region
- population
- latitude
- longitude
- sunny_days_year
- avg_humidity_percent
- avg_temp_summer_high_c
- avg_temp_winter_low_c
- near_mountains (boolean)
- near_ocean (boolean)
- walk_score
- bike_score
- cost_of_living_index
- safety_index
- kid_friendly_score
- ev_infrastructure_score
- airport_distance_km
- total_score
- rank

### Summary Report
File: `preliminary_findings_2026-01-01.md`

Contents:
- Executive summary
- Top 20 ranked cities
- Regional highlights
- Data quality notes
- Methodology notes
- Next steps

## Project Timeline

1. Requirements definition (this document)
2. Data collection and research
3. CSV compilation
4. Preliminary analysis
5. Interactive exploration tool (future phase)

---

*Document created: 2026-01-01*
*Project: Climate & Livability Research*
