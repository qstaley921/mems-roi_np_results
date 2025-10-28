// New Patient Results Module
// Handles table data, calculations, and UI interactions

// New Patient Results Data (Monthly base values)
let npData = {
  locations: [
    {
      name: "Bradley Place",
      startAvg: 27,        // Monthly starting average
      newAvg: 35.08,       // Monthly new average
      avgRevenue: 2978,    // Average revenue per new patient
      startDate: "2021-01-01"  // Program start date
    },
    {
      name: "East Lake",
      startAvg: 37.08,
      newAvg: 42.33,
      avgRevenue: 2101,
      startDate: "2021-01-01"
    },
    {
      name: "Fullerton",
      startAvg: 22.92,
      newAvg: 22.08,
      avgRevenue: 2457,
      startDate: "2022-06-01"
    },
    {
      name: "Westside",
      startAvg: 31.5,
      newAvg: 38.75,
      avgRevenue: 2650,
      startDate: "2023-01-01"
    },
    {
      name: "North Point",
      startAvg: 19.25,
      newAvg: 28.5,
      avgRevenue: 2890,
      startDate: "2023-09-01"
    },
    {
      name: "Riverside",
      startAvg: 42.0,
      newAvg: 48.33,
      avgRevenue: 2275,
      startDate: "2024-03-01"
    },
    {
      name: "Downtown",
      startAvg: 35.67,
      newAvg: 41.92,
      avgRevenue: 3100,
      startDate: "2024-09-01"
    }
  ],
  investment: {
    program: 399.08      // Monthly program investment per month
  }
};

// Current selected period
let currentPeriod = 'monthly';
let customYearsValue = 3;

