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
      durationMonths: 36   // Total months with company
    },
    {
      name: "East Lake",
      startAvg: 37.08,
      newAvg: 42.33,
      avgRevenue: 2101,
      durationMonths: 36
    },
    {
      name: "Fullerton",
      startAvg: 22.92,
      newAvg: 22.08,
      avgRevenue: 2457,
      durationMonths: 36
    }
  ],
  investment: {
    training: 816.5,     // Monthly training investment
    program: 399.08      // Monthly program investment
  }
};

// Current selected period
let currentPeriod = 'yearly';
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
      <td class="col-start-avg">${location.startAvg.toLocaleString()}</td>
      <td class="col-new-avg">${location.newAvg.toLocaleString()}</td>
      <td class="col-growth">
        ${location.growth.toLocaleString()}
        ${location.growthPercent > 0 ? `<span class="growth-percent">(${location.growthPercent}%)</span>` : ''}
      </td>
      <td class="col-revenue">$${location.avgRevenue.toLocaleString()}</td>
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
  const tabButtons = document.querySelectorAll('.tab-btn:not(.tab-btn-custom)');
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

  // Custom years dropdown handler
  const customBtn = document.querySelector('.tab-btn-custom');
  const customDropdown = document.querySelector('.custom-dropdown');
  const dropdownValue = document.getElementById('dropdownValue');
  const dropdownOptions = document.getElementById('dropdownOptions');
  const dropdownOptionElements = document.querySelectorAll('.dropdown-option');

  // Toggle dropdown
  customDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('open');
    dropdownOptions.classList.toggle('show');
  });

  // Handle option selection
  dropdownOptionElements.forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      const value = parseInt(this.dataset.value);

      // Update the displayed value
      dropdownValue.textContent = value;
      customYearsValue = value;

      // Update selected state
      dropdownOptionElements.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');

      // Close dropdown
      customDropdown.classList.remove('open');
      dropdownOptions.classList.remove('show');

      // Activate the custom button and update table
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      customBtn.classList.add('active');
      currentPeriod = 'custom';
      updateTable(currentPeriod, customYearsValue);
    });
  });

  // Custom button click (outside dropdown)
  customBtn.addEventListener('click', function(e) {
    // Only trigger if not clicking dropdown
    if (!customDropdown.contains(e.target)) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentPeriod = 'custom';
      updateTable(currentPeriod, customYearsValue);
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!customDropdown.contains(e.target)) {
      customDropdown.classList.remove('open');
      dropdownOptions.classList.remove('show');
    }
  });

  // Set initial selected option
  dropdownOptionElements.forEach(option => {
    if (parseInt(option.dataset.value) === customYearsValue) {
      option.classList.add('selected');
    }
  });

  // View toggle handler
  const viewToggle = document.getElementById('viewToggle');
  const toggleBall = viewToggle.querySelector('.toggle-ball');
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

        // TODO: Show graph view, hide table view
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

        // TODO: Show table view, hide graph view
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
});
