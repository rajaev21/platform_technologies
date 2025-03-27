let map;
let drawnItems = new L.FeatureGroup();
let locations = [];

function initMap() {
    map = L.map('map').setView([51.505, -0.09], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);
    
    const drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);
    
    map.addLayer(drawnItems);
    
    map.on('draw:created', function(event) {
        const layer = event.layer;
        drawnItems.addLayer(layer);
    });
}

function addMarker(latlng, name) {
    const marker = L.marker(latlng).addTo(map);
    marker.bindPopup(name).openPopup();
    locations.push({ name, marker });
    updateChecklist();
}

function updateChecklist() {
    const checklist = document.getElementById('checklist');
    checklist.innerHTML = '';

    locations.forEach((location, index) => {
        const li = document.createElement('li');
        li.textContent = location.name;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => {
            deleteLocation(index);
        };

        li.appendChild(deleteBtn);
        checklist.appendChild(li);
    });
}

function deleteLocation(index) {
    const location = locations[index];
    map.removeLayer(location.marker);
    locations.splice(index, 1);
    updateChecklist();
}

document.getElementById('add-location').addEventListener('click', () => {
    const locationInput = document.getElementById('location-input');
    const locationName = locationInput.value;

    if (locationName.trim() !== '') {
        const latlng = map.getCenter();
        addMarker(latlng, locationName);
        locationInput.value = ''; // Clear the input
    } else {
        alert('Please enter a location name.');
    }
});

// Initialize the map
document.addEventListener('DOMContentLoaded', initMap);