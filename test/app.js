console.log("JavaScript is Connected");
   
function initMap() {

    const directionsService = new google.maps.DirectionsService; // Creating the directions Service instance
    const directionsDisplay = new google.maps.DirectionsRenderer; // Create Renderer to render directions line on map
    const ourMap = new google.maps.Map(document.getElementById('map'), { // Our Map object
        zoom: 15,
        center: {
            lat: 41.85,
            lng: -87.65
        }
        // center: {lat: 40.699765, lng: -73.941055} // Marcy Lab
    });

    directionsDisplay.setMap(ourMap);

    const onChangeHandler = function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    // startTab.addEventListener('change', onChangeHandler); // when changed recalc the distance(1st param) and then render the blue directions line(2nd param)
    // endTab.addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed', status);
            console.log(status)
        }
    });
}

function displayDirections() {
    
}

function initMap() {
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log('My General Position:', position);
            const long = position.coords.longitude;
            const lat = position.coords.latitude;

            console.log("Current Latitude/Longitude is as follows:", lat, long);

            const ourMap = new google.maps.Map(document.getElementById('map'), { // Our Map object
                zoom: 18,
                center: {
                    lat: lat,
                    lng: long
                }
                //center: {lat: 40.699765, lng: -73.941055}
            });
            
            const userMarker = new google.maps.Marker({
                position: {
                    // lat: lat,
                    // lng: long
                    // lat: 40.699765,
                    // lng: -73.94105
                },
                map: ourMap,
                title: 'Bathroom',
            });

            getBathrooms(lat, long)
                .then(bathrooms => bathrooms.forEach(bathroom => {
                    const newMarker = new google.maps.Marker({
                        position: {
                            lat: bathroom.latitude,
                            lng: bathroom.longitude,
                        },
                        map: ourMap,
                        title: 'Bathroom',
                    })
                    return newMarker;
                }));
        });
    }
}


function getBathrooms(lat, long) {
    const url = `https://www.refugerestrooms.org/api/v1/restrooms/by_location?per_page=30&unisex=true&lat=${lat}&lng=${long}`;

    return (fetch(url)
        .then(res => res.json())
        .then(bathrooms => bathrooms.map(bathroom => {
            return {
                id: bathroom.id,
                name: bathroom.name,
                street: bathroom.street,
                city: bathroom.city,
                state: bathroom.state,
                latitude: bathroom.latitude,
                longitude: bathroom.longitude,
                approved: bathroom.approved,
                unisex: bathroom.unisex,
                description: bathroom.directions,
                comment: bathroom.comment
            };
        }))
    );
}

/* Reverse Geocoding API */

const locationiqApiKey = "48447f262ef7c7";
const lat = 41.85, long = -87.65;

// const url = `https://us1.locationiq.com/v1/search.php?key=${locationiqApiKey}&q=Empire%20State%20Building&format=json`

fetch(`https://us1.locationiq.com/v1/reverse.php?key=${locationiqApiKey}&lat=${lat}&lon=${long}&format=json`)
.then(response => response.json())
.then(json => console.log(json.display_name))


class Session {
    constructor() {
        this.bathrooms = ['']
        this.userLocation = {
            'latitude': 0,
            'longitude': 0
        }
        this.bathroomCount = 0
    }
    addMarker(bathroomObj) {
        console.log("new location", bathroomObj);
        this.bathrooms.push(bathroomObj)
    }
}
const ourSession = new Session();
    // console.log(ourSession)
console.log(ourSession);
    // console.log(ourSession)
    
    
    
