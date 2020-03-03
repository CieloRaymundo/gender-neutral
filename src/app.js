console.log("JavaScript is Connected!");

/* Constants */

const startTab = document.getElementById('start')
const endTab = document.getElementById('end')

/*  DOM Elements */

/* Function Declarations */

function getLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const long = position.coords.longitude;
        const lat = position.coords.latitude;
        console.log("User Genera Location:", position)
            // return position;
    })
}

function initMap() {

    const directionsService = new google.maps.DirectionsService; // Creating the directions Service instance
    const directionsDisplay = new google.maps.DirectionsRenderer; // Create Renderer to render directions line on map
    const ourMap = new google.maps.Map(document.getElementById('map'), { // Our Map object
        zoom: 15,
        center: {
            lat: 41.85,
            lng: -87.65
        }
        // center: {lat: 40.699765, lng: -73.941055}
    });

    // const marker = new google.maps.Marker({
    //       position: {lat: 41.85, lng: -87.65},
    //       map: ourMap,
    //       title: 'Im a bathroom!'
    //     });

    directionsDisplay.setMap(ourMap); //

    const onChangeHandler = function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    startTab.addEventListener('change', onChangeHandler); //when changed recalc the distance(1st param) and then render the blue directions line(2nd param)
    endTab.addEventListener('change', onChangeHandler);
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


function getBathrooms() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log("General Position:", position);
            const long = position.coords.longitude;
            const lat = position.coords.latitude;

            const url = `https://www.refugerestrooms.org/api/v1/restrooms/by_location?per_page=10&unisex=true&lat=${lat}&lng=${long}`;

            fetch(url)
                .then(res => res.json())
                .then(bathrooms => {
                    return bathrooms.map(bathroom => {
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
                        }
                    })
                })
        })
    }
}


function printOutDirections() {

}

function placemarkersonMAp() {
    // Loop through api get bathroom lat and longs
    // Create anon new marker assigned to our map
    // Change Title 

    const arr = getBathrooms();

    arr.forEach(item => {
        console.log(item)
    });


    const marker = new google.maps.Marker({
        position: {
            lat: 41.85,
            lng: -87.65
        },
        map: map, // our map object is literally called map.
        title: 'Im a bathroom!'
    });
}

getBathrooms()
    /*  Function Delcarations  -->  News + Relevant Info  */

//Get Users Location
