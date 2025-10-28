# New Patient Results Module

A simple ROI dashboard that tracks new patient growth across multiple practice locations and calculates the return on investment for patient acquisition programs.

## How It Works

### Data Structure

Each location has four key metrics:
- **Start Average**: Baseline monthly new patient count
- **New Average**: Current monthly new patient count
- **Average Revenue per New Patient**: Dollar value per new patient
- **Duration**: Total months tracked with the program

### Calculations

#### 1. Growth Calculation
```
Growth = New Average - Start Average
Growth Percentage = (Growth / Start Average) × 100
```

**Example**: Bradley Place
- Start Average: 27 patients/month
- New Average: 35.08 patients/month
- Growth: 35.08 - 27 = 8.08 patients/month
- Growth %: (8.08 / 27) × 100 = 30%

#### 2. Revenue Calculation
```
Growth Total = Growth × Average Revenue per New Patient
```

**Example**: Bradley Place
- Growth: 8.08 patients
- Avg Revenue: $2,978 per patient
- Growth Total: 8.08 × $2,978 = $24,062

#### 3. Time Period Multipliers
The module can display results across different time periods by multiplying the monthly base values:

- **Monthly**: × 1
- **Quarterly**: × 3
- **Yearly**: × 12
- **Custom**: × (12 × selected years)

#### 4. Investment Tracking
Two investment categories are tracked:
- **New Patient Trainings**: Monthly training costs
- **New Patient Program**: Monthly program costs
- **Total Investment**: Sum of both, multiplied by the selected time period

#### 5. Aggregate Metrics
- **Total Growth**: Sum of growth across all locations
- **Total Return**: Sum of all growth totals across all locations

### Display

The table shows:
1. Each location's starting and new averages (adjusted for time period)
2. Growth in patient count and percentage increase
3. Revenue per new patient
4. Total revenue from growth

The metrics cards show:
1. **Investment Card**: Total investment broken down by training and program costs
2. **Return Card**: Total return and additional new patients gained

## Installation Guide

### Database Requirements

The application requires a data source that provides the following fields for each location:

#### Location Table
```
locations
├── id (primary key)
├── name (string)
├── start_avg (decimal) - Monthly starting new patient average
├── new_avg (decimal) - Monthly current new patient average
├── avg_revenue (decimal) - Average revenue per new patient ($)
└── duration_months (integer) - Total months with program
```

#### Investment Table
```
investment
├── id (primary key)
├── training (decimal) - Monthly training investment ($)
└── program (decimal) - Monthly program investment ($)
```

### Sample Data Format

**Locations Example**:
```json
{
  "name": "Bradley Place",
  "startAvg": 27,
  "newAvg": 35.08,
  "avgRevenue": 2978,
  "durationMonths": 36
}
```

**Investment Example**:
```json
{
  "training": 816.50,
  "program": 399.08
}
```

### Data Collection Requirements

To populate the dashboard, collect:
1. Historical monthly new patient averages (baseline period)
2. Recent monthly new patient averages (comparison period)
3. Average revenue generated per new patient
4. Program duration in months
5. Monthly training and program costs

## Technical Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Bootstrap grid system, custom CSS
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Lato)

## File Structure

```
mems-roi_np_results/
├── index-results_module.html    # Main HTML structure
├── js/
│   └── results-module.js        # Data and calculation logic
├── styles/
│   └── styles.css               # Custom styling
└── README.md                    # This file
```

## Current Features

- Dynamic table displaying results by location
- Time period selection (Monthly, Quarterly, Yearly, Custom)
- Investment and return tracking
- Growth percentage indicators
- Toggle between table and graph views (graph view pending)

## Work Plan

### Phase 1: Documentation (Current)
- [x] Create README with calculation explanations
- [x] Document database requirements
- [x] Add installation guide

### Phase 2: Graph Implementation (Next)
- [ ] Design graph visualization approach
- [ ] Select/integrate charting library
- [ ] Implement graph view display
- [ ] Connect graph to time period toggles
- [ ] Ensure graph updates with data changes
- [ ] Add graph/table view switching functionality

### Phase 3: Future Enhancements (Planned)
- [ ] Connect to live database
- [ ] Add data export functionality
- [ ] Implement date range selector
- [ ] Add comparison views between time periods
- [ ] Create printable reports

## Notes

- All calculations start from monthly base values stored in `npData`
- Negative growth is displayed as zero
- Growth percentage is rounded to nearest whole number
- All currency values are displayed with locale formatting
