# New Patient Results Module

A simple ROI dashboard that tracks new patient growth across multiple practice locations and calculates the return on investment for patient acquisition programs.

## How It Works

### Data Structure

Each location has four key metrics:
- **Start Average**: Baseline monthly new patient count
- **New Average**: Current monthly new patient count
- **Average Revenue per New Patient**: Dollar value per new patient
- **Start Date**: The date when the location began the program (used for graph timeline)

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
└── start_date (date) - Date when location began the program
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
  "startDate": "2022-01-01"
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
4. Program start date for each location
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

### Phase 2: Graph Implementation (In Progress)

#### Overview
The graph view provides a visual timeline showing cumulative collections from the member's start date through at least 10 years into the future. It replaces the table view when the toggle is switched.

#### Key Features
- **Timeline**: Shows from location start date to current date + 10 years minimum
- **Dual Bar System**:
  - Gray bars: Collections using starting average
  - Green bars: Collections using member average (actual performance)
  - Light green bars: Projected collections with user-defined growth rate
- **Draggable Ticker**: Interactive timeline marker with cumulative collections tooltip
- **Growth Projection**: User-adjustable percentage input to model future growth
- **Location Selector**: Sidebar to view individual locations or aggregate "All locations"
- **Adaptive X-Axis**: Automatically switches between months/quarters/years based on date range

#### Implementation Tasks

**Data Structure Updates**
- [ ] Replace `durationMonths` with `startDate` for each location
- [ ] Add current date calculation logic
- [ ] Create date range calculator (start to current + 10 years)

**Graph Foundation**
- [ ] Select and integrate Chart.js library
- [ ] Create graph container HTML structure
- [ ] Build location selector sidebar (All locations + individual locations)
- [ ] Implement graph show/hide based on toggle state

**Timeline & Axis Logic**
- [ ] Calculate total months/quarters/years in timeline
- [ ] Implement adaptive x-axis logic:
  - Use months if timeline ≤ 2 years
  - Use quarters if timeline ≤ 8 years
  - Use years if timeline > 8 years
- [ ] Label x-axis with appropriate time units
- [ ] Add "current date" vertical indicator line

**Collections Calculation**
- [ ] Calculate collections per time period: `New Patients × Avg Revenue × Time Unit`
- [ ] Implement cumulative collections from month 0 ($0) to present
- [ ] Build historical collections using actual member averages
- [ ] Build starting average collections (baseline comparison)

**Projection Logic**
- [ ] Add growth percentage input field to header ("What if I grew my patients by [10%] each year?")
- [ ] Implement compound growth calculation for future dates
- [ ] Apply growth only to dates after current date
- [ ] Calculate projected new patient counts with compound growth
- [ ] Calculate projected collections using projected patient counts

**Interactive Ticker**
- [ ] Create draggable ticker element
- [ ] Position ticker on current date at initial load
- [ ] Implement drag constraints (stays within graph bounds)
- [ ] Show persistent tooltip with:
  - Cumulative collections (member average)
  - Cumulative collections (starting average)
  - Percentage difference

**Bar Chart Rendering**
- [ ] Render gray bars (starting average collections) for all time periods
- [ ] Render green bars (member average collections) for past/present
- [ ] Render light green bars (projected collections) for future dates
- [ ] Ensure bars scale properly to fit x-axis without overflow
- [ ] Remove y-axis (values shown only in ticker tooltip)

**Aggregation Logic (All Locations)**
- [ ] Calculate average starting average across all locations
- [ ] Calculate average member average across all locations
- [ ] Calculate average revenue per patient across all locations
- [ ] Use earliest start date among all locations for timeline start
- [ ] Sum collections across all locations for each time period

**Styling & Polish**
- [ ] Match graph colors to table theme (dark background, green accents)
- [ ] Style location selector to match existing UI
- [ ] Add smooth transitions when switching locations
- [ ] Ensure responsive design
- [ ] Hide time period tabs (Monthly/Quarterly/Yearly) in graph view

**Testing**
- [ ] Test with different location selections
- [ ] Test growth percentage changes (compound calculations)
- [ ] Test ticker drag functionality
- [ ] Verify cumulative calculations accuracy
- [ ] Test timeline with various date ranges
- [ ] Verify current date indicator position

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
