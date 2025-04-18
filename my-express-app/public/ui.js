// This is the frontend code that would communicate with your backend
// In a real implementation, you would replace the mockData with API calls

// Mock data structure - Replace with actual API endpoints
const apiEndpoints = {
    getSpots: '/api/spots',    // This would be your backend endpoint for getting all spots
    getLabStats: '/api/labs',  // This would be your backend endpoint for lab summaries
  };
  
  // Sample data - In a real app, this would come from API
  const mockData = {
    labs: {
      norman: {
        name: "Norman Lab",
        color: "norman",
        totalSpots: 15,
        occupiedSpots: 12
      },
      satoshi: {
        name: "Satoshi Lab",
        color: "satoshi",
        totalSpots: 15,
        occupiedSpots: 9
      },
      pausch: {
        name: "Pausch Lab",
        color: "pausch",
        totalSpots: 15,
        occupiedSpots: 6
      },
      mccarthy: {
        name: "McCarthy Lab",
        color: "mccarthy",
        totalSpots: 15,
        occupiedSpots: 11
      }
    },
    spots: []
  };
  
  // Generate mock spot data
  function generateMockSpots() {
    let spots = [];
    const labKeys = Object.keys(mockData.labs);
    
    for (let i = 1; i <= 60; i++) {
      // Distribute spots evenly among labs
      const labKey = labKeys[Math.floor((i-1) / 15)];
      const lab = mockData.labs[labKey];
      // Set some spots as occupied based on the lab's occupiedSpots count
      const isOccupied = (i % 15) <= lab.occupiedSpots;
      
      spots.push({
        id: `S${i.toString().padStart(2, '0')}`,
        lab: labKey,
        isOccupied: isOccupied,
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 8640000)).toLocaleTimeString()
      });
    }
    
    return spots;
  }
  
  // Initialize mock data
  mockData.spots = generateMockSpots();
  
  // Function to simulate data fetching from backend
  async function fetchData() {
    try {
      // Show loading state
      document.getElementById('loader').style.display = 'inline-block';
      document.getElementById('connectionStatus').textContent = 'Updating...';
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, you would use fetch to get data from your API:
      // const spotsResponse = await fetch(apiEndpoints.getSpots);
      // const spots = await spotsResponse.json();
      // const labsResponse = await fetch(apiEndpoints.getLabStats);
      // const labs = await labsResponse.json();
      
      // For now, we'll just use our mock data
      // Simulate some changes to data on refresh
      mockData.labs.norman.occupiedSpots = Math.floor(Math.random() * 5) + 10; // Random between 10-14
      mockData.labs.satoshi.occupiedSpots = Math.floor(Math.random() * 6) + 7; // Random between 7-12
      mockData.labs.pausch.occupiedSpots = Math.floor(Math.random() * 6) + 4; // Random between 4-9
      mockData.labs.mccarthy.occupiedSpots = Math.floor(Math.random() * 5) + 8; // Random between 8-12
      
      // Regenerate spots based on new occupancy data
      mockData.spots = generateMockSpots();
      
      // Update UI with the new data
      renderLabSummary(mockData.labs);
      
      // Apply current filters
      const activeStatusFilter = document.querySelector('.filter-btn.active').dataset.filter;
      const activeLabFilter = document.querySelector('.lab-filter-btn.active').dataset.lab;
      filterSpots(activeStatusFilter, activeLabFilter);
      
      // Update timestamp
      const now = new Date();
      document.getElementById('timestamp').textContent = now.toLocaleString();
      
      // Show connected state
      document.getElementById('connectionStatus').textContent = 'Connected';
      
      return true;
    } catch (error) {
      // Handle error
      console.error('Error fetching data:', error);
      document.getElementById('connectionStatus').textContent = 'Connection Error';
      return false;
    } finally {
      // Hide loading indicator
      document.getElementById('loader').style.display = 'none';
    }
  }
  
  // Function to render spots
  function renderSpots(spotsToRender) {
    const spotsContainer = document.getElementById('spotsContainer');
    spotsContainer.innerHTML = '';
    
    spotsToRender.forEach(spot => {
      const spotElement = document.createElement('div');
      spotElement.className = `spot ${spot.lab}`;
      spotElement.dataset.status = spot.isOccupied ? 'occupied' : 'available';
      spotElement.dataset.lab = spot.lab;
      
      spotElement.innerHTML = `
        <div class="spot-header">
          <div class="spot-id">${spot.id}</div>
          <div class="spot-status ${spot.isOccupied ? 'occupied' : 'available'}"></div>
        </div>
        <div class="spot-details">
          <div>Status: <strong>${spot.isOccupied ? 'Occupied' : 'Available'}</strong></div>
          <div>Last update: ${spot.lastUpdated}</div>
          <div class="spot-lab tag-${spot.lab}">${mockData.labs[spot.lab].name}</div>
        </div>
      `;
      
      spotsContainer.appendChild(spotElement);
    });
  }
  
  // Function to render lab summary
  function renderLabSummary(labs) {
    const summaryContainer = document.getElementById('labSummary');
    summaryContainer.innerHTML = '';
    
    Object.keys(labs).forEach(labKey => {
      const lab = labs[labKey];
      const labTotalSpots = 15; // Fixed at 15 spots per lab as specified
      
      const labElement = document.createElement('div');
      labElement.className = `lab-card ${lab.color}`;
      
      const occupancyRate = (lab.occupiedSpots / labTotalSpots) * 100;
      
      labElement.innerHTML = `
        <h3>${lab.name}</h3>
        <div class="lab-stats">
          <div>Total Spots: ${labTotalSpots}</div>
          <div>Occupied: ${lab.occupiedSpots}</div>
        </div>
        <div class="lab-stats">
          <div>Available: ${labTotalSpots - lab.occupiedSpots}</div>
          <div>${Math.round(occupancyRate)}% Full</div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill fill-${lab.color}" style="width: ${occupancyRate}%"></div>
        </div>
      `;
      
      summaryContainer.appendChild(labElement);
    });
  }
  
  // Function to filter spots by status and lab
  function filterSpots(statusFilter, labFilter) {
    let filteredSpots = [...mockData.spots];
    
    // Apply status filter
    if (statusFilter === 'available') {
      filteredSpots = filteredSpots.filter(spot => !spot.isOccupied);
    } else if (statusFilter === 'occupied') {
      filteredSpots = filteredSpots.filter(spot => spot.isOccupied);
    }
    
    // Apply lab filter
    if (labFilter !== 'all') {
      filteredSpots = filteredSpots.filter(spot => spot.lab === labFilter);
    }
    
    // Apply search filter if exists
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
      filteredSpots = filteredSpots.filter(spot => 
        spot.id.toLowerCase().includes(searchTerm) || 
        mockData.labs[spot.lab].name.toLowerCase().includes(searchTerm)
      );
    }
    
    renderSpots(filteredSpots);
  }
  
  // Set up event listeners for status filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const activeLabFilter = document.querySelector('.lab-filter-btn.active').dataset.lab;
      filterSpots(this.dataset.filter, activeLabFilter);
    });
  });
  
  // Set up event listeners for lab filter buttons
  document.querySelectorAll('.lab-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.lab-filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const activeStatusFilter = document.querySelector('.filter-btn.active').dataset.filter;
      filterSpots(activeStatusFilter, this.dataset.lab);
    });
  });
  
  // Set up search functionality
  document.getElementById('searchInput').addEventListener('input', function() {
    const activeStatusFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const activeLabFilter = document.querySelector('.lab-filter-btn.active').dataset.lab;
    filterSpots(activeStatusFilter, activeLabFilter);
  });
  
  // Set up refresh button
  document.getElementById('refreshButton').addEventListener('click', async function() {
    const success = await fetchData();
    if (success) {
      // Visual feedback for successful refresh
      this.textContent = "Data Updated";
      setTimeout(() => {
        this.textContent = "Refresh Data";
      }, 2000);
    }
  });
  
  // Set up auto refresh every 30 seconds
  const autoRefreshInterval = 30000; // 30 seconds
  setInterval(fetchData, autoRefreshInterval);
  
  // Initialize the page
  window.addEventListener('load', async () => {
    await fetchData();
  });
  
  // Initial display
  renderLabSummary(mockData.labs);
  renderSpots(mockData.spots);




