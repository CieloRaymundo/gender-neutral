/*----- constants -----*/

/*  DOM Elements */



/*------ Classes ------*/


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
        this.bathrooms.push(bathroomObj)
    }
}
        /* Test */
 
const ourSession = new Session();
    // console.log(ourSession)
console.log(ourSession);
    // console.log(ourSession)
    
    
/*----- app's state -----*/
    
console.log("JavaScript is Connected!");
alert("Never know which bathroom to go in ? Fear no more! There are Gender-Neutral bathroom's everywhere!");

// if (navigator.geolocation) {
// 		navigator.geolocation.getCurrentPosition(position => {
// 			console.log('My General Position:', position);
// 			const long = position.coords.longitude;
// 			const lat = position.coords.latitude;
			
// 			initMap(lat, long);
// 		});
// }

/*----- functions -----*/

function initMap(lat, lng){
    if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(position => {
			console.log('My General Position:', position);
			const long = position.coords.longitude;
			const lat = position.coords.latitude;
			
			const startTab = document.getElementById('start') // Delete from global space eventually
            const endTab = document.getElementById('end')
			
			const directionsRenderer = new google.maps.DirectionsRenderer;
            const directionsService = new google.maps.DirectionsService;
			
			console.log(lat, long);
			
			const ourMap = new google.maps.Map(document.getElementById('map'), { // Our Map object
                zoom: 18,
                center: {lat: lat, lng: long}
                 //center: {lat: 40.699765, lng: -73.941055}
            });

            const userMarker = new google.maps.Marker({
                  position: {
                      lat: lat,
                      lng: long
                  },
                  map: ourMap,
                  title: 'Me',
              });
            
            const markers = [];
            
            getBathrooms(lat, long)
                .then(bathrooms => bathrooms.forEach(bathroom => {
                    const newMarker = new google.maps.Marker({
                        position: {
                           lat: bathroom.latitude,
                           lng: bathroom.longitude,
                        },
                        map: ourMap,
                        title: bathroom.description + bathroom.comment,
                    });
                    markers.push(newMarker);
                    return newMarker;
                }
             ));
            
            for(let i = 0; i < markers.length; i++){
                markers[i].addListener('click',calculateAndDisplayRoute(directionsService, directionsRenderer,{lat: lat, lng:long} ,{lat:markers[i].latitude, lng:markers[i].longitude}));
            }
            
            reverseGeocoding(lat, long)
                .then(name => name.split(','))
                .then(address => {
                    startTab.options[0].text = address[0] + address[1];
                });
            
            
		});
    }
}

function getBathrooms(lat, long){
    const url = `https://www.refugerestrooms.org/api/v1/restrooms/by_location?per_page=30&unisex=true&lat=${lat}&lng=${long}`;
    
    return (fetch(url)
        .then(res=>res.json())
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
            })
    ));
}

function calculateAndDisplayRoute(directionsService, directionsRenderer, origin, destination) {
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: 'WALKING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            window.alert('Directions request failed', status);
            console.log(status)
        }
    });
} 

    /*  Function Delcarations  -->  News + Relevant Info  */


let searchInput = document.getElementById("");

/* Reverse Geocoding API */
function reverseGeocoding(lat, lng) {
    const locationiqApiKey = "48447f262ef7c7";
    
    return fetch(`https://us1.locationiq.com/v1/reverse.php?key=${locationiqApiKey}&lat=${lat}&lon=${lng}&format=json`)
    .then(response => response.json())
    .then(json => json.display_name)
}