// New Patient Results Module
// Handles table data, calculations, and UI interactions

// New Patient Results Data (Monthly base values)
const npData = {
  locations: [
    {
      name: "Bradley Place",
      startAvg: 27,        // Monthly starting average
      newAvg: 35.08,       // Monthly new average
      avgRevenue: 2978,    // Average revenue per new patient
      startDate: "2022-01-01"  // Program start date
    },
    {
      name: "East Lake",
      startAvg: 37.08,
      newAvg: 42.33,
      avgRevenue: 2101,
      startDate: "2022-01-01"
    },
    {
      name: "Fullerton",
      startAvg: 22.92,
      newAvg: 22.08,
      avgRevenue: 2457,
      startDate: "2022-01-01"
    },
    {
      name: "Westside",
      startAvg: 31.5,
      newAvg: 38.75,
      avgRevenue: 2650,
      startDate: "2022-01-01"
    },
    {
      name: "North Point",
      startAvg: 19.25,
      newAvg: 28.5,
      avgRevenue: 2890,
      startDate: "2022-01-01"
    },
    {
      name: "Riverside",
      startAvg: 42.0,
      newAvg: 48.33,
      avgRevenue: 2275,
      startDate: "2022-01-01"
    },
    {
      name: "Downtown",
      startAvg: 35.67,
      newAvg: 41.92,
      avgRevenue: 3100,
      startDate: "2022-01-01"
    }
  ],
  investment: {
    training: 816.5,     // Monthly training investment
    program: 399.08      // Monthly program investment
  }
};

// Current selected period
let currentPeriod = 'monthly';
let customYearsValue = 2;

// Calculation functions
function calculateMetrics(period, customYears = 2) {
  const multiplier = getMultiplier(period, customYears);
  const periodLabel = getPeriodLabel(period, customYears);

  const results = npData.locations.map(location => {
    const startAvg = Math.round(location.startAvg * multiplier);
    const newAvg = Math.round(location.newAvg * multiplier);
    const growth = Math.max(0, newAvg - startAvg); // Never show negative growth
    const growthPercent = location.startAvg > 0 && growth > 0 ? Math.round((growth / (location.startAvg * multiplier)) * 100) : 0;
    const growthTotal = growth * location.avgRevenue;

    return {
      name: location.name,
      startAvg,
      newAvg,
      growth,
      growthPercent,
      avgRevenue: location.avgRevenue,
      growthTotal
    };
  });

  // Calculate totals
  const totalGrowth = results.reduce((sum, loc) => sum + loc.growth, 0);
  const totalInvestment = (npData.investment.training + npData.investment.program) * multiplier;
  const trainingInvestment = npData.investment.training * multiplier;
  const programInvestment = npData.investment.program * multiplier;
  const totalReturn = results.reduce((sum, loc) => sum + loc.growthTotal, 0);

  return {
    locations: results,
    totalGrowth,
    totalInvestment,
    trainingInvestment,
    programInvestment,
    totalReturn,
    periodLabel
  };
}

function getMultiplier(period, customYears) {
  switch(period) {
    case 'monthly': return 1;
    case 'quarterly': return 3;
    case 'yearly': return 12;
    case 'total': return npData.locations[0].durationMonths; // Using first location's duration
    case 'custom': return 12 * customYears;
    default: return 1;
  }
}

function getPeriodLabel(period, customYears) {
  switch(period) {
    case 'monthly': return '/month';
    case 'quarterly': return '/quarter';
    case 'yearly': return '/year';
    case 'total': return '/total';
    case 'custom': return `/${customYears} year${customYears > 1 ? 's' : ''}`;
    default: return '';
  }
}

