/* global L */

var map = L.map('map').setView([40.744526,-73.951206], 11);
var popupTemplate = document.querySelector('.popup-template').innerHTML;
var ResourceLayer;


L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);


fetch('https://cdn.glitch.com/3ab60e91-1ad5-4a11-8ae8-15e6bb13bda9%2FtatlasFinal.geojson?1551317560030')
  .then(function (response) {
   
    return response.json();
  })
  .then(function (data) {
    
  ResourceLayer = L.geoJson(data, {
     
      pointToLayer: function (geoJsonFeature, latlng) {
        return L.circleMarker(latlng);
      },
        style: function (geoJsonFeature) {
        console.log(geoJsonFeature.properties); 
        
        if (geoJsonFeature.properties.service_type === 'Advocacy and Activism') {
          return {
            fillColor: '#364044',
            fillOpacity: 0.8,
            radius: 6,
            stroke: false
          };
        }
        
        else if (geoJsonFeature.properties.service_type === 'Elders' || geoJsonFeature.properties.service_type === 'Youth') {
          return {
            fillColor: '#ffe944',
            fillOpacity: 0.9,
            radius: 6,
            stroke: false
          };
        }
        else if (geoJsonFeature.properties.service_type === 'Electrolysis and Laser Hair Removal' || geoJsonFeature.properties.service_type === 'Speech Therapy') {
          return {
            fillColor: '#4ec5ed',
            fillOpacity: 0.8,
            radius: 6,
            stroke: false
          };
        }
        else if (geoJsonFeature.properties.service_type === 'HIV Services'|| geoJsonFeature.properties.service_type === 'Sexual Health Services' || geoJsonFeature.properties.service_type === 'Reproductive Services' ) {
          return {
            fillColor: '#969696',
            fillOpacity: 0.8,
            radius: 6,
            stroke: false
          };
        }
        else if (geoJsonFeature.properties.service_type === 'Housing Services'|| geoJsonFeature.properties.service_type === 'Legal Assistance' || geoJsonFeature.properties.service_type === 'Social and Supportive Services') {
          return {
            fillColor: '#24AB50',
            fillOpacity: 0.8,
            radius: 6,
            stroke: false
          };
        }
       
        else if (geoJsonFeature.properties.service_type === 'Mental Health and Addiction Support') {
          return {
            fillColor: '#e88222',
            fillOpacity: 0.8,
            radius: 6,
            stroke: false
          };
        }
          else if (geoJsonFeature.properties.service_type === 'Religious') {
          return {
            fillColor: '#ef7670',
           fillOpacity: 0.8,
            radius: 6,
            stroke: false
          };
        }
          else if (geoJsonFeature.properties.service_type === 'Surgeon' || geoJsonFeature.properties.service_type === 'Medical and Health' || geoJsonFeature.properties.service_type === 'Alternative Medicine') {
          return {
            fillColor: '#c986ce',
            fillOpacity: 0.8,
            radius: 6,
            stroke: false
          };
        }
         else {
          return {
            fillColor: '#4ec5ed',
            fillOpacity: 0.8,
            radius: 6,
            stroke: false
          };
        }
      },
    onEachFeature: function (feature, layer) {
        layer.on('click', function () {
          console.log(layer.feature.properties);

        
          var sidebarContentArea = document.querySelector('.sidebar-content');
          console.log(sidebarContentArea);
          sidebarContentArea.innerHTML = Mustache.render(popupTemplate, layer.feature.properties);
        });
      }
  });
  
    ResourceLayer.addTo(map);
  });

function getService() {
  var services = [];
  
  serviceCheckboxes.forEach(function(serviceCheckbox) {
    if (serviceCheckbox.checked) {
      services.push(serviceCheckbox.dataset.service);
      console.log("this works")
    }
  });
  
  return services;
}

function filter(services) {
  // layer.eachLayer() is exactly like forEach() but is specific to Leaflet
  // EB: changed this to ResourceLayer--that's the layer that will have the features we want to filter
  ResourceLayer.eachLayer(function (layer) {
  
    // EB: changed this condition--this is how you say "does services contain this layer's service type?"
    if (services.indexOf(layer.feature.properties.service_type) >= 0)  {
      // ...add it to the map. Otherwise...
      // EB: removed the return statement here--it was keeping removed layers from being added later when their checkbox is checked
      layer.addTo(map);
    }
    else {
      layer.removeFrom(map);
    }
  });
}


var serviceCheckboxes = document.querySelectorAll('.service-checkbox');

  serviceCheckboxes.forEach(function (serviceCheckbox) {
    serviceCheckbox.addEventListener('change', function () {
      console.log(getService())
      return filter(getService());
  });
});



function getText(searchString) {
  
  ResourceLayer.eachLayer(function (layer) {
    if (layer.feature.properties.service_type.toLowerCase().indexOf(searchString) >= 0 || layer.feature.properties.services_offered.toLowerCase().indexOf(searchString) >= 0 || layer.feature.properties.other_srvc_type.toLowerCase().indexOf(searchString) >= 0) {
      layer.addTo(map);
    }
    else {
      layer.removeFrom(map);
    }
    
  });
  
  return searchString;
}



var searchButton = document.querySelector('.submit');
var searchInput = document.querySelector('.searchInput');


searchButton.addEventListener('click', function () {
  console.log(searchInput.value);
  getText(searchInput.value.toLowerCase());
});


searchInput.addEventListener('keydown', function (event) {
   getText(searchInput.value.toLowerCase());
});

searchInput.addEventListener('enter', function (event) {
  console.log(searchInput.value);
  getText(searchInput.value.toLowerCase());
});


function loadDropdown(serviceType) {
  if (ResourceLayer) {
    ResourceLayer.clearLayers();
  }
  
  
  fetch('.service-dropdown')
    .then(function (response) {
      
      return response.json();
    })
    .then(function (data) {
         
      ResourceLayer = L.geoJson(data).addTo(map);
    });
}


var servicePicker = document.querySelector('.service-dropdown');


servicePicker.addEventListener('change', function () {
  console.log(servicePicker.value)
  filter([servicePicker.value]);
});


var clearButton = document.querySelector('.clear-button');
clearButton.addEventListener('click', function () {
  clearall();
  filter(getService());
  console.log('sheeeee work!');
  
  });

function clearall () {
  serviceCheckboxes.forEach(function (serviceCheckbox) {
  serviceCheckbox.checked=false
  })
}