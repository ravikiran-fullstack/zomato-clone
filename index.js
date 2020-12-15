//2)Create functionality to list all the collections. 
// Step1: Make call to /locations https://developers.zomato.com/api/v2.1/locations?query=Bellary and get the city_id : Input is city name in the query param Parameter
// Step2: Make call to /collections  https://developers.zomato.com/api/v2.1/collections?city_id=32 with city_id retrieved in the Step1


//5) Create functionality to populate the location details based on coordinates
//https://developers.zomato.com/api/v2.1/geocode?lat=12.2958&lon=76.6394
async function fetchLocationDetails(latitude, longitude){
  let url = `${LOCATION_DETAILS_URL}?lat=${latitude}&lon=${longitude}`
  
  try{
    const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'user-key': `${API_KEY}`
        },
    });
    const data = await response.json();
    return data;
  }catch(err){
    document.getElementById('latitude').value = '';
    document.getElementById('longitude').value = '';
    document.getElementById('errorMessage').innerHTML = 'Please try again later';
  }
}

function setLatLong(){
  const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;
  console.log(latitude, longitude);
  fetchLocationDetails(latitude, longitude)
    .then(data =>  {
      showLocationDetails(data);
    }).catch(err => {
      document.getElementById('latitude').value = '';
      document.getElementById('longitude').value = '';
      document.getElementById('errorMessage').innerHTML = 'Please try later';
    });
  event.preventDefault();
}

function showLocationDetails(locationDetails){
  console.log('locationDetails', locationDetails);
  const cityName = locationDetails.location.city_name;
  const topCuisines = locationDetails.popularity.top_cuisines.join(',');
  document.getElementById('locationDetails').innerHTML = 
  ` <div class="row locationDetailsTitle">
      <div class="col-md-6">
        <div class="text-uppercase">City Name: <span>${cityName}</span></div>
      </div>
      <div class="col-md-6">
        <div class="text-uppercase">Top Cuisines: <span>${topCuisines}</span></div>
      </div>
    </div>`

  const nearByRestaurants = locationDetails.nearby_restaurants;
  nearByRestaurants.forEach(restaurant => {
  
    const card = document.createElement('div')
    card.classList.add('card','mt-3');
    //Need to make the image height same
    card.innerHTML = `<div class="row">
                        <div class="col-md-4 col-12">
                        
                          <img class="img-fluid" src="${restaurant.restaurant.featured_image}" alt="image not found">
                        </div>
                        <div class="col-md-8 col-12">
                          <div class="card-body">
                            <h4 class="card-title text-capitalize">Name: <span>${restaurant.restaurant.name}</span></h4>
                            <p class="card-title text-capitalize">Address: <span>${restaurant.restaurant.location.address}</span></p>
                            <p class="card-title text-capitalize">Rating: <span>${restaurant.restaurant.user_rating.aggregate_rating}</span></p>
                            <p class="card-title text-capitalize">Cuisines: <span>${restaurant.restaurant.cuisines}</span></p>
                            <p class="card-title text-capitalize">Price Range: <span>${restaurant.restaurant.price_range}</span></p>      
                          </div>
                        </div>
                      </div>`

    document.getElementById('locationDetails').append(card);                  
  });



}

function testLatitude(){
  const pattern = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;
  const lat = document.getElementById('latitude');
  if(lat.value.match(pattern)){
    lat.style.borderColor = '';
    document.getElementById('latitudeHelp').innerHTML = '';
    document.querySelector('button[type="submit"]').disabled = false;
  } else {
    console.log('not matched',lat);
    lat.style.borderColor = 'red';
    document.getElementById('latitudeHelp').innerHTML = 'Invalid Format';
    document.querySelector('button[type="submit"]').disabled = true;
  }
}

function testLongitude(){
  const pattern = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;
  const long = document.getElementById('longitude');
  if(long.value.match(pattern)){
    long.style.borderColor = '';
    document.getElementById('longitudeHelp').innerHTML = '';
    document.querySelector('button[type="submit"]').disabled = false;
  } else {
    long.style.borderColor = 'red';
    long.focus();
    document.getElementById('longitudeHelp').innerHTML = 'Invalid Format';
    document.querySelector('button[type="submit"]').disabled = true;
  } 
}

//////////////////Daily menu
//const API_KEY = '9af7220dba33a0911e597ecfa0d83a82';
// async function fetchDailyMenu(){

//   const res_ids = [ "3600375","3600065","3600017","3600403","3600252","3600265","3600838","3600148","3600153","18871246", "18494064",  "18430785",
//                         "52253", "50975","50742","54097", "18379660", "57438","93043", "97575",  "92155",  "18752944",  "91581",  "92163",  "19275716",  "18652022",  "90240"
//                       ]
//       const url = `${DAILY_MENU_URL}?res_id=${res_ids[0]}`;
//       console.log(url)
//       try{
//         const response = await fetch(url, {
//                                     headers: {
//                                       'Content-Type': 'application/json',
//                                       'user-key': `${API_KEY}`
//                                     },
//                                 }); 
//       const data = await response.json();
//       console.log(data);                          
//       } catch(err){
//         console.log(err);
//       }

// }

// fetchDailyMenu();

//https://developers.zomato.com/api/v2.1/search?count=10&cuisines=85  ------- Based on the Cuisine ID
//https://developers.zomato.com/api/v2.1/search?entity_id=36&entity_type=city&count=10 ------- Based on the City or location and entity type (Optional)
//https://developers.zomato.com/api/v2.1/search?entity_id=36&count=10 ------- Based on the city ID
//https://developers.zomato.com/api/v2.1/search?q=rating Based on user ratings Where user location is set by the user


//https://developers.zomato.com/api/v2.1/collections?city_id=32 Based on the city ID or we can use Latitude and Longitude

//1)Create functionality to list the restaurant in the user given location. 
// Step1: make call to /locations https://developers.zomato.com/api/v2.1/locations?query=Bellary and get the entity_id and entity_type : Input is city name in the query param Parameter
// Step2: make call to /search https://developers.zomato.com/api/v2.1/search?entity_id=4&entity_type=city and get all the restaurants in the response



//3.A)Create functionality to list the restaurant based on cuisine, rating and location. 
// Step1: Make call to /search https://developers.zomato.com/api/v2.1/search?count=10&cuisines=85 with cuisines ID hardcoded in the HTML UI and retrieve all the restaurants 

//3.B)Create functionality to list the restaurant based on rating. 
// Step1: ---------------------------------------------------

//3.C)Create functionality to list the restaurant based on location. 
// Step1: Make call to /locations https://developers.zomato.com/api/v2.1/locations?query=Bengaluru and get the latitude and longitude for Bengaluru
// Step2: Make call to /search https://developers.zomato.com/api/v2.1/search?count=10&lat=12.971606&lon=77.594376 with latitude and longitude retrieved from Step1 and retrieve all the restaurants 

//4) Create functionality to list the daily menu in the restaurant. 
// Not able to do this because https://developers.zomato.com/api/v2.1/dailymenu?res_id=18706428 responds back code 400 bad requests --

//5) Create functionality to populate the location details based on coordinates. 
// Step1: Make call to /geocode https://developers.zomato.com/api/v2.1/geocode?lat=12.2958&lon=76.6394 with latitude and longitude entered by the user and show the location details to the user