// Calculation functions
function calculateMetrics(period, customYears = 3) {
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
  const totalInvestment = npData.investment.program * multiplier;
  const programInvestment = npData.investment.program * multiplier;
  const totalReturn = results.reduce((sum, loc) => sum + loc.growthTotal, 0);

  return {
    locations: results,
    totalGrowth,
    totalInvestment,
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
      <td class="npi-roi-mod-col-location npi-roi-mod-location-name">${location.name}</td>
      <td class="npi-roi-mod-col-start-avg">
        ${location.startAvg.toLocaleString()}
        <span class="npi-roi-mod-math-operator">△</span>
      </td>
      <td class="npi-roi-mod-col-new-avg">
        ${location.newAvg.toLocaleString()}
        <span class="npi-roi-mod-math-operator">=</span>
      </td>
      <td class="npi-roi-mod-col-growth">
        ${location.growth.toLocaleString()}
        ${location.growthPercent > 0 ? `<span class="npi-roi-mod-growth-percent">(${location.growthPercent}%)</span>` : ''}
        <span class="npi-roi-mod-math-operator">×</span>
      </td>
      <td class="npi-roi-mod-col-revenue">
        $${location.avgRevenue.toLocaleString()}
        <span class="npi-roi-mod-math-operator">=</span>
      </td>
      <td class="npi-roi-mod-col-growth-total npi-roi-mod-growth-total">$${location.growthTotal.toLocaleString()}</td>
    </tr>
  `).join('');

  // Update investment and return cards
  document.getElementById('investmentTotal').textContent = `$${Math.round(metrics.totalInvestment).toLocaleString()}`;
  document.getElementById('investmentPeriod').textContent = metrics.periodLabel;
  // Investment program breakdown always shows fixed monthly cost
  document.getElementById('investmentProgram').textContent = `$${Math.round(npData.investment.program).toLocaleString()}/month`;

  document.getElementById('returnTotal').textContent = `$${Math.round(metrics.totalReturn).toLocaleString()}`;
  document.getElementById('returnPeriod').textContent = metrics.periodLabel;
  document.getElementById('returnGrowth').textContent = metrics.totalGrowth.toLocaleString();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initial table render
  updateTable(currentPeriod);

  // Tab button click handlers
  const tabButtons = document.querySelectorAll('.npi-roi-mod-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      document.querySelectorAll('.npi-roi-mod-tab-btn').forEach(b => b.classList.remove('active'));
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
    document.querySelectorAll('.npi-roi-mod-tab-btn').forEach(b => b.classList.remove('active'));

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
  const toggleBall = viewToggle.querySelector('.npi-roi-mod-toggle-ball');
  const tableView = document.getElementById('tableView');
  const graphView = document.getElementById('graphView');
  const timePeriodTabs = document.querySelector('.npi-roi-mod-time-period-tabs');
  const locationSelectorHeader = document.getElementById('locationSelectorHeader');
  const metricsCards = document.getElementById('metricsCards');
  const footnoteText = document.getElementById('footnoteText');

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
        toggleBall.classList.remove('npi-roi-mod-active-table');
        toggleBall.classList.add('npi-roi-mod-active-graph');
        viewToggle.classList.remove('npi-roi-mod-active-table');
        viewToggle.classList.add('npi-roi-mod-active-graph');

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
          footnoteText.textContent = '*This graph shows average numbers and may not match your exact collections.';
        }

        console.log('Switched to graph view');
      } else {
        // Switch to table
        currentView = 'table';
        toggleBall.classList.remove('npi-roi-mod-active-graph');
        toggleBall.classList.add('npi-roi-mod-active-table');
        viewToggle.classList.remove('npi-roi-mod-active-graph');
        viewToggle.classList.add('npi-roi-mod-active-table');

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
          footnoteText.textContent = '*This table shows average numbers and may not match your exact collections.';
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
  viewToggle.classList.add('npi-roi-mod-active-table');

  // Initialize chart when graph view is shown
  viewToggle.addEventListener('click', function() {
    setTimeout(() => {
      if (currentView === 'graph' && !collectionsChart) {
        initializeChart();
      }
    }, 300);
  });

  // Initialize data selector
  initializeDataSelector();
});

// ============================================
// SIMPLIFIED GRAPH FUNCTIONALITY
// ============================================

let collectionsChart = null;
let currentView = 'table'; // Track current view (table or graph)
let currentMonthlyAverage = 49; // Default current average (will be set from selected location)
let adjustedMonthlyAverage = 49; // User's adjusted value
let defaultAdjustedAverage = 49; // Default +10% value (will be set from current average)

// Get current average from selected location
function getCurrentAverageFromLocation() {
  const locationSelect = document.getElementById('locationSelect');
  const selectedValue = locationSelect ? locationSelect.value : 'north-point';

  // If "all locations" selected, sum all location averages
  if (selectedValue === 'all') {
    return npData.locations.reduce((sum, loc) => sum + loc.newAvg, 0);
  }

  // Find the specific location
  const location = npData.locations.find(loc =>
    loc.name.toLowerCase().replace(/\s+/g, '-') === selectedValue
  );

  return location ? location.newAvg : 49;
}

// Calculate simple graph data (cumulative)
function calculateSimpleGraphData(adjustedAvg) {
  const currentYear = new Date().getFullYear();
  const years = 11; // Current year + 10 years

  const labels = [];
  const currentAvgData = [];
  const adjustedAvgData = [];

  // Get current average from location
  const currentAvg = currentMonthlyAverage;

  // Cumulative totals
  let cumulativeCurrent = 0;
  let cumulativeAdjusted = 0;

  for (let i = 0; i < years; i++) {
    const year = currentYear + i;
    labels.push(year.toString());

    // Annual collections: monthly average × 12 months × revenue
    const currentAnnualCollections = currentAvg * 12 * npData.locations[0].avgRevenue;
    const adjustedAnnualCollections = adjustedAvg * 12 * npData.locations[0].avgRevenue;

    // Add to cumulative totals
    cumulativeCurrent += currentAnnualCollections;
    cumulativeAdjusted += adjustedAnnualCollections;

    currentAvgData.push(cumulativeCurrent);
    adjustedAvgData.push(cumulativeAdjusted);
  }

  // Determine if we're in red state (adjusted < current)
  const isDecrease = adjustedAvg < currentAvg;
  const adjustedColor = isDecrease ? '#f44336' : '#4caf50';

  return {
    labels,
    currentAvgData,
    adjustedAvgData,
    adjustedColor,
    isDecrease,
    currentAvg,
    adjustedAvg
  };
}

// Initialize Chart
function initializeChart() {
  const ctx = document.getElementById('collectionsChart');
  if (!ctx) return;

  // Get current average from selected location
  currentMonthlyAverage = getCurrentAverageFromLocation();

  // Set default adjusted value to current + 10%, rounded up
  defaultAdjustedAverage = Math.ceil(currentMonthlyAverage * 1.1);
  adjustedMonthlyAverage = defaultAdjustedAverage;

  // Set input to adjusted average (current + 10%)
  const growthInput = document.getElementById('growthInput');
  if (growthInput) {
    growthInput.value = adjustedMonthlyAverage;
  }

  // Hide reset button initially (starts at default)
  updateResetButtonVisibility(adjustedMonthlyAverage);

  // Update subtitle (initial year = 1)
  updateSubtitle(currentMonthlyAverage, adjustedMonthlyAverage, 1);

  const graphData = calculateSimpleGraphData(adjustedMonthlyAverage);

  collectionsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: graphData.labels,
      datasets: [
        {
          label: 'Current avg.',
          data: graphData.currentAvgData,
          backgroundColor: '#9e9e9e',
          borderRadius: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9
        },
        {
          label: 'Adjusted avg.',
          data: graphData.adjustedAvgData,
          backgroundColor: graphData.adjustedColor,
          borderRadius: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
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
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11,
              weight: function(context) {
                return context.index === 0 ? 700 : 500;
              }
            },
            color: function(context) {
              return context.index === 0 ? '#000000' : '#666';
            }
          }
        },
        y: {
          display: false,
          beginAtZero: true
        }
      }
    }
  });

  // Initialize ticker
  initializeTicker();
}

// Update chart with new adjusted value
function updateChart(newAdjustedAvg) {
  if (!collectionsChart) return;

  adjustedMonthlyAverage = newAdjustedAvg;
  const graphData = calculateSimpleGraphData(newAdjustedAvg);

  // Update dataset
  collectionsChart.data.datasets[1].data = graphData.adjustedAvgData;
  collectionsChart.data.datasets[1].backgroundColor = graphData.adjustedColor;

  // Update legend color
  const legendAdjustedColor = document.getElementById('legendAdjustedColor');
  if (legendAdjustedColor) {
    legendAdjustedColor.style.backgroundColor = graphData.adjustedColor;
  }

  // Update input styling
  const growthInput = document.getElementById('growthInput');
  if (growthInput) {
    growthInput.classList.remove('npi-roi-mod-input-neutral', 'npi-roi-mod-input-decrease');
    if (newAdjustedAvg === currentMonthlyAverage) {
      // No change - gray
      growthInput.classList.add('npi-roi-mod-input-neutral');
    } else if (graphData.isDecrease) {
      // Decrease - red
      growthInput.classList.add('npi-roi-mod-input-decrease');
    }
    // Else: positive change - default green (no class needed)
  }

  // Update reset button visibility
  updateResetButtonVisibility(newAdjustedAvg);

  collectionsChart.update('none');

  // Update ticker display (which will also update subtitle with correct years)
  if (typeof updateTickerDisplayFn === 'function') {
    updateTickerDisplayFn(currentTickerIndex);
  }
}

// Update reset button visibility based on whether value differs from default
function updateResetButtonVisibility(currentValue) {
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    if (currentValue === defaultAdjustedAverage) {
      resetBtn.style.display = 'none';
    } else {
      resetBtn.style.display = 'inline-block';
    }
  }
}

// Update subtitle text
function updateSubtitle(currentAvg, adjustedAvg, yearsElapsed = 1) {
  const currentAvgSpan = document.getElementById('currentAverage');
  const adjustedAvgSpan = document.getElementById('adjustedAverage');
  const percentChangeSpan = document.getElementById('percentChange');

  if (currentAvgSpan) currentAvgSpan.textContent = Math.round(currentAvg);
  if (adjustedAvgSpan) adjustedAvgSpan.textContent = Math.round(adjustedAvg);

  if (percentChangeSpan) {
    const percentChange = ((adjustedAvg - currentAvg) / currentAvg) * 100;
    const isDecrease = percentChange < 0;
    // Check both exact equality AND rounded equality
    const isNoChange = adjustedAvg === currentAvg || Math.round(adjustedAvg) === Math.round(currentAvg);
    const absPercent = Math.abs(Math.round(percentChange));

    percentChangeSpan.textContent = `${absPercent}%`;

    // Calculate collections difference based on years elapsed (cumulative)
    const revenue = npData.locations[0].avgRevenue;
    const currentAnnualCollections = currentAvg * 12 * revenue;
    const adjustedAnnualCollections = adjustedAvg * 12 * revenue;

    // Cumulative collections for the selected year
    let cumulativeCurrentCollections = 0;
    let cumulativeAdjustedCollections = 0;
    for (let i = 0; i < yearsElapsed; i++) {
      cumulativeCurrentCollections += currentAnnualCollections;
      cumulativeAdjustedCollections += adjustedAnnualCollections;
    }

    const collectionsDifference = cumulativeAdjustedCollections - cumulativeCurrentCollections;
    const absCollectionsDiff = Math.abs(Math.round(collectionsDifference));

    // Determine color and text
    let changeColor, changeText, collectionText;
    if (isNoChange) {
      changeColor = '#9e9e9e';
      changeText = 'change';
      collectionText = '';
    } else if (isDecrease) {
      changeColor = '#f44336';
      changeText = 'decrease';
      collectionText = `, creating <span style="color: ${changeColor}">-$${absCollectionsDiff.toLocaleString()}</span> in lost collections`;
    } else {
      changeColor = '#4caf50';
      changeText = 'increase';
      collectionText = `, creating <span style="color: ${changeColor}">$${absCollectionsDiff.toLocaleString()}</span> in added collections`;
    }

    percentChangeSpan.style.color = changeColor;

    // Determine article (a vs an) based on percentage
    const percentStr = absPercent.toString();
    const article = (percentStr.startsWith('8') || percentStr.startsWith('18')) ? 'an' : 'a';

    // Update subtitle
    const subtitleText = document.querySelector('.npi-roi-mod-graph-subtitle');
    if (subtitleText) {
      subtitleText.innerHTML = `<span id="currentAverage">${Math.round(currentAvg)}</span> is the current average. <span id="adjustedAverage">${Math.round(adjustedAvg)}</span> is ${article} <span id="percentChange" style="color: ${changeColor}">${absPercent}%</span> ${changeText}${collectionText}.`;
    }
  }
}

// Initialize ticker functionality
let currentTickerIndex = 0;
let updateTickerDisplayFn = null;

function initializeTicker() {
  const tickerDisplay = document.getElementById('tickerDisplay');
  const canvas = collectionsChart.canvas;

  if (!tickerDisplay || !canvas) return;

  // Position ticker display
  function positionTickerDisplay() {
    const graphHeader = document.querySelector('.npi-roi-mod-graph-header');
    if (graphHeader) {
      const headerHeight = graphHeader.offsetHeight;
      tickerDisplay.style.top = `${headerHeight + 10}px`;
    }
  }

  setTimeout(() => {
    positionTickerDisplay();
  }, 100);

  window.addEventListener('resize', positionTickerDisplay);

  // Set initial ticker to first year (current year)
  currentTickerIndex = 0;

  // Update ticker display
  updateTickerDisplayFn = function(index) {
    const graphData = calculateSimpleGraphData(adjustedMonthlyAverage);

    if (index < 0 || index >= graphData.labels.length) return;

    const year = graphData.labels[index];
    const adjustedValue = graphData.adjustedAvgData[index];
    const currentValue = graphData.currentAvgData[index];
    const yearsElapsed = index + 1; // Years from start (1-based)

    // Update year
    document.getElementById('tickerDisplayYear').textContent = year;

    // Update labels with detailed descriptions
    const adjustedLabel = document.getElementById('tickerDisplayAdjustedLabel');
    const currentLabel = document.getElementById('tickerDisplayCurrentLabel');

    if (adjustedLabel) {
      adjustedLabel.textContent = `Collections at ${Math.round(adjustedMonthlyAverage)}/month for ${yearsElapsed} Year${yearsElapsed > 1 ? 's' : ''}`;
    }
    if (currentLabel) {
      currentLabel.textContent = `Collections at ${Math.round(currentMonthlyAverage)}/month for ${yearsElapsed} Year${yearsElapsed > 1 ? 's' : ''}`;
    }

    // Update values with colors
    const adjustedValueElement = document.getElementById('tickerDisplayAdjustedValue');
    const currentValueElement = document.getElementById('tickerDisplayCurrentValue');

    if (adjustedValueElement) {
      adjustedValueElement.textContent = '$' + Math.round(adjustedValue).toLocaleString();
      adjustedValueElement.style.color = graphData.isDecrease ? '#f44336' : '#4caf50';
    }

    if (currentValueElement) {
      currentValueElement.textContent = '$' + Math.round(currentValue).toLocaleString();
      currentValueElement.style.color = '#666666';
    }

    // Update ticker display background
    tickerDisplay.classList.remove('npi-roi-mod-is-member', 'npi-roi-mod-is-projected');
    if (graphData.isDecrease) {
      tickerDisplay.style.background = 'linear-gradient(135deg, #ffcdd2 0%, #ffebee 100%)';
    } else {
      tickerDisplay.classList.add('npi-roi-mod-is-member');
      tickerDisplay.style.background = '';
    }

    // Update bar opacity - set active group to 100%, others to 25%
    const dataset0 = collectionsChart.data.datasets[0];
    const dataset1 = collectionsChart.data.datasets[1];

    // Update dataset colors with opacity
    dataset0.backgroundColor = graphData.labels.map((_, i) =>
      i === index ? 'rgba(158, 158, 158, 1)' : 'rgba(158, 158, 158, 0.25)'
    );

    const adjustedColorRGB = graphData.isDecrease ? '244, 67, 54' : '76, 175, 80';
    dataset1.backgroundColor = graphData.labels.map((_, i) =>
      i === index ? `rgba(${adjustedColorRGB}, 1)` : `rgba(${adjustedColorRGB}, 0.25)`
    );

    // Update subtitle with years elapsed
    updateSubtitle(currentMonthlyAverage, adjustedMonthlyAverage, yearsElapsed);

    collectionsChart.update('none');
  };

  // Click handler for bars
  canvas.addEventListener('click', function(e) {
    const points = collectionsChart.getElementsAtEventForMode(e, 'index', { intersect: false }, false);
    if (points.length > 0) {
      const clickedIndex = points[0].index;
      if (clickedIndex !== currentTickerIndex) {
        currentTickerIndex = clickedIndex;
        updateTickerDisplayFn(currentTickerIndex);
      }
    }
  });

  // Initial display
  updateTickerDisplayFn(currentTickerIndex);
}

// Growth input handler
const growthInput = document.getElementById('growthInput');
if (growthInput) {
  growthInput.addEventListener('input', function() {
    const value = parseInt(this.value) || 0;
    updateChart(value);
  });
}

// Reset button handler
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', function() {
    growthInput.value = defaultAdjustedAverage;
    updateChart(defaultAdjustedAverage);
  });
}

// Location selector change handler
const locationSelect = document.getElementById('locationSelect');
if (locationSelect) {
  locationSelect.addEventListener('change', function() {
    if (!collectionsChart) return; // Only handle if chart is initialized

    // Recalculate current average from new location
    currentMonthlyAverage = getCurrentAverageFromLocation();

    // Recalculate default adjusted value (current + 10%, rounded up)
    defaultAdjustedAverage = Math.ceil(currentMonthlyAverage * 1.1);
    adjustedMonthlyAverage = defaultAdjustedAverage;

    // Update input value
    if (growthInput) {
      growthInput.value = defaultAdjustedAverage;
    }

    // Recalculate graph data
    const graphData = calculateSimpleGraphData(adjustedMonthlyAverage);

    // Update chart datasets
    collectionsChart.data.datasets[0].data = graphData.currentAvgData;
    collectionsChart.data.datasets[1].data = graphData.adjustedAvgData;
    collectionsChart.data.datasets[1].backgroundColor = graphData.adjustedColor;

    // Update legend color
    const legendAdjustedColor = document.getElementById('legendAdjustedColor');
    if (legendAdjustedColor) {
      legendAdjustedColor.style.backgroundColor = graphData.adjustedColor;
    }

    // Update input styling
    if (growthInput) {
      growthInput.classList.remove('npi-roi-mod-input-neutral', 'npi-roi-mod-input-decrease');
      // New default is always increase, so no special class
    }

    // Update reset button visibility (should be hidden at default)
    updateResetButtonVisibility(adjustedMonthlyAverage);

    // Reset to first year
    currentTickerIndex = 0;

    // Update ticker display and subtitle
    if (typeof updateTickerDisplayFn === 'function') {
      updateTickerDisplayFn(currentTickerIndex);
    }

    collectionsChart.update();
  });
}

// ============================================
// DATA SELECTOR FUNCTIONALITY
// ============================================

// Initialize data selector buttons
function initializeDataSelector() {
  const dataSelectorButtons = document.querySelectorAll('.npi-roi-mod-data-selector-btn');
  if (!dataSelectorButtons.length) return;

  // Check if sampleDataSets is available
  if (typeof sampleDataSets === 'undefined') {
    console.warn('Sample data not loaded');
    return;
  }

  // Load data for the active button on page load
  const activeButton = document.querySelector('.npi-roi-mod-data-selector-btn.active');
  if (activeButton) {
    const doctorName = activeButton.dataset.doctor;
    loadDoctorData(doctorName);
  }

  // Add click handlers to all buttons
  dataSelectorButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      dataSelectorButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Load selected doctor's data
      const doctorName = this.dataset.doctor;
      loadDoctorData(doctorName);
    });
  });
}

// Load data for selected doctor
function loadDoctorData(doctorName) {
  if (typeof sampleDataSets === 'undefined' || !sampleDataSets[doctorName]) {
    console.error('Doctor data not found:', doctorName);
    return;
  }

  // Update npData with selected doctor's data
  npData.locations = sampleDataSets[doctorName].locations;
  npData.investment = sampleDataSets[doctorName].investment;

  // Recalculate and update the display
  updateTable(currentPeriod);

  // If graph is visible, reinitialize it with new data
  if (currentView === 'graph' && collectionsChart) {
    // Reset chart
    collectionsChart.destroy();
    collectionsChart = null;
    initializeChart();
  }
}