// public/ui.js

const socket = new WebSocket(`ws://${window.location.host}`);
const spotsContainer = document.getElementById("spotsContainer");
const connectionStatus = document.getElementById("connectionStatus");
const loader = document.getElementById("loader");
const timestamp = document.getElementById("timestamp");
const refreshButton = document.getElementById("refreshButton");
const searchInput = document.getElementById("searchInput");
const labSummaryContainer = document.getElementById("labSummary");

let allSpots = [];

// Update timestamp
function updateTimestamp() {
  const now = new Date();
  timestamp.textContent = now.toLocaleString();
}

// Create spot card
function createSpotCard(spot) {
  const div = document.createElement("div");
  div.classList.add("spot-card", spot.status);
  div.innerHTML = `
    <h4>${spot.seatId}</h4>
    <p>Status: ${spot.status}</p>
    <p>Last Updated: ${new Date(spot.lastUpdated).toLocaleTimeString()}</p>
  `;
  return div;
}

// Render all visible spots
function renderSpots(spots) {
  spotsContainer.innerHTML = "";
  spots.forEach(spot => {
    spotsContainer.appendChild(createSpotCard(spot));
  });
}

// Render lab summary
function renderLabSummary(spots) {
  const labs = {
    Norman: 0,
    Satoshi: 0,
    Pausch: 0,
    McCarthy: 0
  };

  const occupied = {
    Norman: 0,
    Satoshi: 0,
    Pausch: 0,
    McCarthy: 0
  };

  spots.forEach(spot => {
    const name = spot.seatId.toLowerCase();
    if (name.includes("norman")) labs.Norman++, occupied.Norman += spot.status === 'occupied';
    if (name.includes("satoshi")) labs.Satoshi++, occupied.Satoshi += spot.status === 'occupied';
    if (name.includes("pausch")) labs.Pausch++, occupied.Pausch += spot.status === 'occupied';
    if (name.includes("mccarthy")) labs.McCarthy++, occupied.McCarthy += spot.status === 'occupied';
  });

  labSummaryContainer.innerHTML = "";

  Object.keys(labs).forEach(lab => {
    const total = labs[lab];
    const occ = occupied[lab];
    const free = total - occ;

    const labDiv = document.createElement("div");
    labDiv.classList.add("lab-summary-card");
    labDiv.innerHTML = `
      <h3>${lab} Lab</h3>
      <p>Total Spots: ${total}</p>
      <p>Occupied: ${occ}</p>
      <p>Available: ${free}</p>
    `;
    labSummaryContainer.appendChild(labDiv);
  });
}