// Update table display
function updateTable(period, customYears = 2) {
  const metrics = calculateMetrics(period, customYears);
  const tbody = document.getElementById('dataTableBody');

  tbody.innerHTML = metrics.locations.map(location => `
    <tr>
      <td class="col-location location-name">${location.name}</td>
      <td class="col-start-avg">
        ${location.startAvg.toLocaleString()}
        <span class="math-operator">△</span>
      </td>
      <td class="col-new-avg">
        ${location.newAvg.toLocaleString()}
        <span class="math-operator">=</span>
      </td>
      <td class="col-growth">
        ${location.growth.toLocaleString()}
        ${location.growthPercent > 0 ? `<span class="growth-percent">(${location.growthPercent}%)</span>` : ''}
        <span class="math-operator">×</span>
      </td>
      <td class="col-revenue">
        $${location.avgRevenue.toLocaleString()}
        <span class="math-operator">=</span>
      </td>
      <td class="col-growth-total growth-total">$${location.growthTotal.toLocaleString()}</td>
    </tr>
  `).join('');

  // Update investment and return cards
  document.getElementById('investmentTotal').textContent = `$${Math.round(metrics.totalInvestment).toLocaleString()}`;
  document.getElementById('investmentPeriod').textContent = metrics.periodLabel;
  document.getElementById('investmentTraining').textContent = `$${Math.round(metrics.trainingInvestment).toLocaleString()}`;
  document.getElementById('investmentProgram').textContent = `$${Math.round(metrics.programInvestment).toLocaleString()}`;

  document.getElementById('returnTotal').textContent = `$${Math.round(metrics.totalReturn).toLocaleString()}`;
  document.getElementById('returnPeriod').textContent = metrics.periodLabel;
  document.getElementById('returnGrowth').textContent = metrics.totalGrowth.toLocaleString();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initial table render
  updateTable(currentPeriod);

  // Tab button click handlers
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');

      // Update period and table
      currentPeriod = this.dataset.period;
      updateTable(currentPeriod);
    });
  });

  // Custom years select handler
  const customYearsSelect = document.getElementById('customYearsSelect');
  customYearsSelect.addEventListener('change', function() {
    const years = parseInt(this.value);
    customYearsValue = years;

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    // Add active class to select
    customYearsSelect.classList.add('active');

    // Update table with custom period
    currentPeriod = 'custom';
    updateTable(currentPeriod, customYearsValue);
  });

  // Remove active class from select when tab buttons are clicked
  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      customYearsSelect.classList.remove('active');
    });
  });

  // View toggle handler
  const viewToggle = document.getElementById('viewToggle');
  const toggleBall = viewToggle.querySelector('.toggle-ball');
  const tableView = document.getElementById('tableView');
  const graphView = document.getElementById('graphView');
  const timePeriodTabs = document.querySelector('.time-period-tabs');
  const locationSelectorHeader = document.getElementById('locationSelectorHeader');
  const metricsCards = document.getElementById('metricsCards');
  const footnoteText = document.getElementById('footnoteText');
  let currentView = 'table';

  viewToggle.addEventListener('click', function() {
    const ballIcon = toggleBall.querySelector('i');
    const ballText = toggleBall.querySelector('span');

    // Fade out current content
    ballIcon.style.opacity = '0';
    ballText.style.opacity = '0';

    setTimeout(() => {
      if (currentView === 'table') {
        // Switch to graph
        currentView = 'graph';
        toggleBall.classList.remove('active-table');
        toggleBall.classList.add('active-graph');
        viewToggle.classList.remove('active-table');
        viewToggle.classList.add('active-graph');

        // Update ball content
        toggleBall.innerHTML = '<i class="fas fa-chart-simple"></i><span>Graph</span>';

        // Show graph view, hide table view and metrics
        tableView.style.display = 'none';
        graphView.style.display = 'flex';
        timePeriodTabs.style.display = 'none';
        locationSelectorHeader.style.display = 'flex';
        metricsCards.style.display = 'none';

        // Update footnote text for graph
        if (footnoteText) {
          footnoteText.textContent = '*This graph shows average numbers and will not match your actual collections exactly.';
        }

        console.log('Switched to graph view');
      } else {
        // Switch to table
        currentView = 'table';
        toggleBall.classList.remove('active-graph');
        toggleBall.classList.add('active-table');
        viewToggle.classList.remove('active-graph');
        viewToggle.classList.add('active-table');

        // Update ball content
        toggleBall.innerHTML = '<i class="fas fa-table"></i><span>Table</span>';

        // Show table view, hide graph view, show metrics
        tableView.style.display = 'block';
        graphView.style.display = 'none';
        timePeriodTabs.style.display = 'flex';
        locationSelectorHeader.style.display = 'none';
        metricsCards.style.display = 'grid';

        // Update footnote text for table
        if (footnoteText) {
          footnoteText.textContent = '*This table shows average numbers and will not match your actual collections exactly.';
        }

        console.log('Switched to table view');
      }

      // Set new content to opacity 0 immediately
      const newIcon = toggleBall.querySelector('i');
      const newText = toggleBall.querySelector('span');
      newIcon.style.opacity = '0';
      newText.style.opacity = '0';

      // Fade in new content after a small delay
      setTimeout(() => {
        newIcon.style.opacity = '1';
        newText.style.opacity = '1';
      }, 50);
    }, 250);
  });

  // Initialize toggle state
  viewToggle.classList.add('active-table');

  // ============================================
  // GRAPH FUNCTIONALITY
  // ============================================

  let collectionsChart = null;
  let currentGrowthRate = null; // Will be set to actual member growth rate
  let currentLocation = 'all'; // Default to all locations

  // Helper function to convert kebab-case location value to proper case name
  function getLocationName(locationValue) {
    if (locationValue === 'all') return 'all';

    const nameMap = {
      'bradley-place': 'Bradley Place',
      'east-lake': 'East Lake',
      'fullerton': 'Fullerton',
      'westside': 'Westside',
      'north-point': 'North Point',
      'riverside': 'Riverside',
      'downtown': 'Downtown'
    };

    return nameMap[locationValue] || locationValue;
  }

  // Helper function to get months between two dates
  function getMonthsBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  }

  // Helper function to add months to a date
  function addMonths(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  // Calculate graph data for a location
  function calculateGraphData(location, growthRate) {
    const today = new Date();
    const startDate = new Date(location.startDate);
    const endDate = new Date(today);
    endDate.setFullYear(endDate.getFullYear() + 10); // Cap at 10 years out from today

    // Calculate total months in timeline
    const totalMonths = getMonthsBetween(startDate, endDate);
    const monthsToPresent = getMonthsBetween(startDate, today);

    // Always use yearly periods
    const periodLength = 12; // 12 months for years
    const periodCount = Math.ceil(totalMonths / periodLength);

    // Calculate actual member growth rate (from start to present)
    const actualGrowthRate = location.startAvg > 0
      ? ((location.newAvg - location.startAvg) / location.startAvg) * 100
      : 0;

    // Calculate annual growth rate from actual growth
    const monthsElapsed = monthsToPresent;
    const yearsElapsed = monthsElapsed / 12;
    const annualMemberGrowthRate = yearsElapsed > 0
      ? (Math.pow(location.newAvg / location.startAvg, 1 / yearsElapsed) - 1) * 100
      : 0;

    // Generate data for each period
    const startAvgData = [];
    const memberAvgData = [];
    const projectedAvgData = [];
    const labels = [];

    let cumulativeStartCollections = 0;
    let cumulativeMemberCollections = 0;
    let cumulativeProjectedCollections = 0;
    let lastMemberValue = 0;

    for (let i = 0; i <= periodCount; i++) {
      const periodStartMonth = i * periodLength;
      const periodDate = addMonths(startDate, periodStartMonth);

      // Check if this year is in the past (current year and onwards is considered future)
      const periodYear = periodDate.getFullYear();
      const currentYear = today.getFullYear();
      const isPast = periodYear < currentYear;

      // Generate abbreviated year label (e.g., '22, '23, '24)
      const year = periodDate.getFullYear();
      const abbreviatedYear = `'${year.toString().slice(-2)}`;
      labels.push(abbreviatedYear);

      // Calculate years from start for compound growth
      const yearsFromStart = periodStartMonth / 12;

      // Starting average collections (grows with compound of 0% - stays flat per period, but cumulative)
      const startNewPatients = location.startAvg;
      const startPeriodCollections = startNewPatients * periodLength * location.avgRevenue;
      cumulativeStartCollections += startPeriodCollections;
      startAvgData.push(cumulativeStartCollections);

      if (isPast) {
        // Historical data: use actual member average with compound growth
        const growthMultiplier = Math.pow(1 + (annualMemberGrowthRate / 100), yearsFromStart);
        const memberNewPatients = location.startAvg * growthMultiplier;
        const memberPeriodCollections = memberNewPatients * periodLength * location.avgRevenue;
        cumulativeMemberCollections += memberPeriodCollections;
        memberAvgData.push(cumulativeMemberCollections);
        projectedAvgData.push(null); // No projection for past data
        lastMemberValue = cumulativeMemberCollections; // Track last member value
      } else {
        // Future data: use compound growth from current member average
        // Initialize projected from last member value on first future period
        if (cumulativeProjectedCollections === 0) {
          cumulativeProjectedCollections = lastMemberValue;
        }

        const yearsFromNow = (periodStartMonth - monthsToPresent) / 12;
        const currentNewPatients = location.newAvg;
        const growthMultiplier = Math.pow(1 + (growthRate / 100), yearsFromNow);
        const projectedNewPatients = currentNewPatients * growthMultiplier;
        const projectedPeriodCollections = projectedNewPatients * periodLength * location.avgRevenue;

        cumulativeProjectedCollections += projectedPeriodCollections;

        memberAvgData.push(null); // No member data for future
        projectedAvgData.push(cumulativeProjectedCollections);
      }
    }

    return {
      labels,
      startAvgData,
      memberAvgData,
      projectedAvgData,
      actualGrowthRate
    };
  }

  // Calculate aggregated data for all locations
  function calculateAggregateGraphData(growthRate) {
    // Find earliest start date
    const earliestStart = npData.locations.reduce((earliest, loc) => {
      const locDate = new Date(loc.startDate);
      return !earliest || locDate < earliest ? locDate : earliest;
    }, null);

    // Calculate averages across all locations
    const avgStartAvg = npData.locations.reduce((sum, loc) => sum + loc.startAvg, 0) / npData.locations.length;
    const avgNewAvg = npData.locations.reduce((sum, loc) => sum + loc.newAvg, 0) / npData.locations.length;
    const avgRevenue = npData.locations.reduce((sum, loc) => sum + loc.avgRevenue, 0) / npData.locations.length;

    const aggregateLocation = {
      name: "All Locations",
      startAvg: avgStartAvg,
      newAvg: avgNewAvg,
      avgRevenue: avgRevenue,
      startDate: earliestStart.toISOString().split('T')[0]
    };

    return calculateGraphData(aggregateLocation, growthRate);
  }

  // Get graph data for selected location
  function getGraphDataForSelection(locationValue, growthRate) {
    if (locationValue === 'all') {
      return calculateAggregateGraphData(growthRate);
    } else {
      // Find the specific location
      const locationName = getLocationName(locationValue);
      const location = npData.locations.find(loc => loc.name === locationName);

      if (location) {
        return calculateGraphData(location, growthRate);
      } else {
        console.error('Location not found:', locationName);
        return calculateAggregateGraphData(growthRate);
      }
    }
  }

  // Initialize Chart
  function initializeChart() {
    const ctx = document.getElementById('collectionsChart');
    if (!ctx) return;

    // Get initial data to determine actual growth rate
    const initialData = getGraphDataForSelection(currentLocation, 10); // Use temporary value
    const actualGrowthRate = Math.round(initialData.actualGrowthRate);

    // Set current growth rate to actual member growth rate
    if (currentGrowthRate === null) {
      currentGrowthRate = actualGrowthRate;

      // Update the input field
      const growthInput = document.getElementById('growthInput');
      if (growthInput) {
        growthInput.value = currentGrowthRate;
      }
    }

    const graphData = getGraphDataForSelection(currentLocation, currentGrowthRate);

    collectionsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: graphData.labels,
        datasets: [
          {
            label: 'Starting Average',
            data: graphData.startAvgData,
            backgroundColor: '#9e9e9e',
            borderRadius: 0,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            stack: 'stack0'
          },
          {
            label: 'Member Average',
            data: graphData.memberAvgData,
            backgroundColor: '#4caf50',
            borderRadius: 0,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            stack: 'stack1'
          },
          {
            label: 'Projected Average',
            data: graphData.projectedAvgData,
            backgroundColor: '#90caf9',
            borderRadius: 0,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            stack: 'stack1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          x: {
            stacked: false,
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              autoSkip: false,
              font: {
                size: 11,
                weight: 500
              },
              color: '#666',
              padding: 8
            }
          },
          y: {
            stacked: false,
            display: false,
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Update chart with new growth rate or location
  function updateChart(growthRate, locationValue = currentLocation) {
    if (!collectionsChart) return;

    const graphData = getGraphDataForSelection(locationValue, growthRate);

    collectionsChart.data.labels = graphData.labels;
    collectionsChart.data.datasets[0].data = graphData.startAvgData;
    collectionsChart.data.datasets[1].data = graphData.memberAvgData;
    collectionsChart.data.datasets[2].data = graphData.projectedAvgData;

    collectionsChart.update();

    // Update legend percentages
    const memberPercent = document.getElementById('legendMemberPercent');
    const projectedPercent = document.getElementById('legendProjectedPercent');
    const currentGrowthRateSpan = document.getElementById('currentGrowthRate');

    if (memberPercent) {
      memberPercent.textContent = `(+${Math.round(graphData.actualGrowthRate)}%)`;
    }
    if (projectedPercent) {
      projectedPercent.textContent = `(+${growthRate}%)`;
    }
    if (currentGrowthRateSpan) {
      currentGrowthRateSpan.textContent = `${Math.round(graphData.actualGrowthRate)}%`;
    }
  }

  // Growth input handler
  const growthInput = document.getElementById('growthInput');
  if (growthInput) {
    growthInput.addEventListener('input', function() {
      let value = parseFloat(this.value);

      // Prevent negative numbers
      if (value < 0) {
        value = 0;
        this.value = 0;
      }

      currentGrowthRate = Math.max(0, Math.min(100, value || 0)); // Clamp between 0-100

      // Get current data to check actual growth rate
      const graphData = getGraphDataForSelection(currentLocation, currentGrowthRate);
      const actualGrowthRate = Math.round(graphData.actualGrowthRate);

      // Change input color to blue if different from member average
      if (currentGrowthRate !== actualGrowthRate) {
        this.classList.add('input-modified');
      } else {
        this.classList.remove('input-modified');
      }

      updateChart(currentGrowthRate, currentLocation);
    });
  }

  // Location selector handler
  const locationSelect = document.getElementById('locationSelect');
  if (locationSelect) {
    locationSelect.addEventListener('change', function() {
      currentLocation = this.value;
      updateChart(currentGrowthRate, currentLocation);
    });
  }

  // Initialize chart when graph view is first shown
  const originalViewToggleClick = viewToggle.onclick;
  viewToggle.addEventListener('click', function() {
    setTimeout(() => {
      if (currentView === 'graph' && !collectionsChart) {
        initializeChart();
        updateChart(currentGrowthRate);
        initializeTicker();
      }
    }, 300);
  });

  // ============================================
  // TICKER FUNCTIONALITY
  // ============================================

  let isDragging = false;
  let currentTickerIndex = 0;

  function initializeTicker() {
    if (!collectionsChart) return;

    const ticker = document.getElementById('ticker');
    const tickerNub = document.getElementById('tickerNub');
    const tickerHighlight = ticker.querySelector('.ticker-highlight');
    const tickerTooltip = document.getElementById('tickerTooltip');
    const canvas = collectionsChart.canvas;

    if (!ticker || !tickerNub || !canvas) return;

    // Start at current year
    const labels = collectionsChart.data.labels;
    const currentYear = new Date().getFullYear();
    const currentYearLabel = `'${currentYear.toString().slice(-2)}`;
    currentTickerIndex = labels.indexOf(currentYearLabel);
    if (currentTickerIndex === -1) currentTickerIndex = Math.floor(labels.length / 2);

    // Update ticker position
    updateTickerPosition(currentTickerIndex);

    // Drag functionality on nub
    let dragStartX = 0;

    tickerNub.addEventListener('mousedown', function(e) {
      e.preventDefault();
      isDragging = true;
      dragStartX = e.clientX;
      tickerNub.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      // Find nearest bar
      const meta = collectionsChart.getDatasetMeta(0);
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      for (let i = 0; i < labels.length; i++) {
        const barMeta = meta.data[i];
        if (!barMeta) continue;

        const barX = barMeta.x;
        const distance = Math.abs(mouseX - barX);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      if (nearestIndex !== currentTickerIndex) {
        currentTickerIndex = nearestIndex;
        updateTickerPosition(currentTickerIndex);
      }
    });

    document.addEventListener('mouseup', function(e) {
      if (isDragging) {
        isDragging = false;
        tickerNub.style.cursor = 'grab';
      }
    });

    // Click on chart to move ticker
    canvas.addEventListener('click', function(e) {
      if (isDragging) return; // Ignore if we just finished dragging

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;

      // Find nearest bar
      const meta = collectionsChart.getDatasetMeta(0);
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      for (let i = 0; i < labels.length; i++) {
        const barMeta = meta.data[i];
        if (!barMeta) continue;

        const barX = barMeta.x;
        const distance = Math.abs(clickX - barX);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      currentTickerIndex = nearestIndex;
      updateTickerPosition(currentTickerIndex);
    });

    function updateTickerPosition(index) {
      const labels = collectionsChart.data.labels;

      // Get the highest bar at this index (could be from any dataset)
      let highestBarMeta = null;
      let highestValue = 0;

      for (let datasetIndex = 0; datasetIndex < collectionsChart.data.datasets.length; datasetIndex++) {
        const meta = collectionsChart.getDatasetMeta(datasetIndex);
        const value = collectionsChart.data.datasets[datasetIndex].data[index];

        if (value !== null && value > highestValue) {
          highestValue = value;
          highestBarMeta = meta.data[index];
        }
      }

      if (!highestBarMeta) return;

      const barX = highestBarMeta.x;
      const barY = highestBarMeta.y;
      const chartArea = collectionsChart.chartArea;
      const barWidth = highestBarMeta.width || 40;

      // Calculate bar height (from bar top to chart bottom)
      const barHeight = chartArea.bottom - barY;

      // Position highlight centered on bar, with height matching the bar
      tickerHighlight.style.left = `${barX - barWidth / 2}px`;
      tickerHighlight.style.width = `${barWidth}px`;
      tickerHighlight.style.height = `${barHeight}px`;

      // Position nub at the top of the bar
      tickerNub.style.left = `${barX}px`;
      tickerNub.style.top = `${barY}px`;

      // Get values for this index
      const startValue = collectionsChart.data.datasets[0].data[index];
      const memberValue = collectionsChart.data.datasets[1].data[index];
      const projectedValue = collectionsChart.data.datasets[2].data[index];

      // Determine which value to show (member or projected)
      const topValue = projectedValue !== null ? projectedValue : memberValue;
      const bottomValue = startValue;

      // Update tooltip values
      document.getElementById('tickerTopValue').textContent = topValue ? `$${Math.round(topValue).toLocaleString()}` : '$0';
      document.getElementById('tickerBottomValue').textContent = bottomValue ? `$${Math.round(bottomValue).toLocaleString()}` : '$0';

      // Position tooltip above the bar
      const threshold = chartArea.right - 100; // Right edge threshold

      tickerTooltip.style.left = `${barX}px`;

      // Switch between top and left positioning based on horizontal space
      if (barX > threshold) {
        tickerTooltip.classList.remove('position-top');
        tickerTooltip.classList.add('position-left');
        tickerTooltip.style.top = `${barY}px`;
      } else {
        tickerTooltip.classList.remove('position-left');
        tickerTooltip.classList.add('position-top');
        tickerTooltip.style.top = `${barY - 60}px`; // Position above the bar
      }
    }
  }
});
