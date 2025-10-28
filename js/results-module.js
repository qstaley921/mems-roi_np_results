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
  let currentGrowthRate = 10; // Default growth rate percentage

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
    endDate.setFullYear(endDate.getFullYear() + 10); // Add 10 years to current date

    // Calculate total months in timeline
    const totalMonths = getMonthsBetween(startDate, endDate);
    const monthsToPresent = getMonthsBetween(startDate, today);

    // Determine if we use quarters or years based on total years
    const totalYears = totalMonths / 12;
    const useQuarters = totalYears <= 15; // Use quarters if 15 years or less

    // Generate time periods
    const periods = [];
    const periodLength = useQuarters ? 3 : 12; // 3 months for quarters, 12 for years
    const periodCount = Math.ceil(totalMonths / periodLength);

    // Calculate actual member growth rate (from start to present)
    const actualGrowthRate = location.startAvg > 0
      ? ((location.newAvg - location.startAvg) / location.startAvg) * 100
      : 0;

    // Generate data for each period
    const startAvgData = [];
    const memberAvgData = [];
    const projectedAvgData = [];
    const labels = [];

    for (let i = 0; i <= periodCount; i++) {
      const periodStartMonth = i * periodLength;
      const periodDate = addMonths(startDate, periodStartMonth);
      const isPast = periodDate <= today;

      // Generate label
      if (useQuarters) {
        const quarter = Math.floor((periodDate.getMonth()) / 3) + 1;
        const year = periodDate.getFullYear();
        labels.push(`Q${quarter} ${year}`);
      } else {
        labels.push(periodDate.getFullYear().toString());
      }

      // Starting average collections (always flat)
      const startCollections = location.startAvg * periodLength * location.avgRevenue;
      startAvgData.push(startCollections);

      if (isPast) {
        // Historical data: use actual member average
        const memberCollections = location.newAvg * periodLength * location.avgRevenue;
        memberAvgData.push(memberCollections);
        projectedAvgData.push(null); // No projection for past data
      } else {
        // Future data: use compound growth from current member average
        const yearsFromNow = (periodStartMonth - monthsToPresent) / 12;
        const growthMultiplier = Math.pow(1 + (growthRate / 100), yearsFromNow);
        const projectedNewPatients = location.newAvg * growthMultiplier;
        const projectedCollections = projectedNewPatients * periodLength * location.avgRevenue;

        memberAvgData.push(null); // No member data for future
        projectedAvgData.push(projectedCollections);
      }
    }

    return {
      labels,
      startAvgData,
      memberAvgData,
      projectedAvgData,
      actualGrowthRate,
      useQuarters
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

  // Initialize Chart
  function initializeChart() {
    const ctx = document.getElementById('collectionsChart');
    if (!ctx) return;

    const graphData = calculateAggregateGraphData(currentGrowthRate);

    collectionsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: graphData.labels,
        datasets: [
          {
            label: 'Starting Average',
            data: graphData.startAvgData,
            backgroundColor: '#9e9e9e',
            borderRadius: 4,
            barThickness: 'flex',
            maxBarThickness: 40
          },
          {
            label: 'Member Average',
            data: graphData.memberAvgData,
            backgroundColor: '#4caf50',
            borderRadius: 4,
            barThickness: 'flex',
            maxBarThickness: 40
          },
          {
            label: 'Projected Average',
            data: graphData.projectedAvgData,
            backgroundColor: '#81c784',
            borderRadius: 4,
            barThickness: 'flex',
            maxBarThickness: 40
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
            backgroundColor: '#2d2d2d',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#4caf50',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += '$' + context.parsed.y.toLocaleString();
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: 10
              }
            }
          },
          y: {
            display: false,
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Update chart with new growth rate
  function updateChart(growthRate) {
    if (!collectionsChart) return;

    const graphData = calculateAggregateGraphData(growthRate);

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
      const value = parseFloat(this.value) || 0;
      currentGrowthRate = Math.max(0, Math.min(100, value)); // Clamp between 0-100
      updateChart(currentGrowthRate);
    });
  }

  // Initialize chart when graph view is first shown
  const originalViewToggleClick = viewToggle.onclick;
  viewToggle.addEventListener('click', function() {
    setTimeout(() => {
      if (currentView === 'graph' && !collectionsChart) {
        initializeChart();
        updateChart(currentGrowthRate);
      }
    }, 300);
  });
});
