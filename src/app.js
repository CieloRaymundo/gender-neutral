//alert("Never know which bathroom to go in ? Fear no more! There are Gender-Neutral bathroom's everywhere!");

function initMap(){
    if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(position => {
			console.log('My General Position:', position);
			const long = position.coords.longitude;
			const lat = position.coords.latitude;
			
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
            userMarker.addListener('click', toggleBounce);
            
            function toggleBounce() {
              if (userMarker.getAnimation() !== null) {
                userMarker.setAnimation(null);
              } else {
                userMarker.setAnimation(google.maps.Animation.BOUNCE);
              }
              console.log(userMarker)
            }
            
            getBathrooms(lat, long)
                .then(bathrooms => bathrooms.map(bathroom => {
                    const newMarker = new google.maps.Marker({
                        position: {
                           lat: bathroom.latitude,
                           lng: bathroom.longitude,
                        },
                        map: ourMap,
                        animation: google.maps.Animation.DROP,
                        title: bathroom.description + bathroom.comment,
                    });
                    console.log(newMarker);
                    return newMarker;
                }
             ));
             
            
            reverseGeocoding(lat, long)
                .then(name => name.split(','))
                .then(address => {
                    const startTab = document.getElementById('start');
                    startTab.options[0].text = address[0] + address[1];
                    startTab.options[0].value =  address[0] + address[1] + address[2];
                });
            
            const onChangeHandler = function() {
                calculateAndDisplayRoute(directionsService, directionsRenderer);
            };
            
            document.getElementById('start').addEventListener('change', onChangeHandler);
            document.getElementById('end').addEventListener('change', onChangeHandler);
		});
    }
}

function getBathrooms(lat, long){
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
            })
    ));
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        travelMode: 'WALKING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            window.alert('Directions request failed', status);
            console.log(status);
        }
    });
} 


function reverseGeocoding(lat, lng) {
    const locationiqApiKey = "48447f262ef7c7";
    
    return fetch(`https://us1.locationiq.com/v1/reverse.php?key=${locationiqApiKey}&lat=${lat}&lon=${lng}&format=json`)
    .then(response => response.json())
    .then(json => json.display_name)
}