// Filter spots by status
function filterSpots() {
  const status = document.querySelector(".filter-btn.active").dataset.filter;
  const lab = document.querySelector(".lab-filter-btn.active").dataset.lab;
  const keyword = searchInput.value.toLowerCase();

  let filtered = allSpots;

  if (status !== "all") {
    filtered = filtered.filter(spot => spot.status === status);
  }

  if (lab !== "all") {
    filtered = filtered.filter(spot => spot.seatId.toLowerCase().includes(lab));
  }

  if (keyword) {
    filtered = filtered.filter(spot => spot.seatId.toLowerCase().includes(keyword));
  }

  renderSpots(filtered);
  renderLabSummary(filtered);
}

// Event listeners for filters
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterSpots();
  });
});

document.querySelectorAll(".lab-filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".lab-filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterSpots();
  });
});

searchInput.addEventListener("input", filterSpots);

// Refresh button manually triggers visit POST and update
refreshButton.addEventListener("click", async () => {
  try {
    loader.style.display = "inline-block";
    const res = await fetch("/api/visit", { method: "POST" });
    if (res.ok) {
      updateTimestamp();
    }
  } catch (e) {
    alert("Failed to refresh.");
  } finally {
    loader.style.display = "none";
  }
});

// WebSocket handling
socket.onopen = () => {
  connectionStatus.textContent = "Connected";
  connectionStatus.style.color = "green";
};

socket.onclose = () => {
  connectionStatus.textContent = "Disconnected";
  connectionStatus.style.color = "red";
};

socket.onerror = () => {
  connectionStatus.textContent = "Error";
  connectionStatus.style.color = "orange";
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "update") {
    allSpots = data.spots;
    updateTimestamp();
    filterSpots();
  }
};
