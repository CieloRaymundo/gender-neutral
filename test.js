const startTab = document.getElementById('start')
const endTab = document.getElementById('end')

function initMap(){
    const directionsService = new google.maps.DirectionsService;
    const directionsDisplay = new google.maps.DirectionsRenderer;
    
    if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(position => {
			console.log('My General Position:', position);
			const long = position.coords.longitude;
			const lat = position.coords.latitude;
			
			console.log(lat, long);
			
			const ourMap = new google.maps.Map(document.getElementById('map'), { // Our Map object
                zoom: 18,
                center: {lat: lat, lng: long}
                 //center: {lat: 40.699765, lng: -73.941055}
            });

            const newMarker = new google.maps.Marker({
                  position: {
                      lat: lat,
                      lng: long
                  },
                  map: ourMap,
                  title: 'Me',
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
                }
            ));
            
            directionsDisplay.setMap(ourMap);
            const onChangeHandler = function() {
                calculateAndDisplayRoute(directionsService, directionsDisplay);
            };
            startTab.addEventListener('change', onChangeHandler);
            endTab.addEventListener('change', onChangeHandler); 
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
    }))
);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: {lat: 40.6998598, lng: -73.9411056},
        destination: {lat: 40.697721, lng: -73.935995},
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