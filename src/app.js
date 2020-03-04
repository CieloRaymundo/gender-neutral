//window.addEventListener('load', () => {
console.log("JavaScript is Connected!");

const startTab = document.getElementById('start')
const endTab = document.getElementById('end')

function initMap(lat, long) {
    const directionsService = new google.maps.DirectionsService; // Creating the directions Service instance
    const directionsDisplay = new google.maps.DirectionsRenderer; // Create Renderer to render directions line on map
    const initialLocation = new google.maps.LatLng(lat, long);
    const ourMap = new google.maps.Map(document.getElementById('map'), { // Our Map object
        zoom: 17,
        center: {lat: lat, lng: long}
         //center: {lat: 40.699765, lng: -73.941055}
    });
    
    directionsDisplay.setMap(ourMap); //

    const onChangeHandler = function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    startTab.addEventListener('change', onChangeHandler); //when changed recalc the distance(1st param) and then render the blue directions line(2nd param)
    endTab.addEventListener('change', onChangeHandler);
    
    // placemarkersonMap(lat, long);
    getBathrooms(lat, long).then(bathrooms => bathrooms.forEach(bathroom => {
       const newMarker = new google.maps.Marker({
          position: {
              lat: bathroom.latitude,
              lng: bathroom.longitude
          },
          map: ourMap,
          title: bathroom.description + bathroom.comment
      });
      return newMarker;
    }));
    
}

if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(position => {
			console.log('My General Position:', position);
			const long = position.coords.longitude;
			const lat = position.coords.latitude;
			
			console.log(lat, long);
			initMap(lat, long);
		});
}



// function calculateAndDisplayRoute(directionsService, directionsDisplay) {
//     directionsService.route({
//         origin: document.getElementById('start').value,
//         destination: document.getElementById('end').value,
//         travelMode: 'DRIVING'
//     }, function(response, status) {
//         if (status === 'OK') {
//             directionsDisplay.setDirections(response);
//         } else {
//             window.alert('Directions request failed', status);
//             console.log(status)
//         }
//     });
// }



function getBathrooms(lat, long){
    const url = `https://www.refugerestrooms.org/api/v1/restrooms/by_location?per_page=10&unisex=true&lat=${lat}&lng=${long}`;
    
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

// function placemarkersonMap(lat, long) {
//     getBathrooms(lat, long).then(bathrooms => bathrooms.forEach(bathroom => {
//       const newMarker = new google.maps.Marker({
//           position: {
//               lat: bathroom.latitude,
//               lng: bathroom.longitude
//           },
//           map: ourMap,
//           title: bathroom.description + bathroom.comment
//       });
//     }));
// }


<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC5jy-9XEclPOh-Z8wrmT3S8SESbkUqit0&callback=initMap">
  </script>
  
  
  
  if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(position => {
			console.log('My General Position:', position);
			const long = position.coords.longitude;
			const lat = position.coords.latitude;
			
			console.log(lat, long);
			
			const ourMap = new google.maps.Map(document.getElementById('map'), { // Our Map object
                zoom: 17,
                center: {lat: lat, lng: long}
                 //center: {lat: 40.699765, lng: -73.941055}
            });

            const newMarker = new google.maps.Marker({
                  position: {
                      lat: lat,
                      lng: long
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
                }
            ));
		});
}