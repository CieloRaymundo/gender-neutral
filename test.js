function initMap(){
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