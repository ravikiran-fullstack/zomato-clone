
let previousBtn = 'homeBtn';
let previousSection = 'homeSection';
function showHomeSection(){
  if(previousBtn!== ''){
    document.getElementById(previousBtn).classList.remove('active');
  }
  if(previousSection !== ''){
    document.getElementById(previousSection).classList.add('hidden');
  }
  document.getElementById('homeBtn').classList.add('active');
  document.getElementById('homeSection').classList.remove('hidden');


  loadHomeSection();


  previousBtn = 'homeBtn';
  previousSection = 'homeSection';
}

function loadHomeSection(){
  showSortBtns();
  listRestaurantsInUserLocation();
}

loadHomeSection();

function showCollectionsSection(){
  if(previousBtn!== ''){
    document.getElementById(previousBtn).classList.remove('active');
  }
  if(previousSection !== ''){
    document.getElementById(previousSection).classList.add('hidden');
  }
  getCollections();
  document.getElementById('collectionsBtn').classList.add('active');
  document.getElementById('collectionsSection').classList.remove('hidden');
  previousBtn = 'collectionsBtn';
  previousSection = 'collectionsSection';
}

function showLocationDetailsSection(){
  if(previousBtn!== ''){
    document.getElementById(previousBtn).classList.remove('active');
  }
  if(previousSection !== ''){
    document.getElementById(previousSection).classList.add('hidden');
  }
  showMyLocation(showPosition);
  document.getElementById('locationDetailsBtn').classList.add('active');
  document.getElementById('locationDetailsSection').classList.remove('hidden');
  previousBtn = 'locationDetailsBtn';
  previousSection = 'locationDetailsSection';
}

//1)Create functionality to list the restaurant in the user given location. 
// Step1: make call to /locations https://developers.zomato.com/api/v2.1/locations?query=Bellary and get the entity_id and entity_type : Input is city name in the query param Parameter
// Step2: make call to /search https://developers.zomato.com/api/v2.1/search?entity_id=4&entity_type=city and get all the restaurants in the response

async function fetchRestaurantsByLocations(entity_id, entity_type){
  let url = `${RESTAURANTS_SEARCH_URL}?entity_id=${entity_id}&entity_type=${entity_type}`;
  
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
    document.getElementById('locationName').value = '';
    document.getElementById('errorMessageRestaurantsByLocations').innerHTML = 'Please try again later';
  }
}

async function fetPreRestaurantsByLocationData(){
  
  const locationName = document.getElementById('locationName').value;
  const locationData = await fetchLocation(locationName);

  if(locationData.location_suggestions.length === 0){
    document.getElementById('errorMessageRestaurantsByLocations').innerHTML = `${locationName} has no collections yet, please try another city`;
    document.getElementById('restaurantsByLocationDetails').innerHTML = '';
    return;
  }

  const city_name = locationData.location_suggestions[0].city_name;
  const entity_id = locationData.location_suggestions[0].entity_id;
  const entity_type = locationData.location_suggestions[0].entity_type;
  
  const restaurantsByLocationData = await fetchRestaurantsByLocations(entity_id, entity_type);
  showHtmlForRestaurantsByLocation(restaurantsByLocationData,city_name);
}

function showHtmlForRestaurantsByLocation(restaurantsByLocationData, city_name){
  document.getElementById('restaurantsByLocationDetails').innerHTML = '';
  ` <div class="row locationDetailsTitle">
      <div class="col-md-6">
        <div class="text-uppercase">City Name: <span>${city_name}</span></div>
      </div>
      <div class="col-md-6">
        <div class="text-uppercase">Number of Restaurants: <span>${restaurantsByLocationData.restaurants.length}</span></div>
      </div>
    </div>`
  
    restaurantsByLocationData.restaurants.forEach(restaurant => {
      restaurant = restaurant.restaurant;
      const card = document.createElement('div')
      card.classList.add('card','mt-3');
      //Need to make the image height same
      const restaurantImage = fetchRandomImages();
      card.innerHTML = `<div class="row">
                          <div class="col-md-4 col-12">
                            <img class="img-thumbnail" src="${restaurantImage}" alt="image not found">
                          </div>
                          <div class="col-md-8 col-12">
                            <div class="card-body">
                              <h4 class="card-title text-capitalize">${restaurant.name}</h4>
                              <p class="card-title text-capitalize"><span>${restaurant.establishment.join(' ')}</span></p>
                              <p class="card-title text-capitalize">Cuisines: <span>${restaurant.cuisines}</span></p>
                              <p class="card-title text-capitalize">Rating: <span>${restaurant.user_rating.aggregate_rating}</span></p>
                              <p class="card-title text-capitalize">Address: <span>${restaurant.location.address}</span></p>
                              <a target="_blank" href="${restaurant.menu_url}">Check Menu</a>
                            </div>
                          </div>
                        </div>`

      document.getElementById('restaurantsByLocationDetails').append(card);
    });
}

function showRestaurantsByLocation(){
  document.getElementById('errorMessageRestaurantsByLocations').innerHTML = '';
  fetPreRestaurantsByLocationData();
  event.preventDefault();
}

//2)Create functionality to list all the collections. 
// Step1: Make call to /locations https://developers.zomato.com/api/v2.1/locations?query=Bellary and get the city_id : Input is city name in the query param Parameter
// Step2: Make call to /collections  https://developers.zomato.com/api/v2.1/collections?city_id=32 with city_id retrieved in the Step1
async function fetchLocation(cityName){
  let url = `${LOCATIONS_URL}?query=${cityName}`;
  
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
    //document.getElementById(`'${cityName}'`).value = '';
    document.getElementById('errorMessage').innerHTML = 'Please try again later';
  }
}
//https://developers.zomato.com/api/v2.1/collections?city_id=3
async function fetchCollections(cityId){
  let url = `${COLLECTIONS_URL}?city_id=${cityId}`;
  
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
    document.getElementById('cityName').value = '';
    document.getElementById('errorMessageCollections').innerHTML = 'Please try again later';
  }
}

function showCollections(collectionsData, cityName){
  if(!collectionsData.collections){
    document.getElementById('errorMessageCollections').innerHTML = `${cityName} has no collections yet, please try another city`;
    document.getElementById('collectionDetails').innerHTML = '';
    return;
  }
  document.getElementById('collectionDetails').innerHTML = 
  ` <div class="row locationDetailsTitle">
        <div class="col-md-6 col-12 text-uppercase collectionsTitle">
          City Name: <span>${cityName}</span>
        </div>
        <div class="offset-md-3 col-md-3 col-12 text-uppercase collectionsTitle">
          Number of Collections: <span>${collectionsData.collections.length}</span>
        </div>
    </div>
    <div class="row" id="collectionDetailsRow">

    </div>`
  const collectionsArray = collectionsData.collections;
  collectionsArray.forEach(data => {
    
    const collection = data.collection;
        const col3 = document.createElement('div');
        col3.classList.add('col-md-3','col-6', 'mb-3');
        col3.innerHTML = `<div class="card bg-dark text-white">
            <img src="${collection.image_url}" class="img-fluid-collections" alt="image not found">
            <div class="card-img-overlay collectionCard">
              <h5 class="card-title text-white" style="padding-top:75%;">${collection.title}</h5>
              <u><a target="_blank" class="text-white" href="${collection.share_url}">More About this collection</a></u>
            </div>
          </div>
          `;

    document.getElementById('collectionDetailsRow').append(col3); 
  });
}

async function fetchPreCollectionsData(){
  let cityName = document.getElementById('cityName').value;
  if(!cityName || cityName === ''){
    cityName = 'hyderabad';
    document.getElementById('cityName').value = cityName;
  }
  document.getElementById('loadingIndicator').classList.remove('hidden');
  const locationData = await fetchLocation(cityName);
  
  const city_name = locationData.location_suggestions[0].city_name;
  const city_id = locationData.location_suggestions[0].city_id;
  const data = await fetchCollections(city_id);
  document.getElementById('loadingIndicator').classList.add('hidden');
  showCollections(data, city_name);
}

//fetchLocation('Bellary', '12.2958', '76.6394');
function getCollections(){
  document.getElementById('errorMessageCollections').innerHTML = '';
  fetchPreCollectionsData();
  event.preventDefault();
}

function showLocationForCollections(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
}

async function getCoordinatesForCollections(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const locationData = await fetchLocationDetails(latitude, longitude);
  const city_id = locationData.location.city_id;
  const city_name = locationData.location.city_name;
  document.getElementById('cityName').value = city_name;
  const data = await fetchCollections(city_id);
  showCollections(data, city_name);
}

function detectLocationForCollections(){
  showMyLocation(getCoordinatesForCollections); 
}

//5) Create functionality to populate the location details based on coordinates
//https://developers.zomato.com/api/v2.1/geocode?lat=12.2958&lon=76.6394
async function fetchLocationDetails(latitude, longitude){
  let url = `${GEO_CODE_URL}?lat=${latitude}&lon=${longitude}`
  
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

function showMyLocation(cb) {
  // console.log(cb);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(cb);
  } else { 
    document.getElementById('errorMessage').innerHTML = 'Enable Location is browser';
  }
}

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  setLatLong(latitude, longitude, showLocationDetails);
}

async function setLatLong(latitude, longitude, cb){ 
  document.getElementById('loadingIndicator').classList.remove('hidden');
  try{
    const data = await fetchLocationDetails(latitude, longitude);
    cb(data);
    document.getElementById('loadingIndicator').classList.add('hidden');
    // console.log(data);
  }catch(err){
    document.getElementById('errorMessage').innerHTML = 'Please try later';
  }
}

function showLocationDetails(locationDetails){
  // console.log('locationDetails', locationDetails);
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
  const rowLocations = document.createElement('div');
  rowLocations.classList.add('row');
  rowLocations.setAttribute('id','rowLocations');
  document.getElementById('locationDetails').append(rowLocations);  
  nearByRestaurants.forEach(restaurant => {
  
    const col4 = document.createElement('div')
    col4.classList.add('col-4','mt-3');
    //Need to make the image height same
    const restaurantImage = fetchRandomImages();
    col4.innerHTML = `<div class="card">
                        <div>
                          <img class="img-fluid-collections" src="${restaurantImage}" alt="image not available">
                        </div>
                        <div class="card-body">
                          <h4 class="card-title text-capitalize">Name: <span>${restaurant.restaurant.name}</span></h4>
                          <p class="card-title text-capitalize">Rating: <span>${restaurant.restaurant.user_rating.aggregate_rating}</span></p>
                          <p class="card-title text-capitalize">Cuisines: <span>${restaurant.restaurant.cuisines}</span></p>
                          <p class="card-title text-capitalize">${restaurant.restaurant.average_cost_for_two} per person</p>      
                          <a target="_blank" href="${restaurant.restaurant.url}">Check Menu</a>
                        </div>
                      </div>`

  document.getElementById('rowLocations').append(col4);  
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
    // console.log('not matched',lat);
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




//3.A)Create functionality to list the restaurant based on cuisine 
// Step1: Make call to /search https://developers.zomato.com/api/v2.1/search?count=10&cuisines=85 with cuisines ID hardcoded in the HTML UI and retrieve all the restaurants 

//3.B)Create functionality to list the restaurant based on rating. 
// Step1: ---------------------------------------------------

//3.C)Create functionality to list the restaurant based on location. 
// Step1: Make call to /locations https://developers.zomato.com/api/v2.1/locations?query=Bengaluru and get the latitude and longitude for Bengaluru
// Step2: Make call to /search https://developers.zomato.com/api/v2.1/search?count=10&lat=12.971606&lon=77.594376 with latitude and longitude retrieved from Step1 and retrieve all the restaurants 

//listRestaurantsInUserLocation
//listRestaurantsInUserLocation();

async function searchRestaurantsByCoords(entity_id, entity_type){
  let url = `${RESTAURANTS_SEARCH_URL}?entity_id=${entity_id}&entity_type=${entity_type}`;
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
    document.getElementById('locationName').value = '';
    document.getElementById('errorMessageRestaurantsByLocations').innerHTML = 'Please try again later';
  }
}

async function searchCities(city_name){
  let url = `${CITIES_URL}?q=${city_name}`;
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
    document.getElementById('locationHomePage').value = '';
    document.getElementById('errorMessageHomePage').innerHTML = 'Please try again later';
  }
}


async function searchRestaurantsByCityId(city_id, sortObj){
  let url = `${RESTAURANTS_SEARCH_URL}?entity_id=${city_id}&entity_type=city&sort=${sortObj.sortBy}&order=${sortObj.direction}`;
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
    console.error('-----------------------------------errroorrrrrrrrr')
    document.getElementById('locationName').value = '';
    document.getElementById('errorMessageRestaurantsByLocations').innerHTML = 'Please try again later';
  }
}

async function getCoordinates(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  
  document.getElementById('loadingIndicator').classList.remove('hidden');
  const locationData = await fetchLocationDetails(latitude, longitude);
  const entity_id = locationData.location.entity_id;
  const entity_type = locationData.location.entity_type;
  const city_name = locationData.location.city_name;
  document.getElementById('locationHomePage').value = city_name;
  const data = await searchRestaurantsByCoords(entity_id, entity_type);
  
  document.getElementById('loadingIndicator').classList.add('hidden');
  populateHomePage(data,city_name);
}

function fetchRandomImages(){
  const src = `/images/${Math.floor(Math.random()*15+ 1)}.jpg`;
  return src;
}

//arrow_drop_down

let sortByCostUp = false;
let sortByRatingsUp = false;
let sortByDistanceUp = false;
let sortObj = {sortBy: 'cost', direction: 'desc'};
function sortByCost(){
  sortByCostUp = !sortByCostUp;
  if(sortByCostUp === true){
    sortObj = {sortBy: 'cost', direction: 'asc'};
    document.getElementById('sortByCostId').innerHTML = 'By Cost <i class="material-icons">arrow_downward</i>';
  } else {
    sortObj = {sortBy: 'cost', direction: 'desc'};
    document.getElementById('sortByCostId').innerHTML = 'By Cost <i class="material-icons">arrow_upward</i>';
  }
  callAsyncSearchFunction();
}


function sortByRatings(){
  if(sortByRatingsUp){
    sortObj.sortBy = 'rating'
    sortObj.direction = 'asc';
    document.getElementById('sortByRatingsId').innerHTML = 'By Ratings <i class="material-icons">arrow_downward</i>';
  } else {
    sortObj = {sortBy: 'rating', direction: 'desc'};
    document.getElementById('sortByRatingsId').innerHTML = 'By Ratings <i class="material-icons">arrow_upward</i>';
  }
  callAsyncSearchFunction();
  sortByRatingsUp = !sortByRatingsUp;
}

async function callAsyncSearchFunction(){
  showRestaurantByCity();
}
function sortByDistance(){
  if(sortByDistanceUp){
    sortObj = {sortBy: 'real_distance', direction: 'asc'};
    document.getElementById('sortByDistanceId').innerHTML = 'By Distance <i class="material-icons">arrow_downward</i>';
  } else {
    sortObj = {sortBy: 'real_distance', direction: 'desc'};
    document.getElementById('sortByDistanceId').innerHTML = 'By Distance <i class="material-icons">arrow_upward</i>';
  }
  callAsyncSearchFunction();
  sortByDistanceUp = !sortByDistanceUp;
}

function showSortBtns(){
  document.getElementById('homePageSortBtnsDiv').innerHTML = '';
  document.getElementById('homePageSortBtnsDiv').innerHTML = 
  ` <div class="row locationDetailsTitle">
      <div class="col-md-3 col-12">
        <h4>Restaurants nearby</h4>
      </div> 
      <div class="offset-md-5 col-md-4 text-center">
        <button class="btn btn-info homeSortBtn" onclick="sortByCost()"  id="sortByCostId">By Cost <i class="material-icons">arrow_downward</i></button>
        <button class="btn btn-info homeSortBtn" onclick="sortByRatings()" id="sortByRatingsId">By Ratings <i class="material-icons">arrow_downward</i></button>
        <button class="btn btn-info homeSortBtn" onclick="sortByDistance()" id="sortByDistanceId" disabled>By Distance <i class="material-icons">arrow_downward</i></button>
      </div>
    </div>`
}

function populateHomePage(restaurantsData){
  try{
    document.getElementById('homePageRestaurantDetails').innerHTML = '';
    const row = document.createElement('div');
    row.setAttribute('id', 'rowHome');
    row.classList.add('row')
    document.getElementById('homePageRestaurantDetails').append(row);
    restaurantsData.restaurants.forEach(restaurant => {
        restaurant = restaurant.restaurant;
        const card = document.createElement('div')
        card.classList.add('col-md-4','col-12','mt-3');
        const restaurantImage = fetchRandomImages();
        card.innerHTML = `<div class="card">
                            <img src="${restaurantImage}" class="img-fluid-collections" alt="image not found">
                            <div class="card-body">
                            <h4 class="card-title text-capitalize">${restaurant.name}</h4>
                            <p class="card-title text-capitalize">${restaurant.user_rating.aggregate_rating} (${restaurant.all_reviews_count} Reviews)</p>
                            <p class="card-title text-capitalize text-truncate">${restaurant.cuisines}</p>
                            <p class="card-title">${restaurant.currency}${restaurant.average_cost_for_two} per person</p>
                            <a target="_blank" href="${restaurant.menu_url}">Check Menu</a>
                            </div>
                          </div>`

        document.getElementById('rowHome').append(card);
      });
  }catch(err){
    document.getElementById('errorMessageHomePage').innerHTML = 'Please Try refreshing the page';
  }  
  
    console.log('loading end--------------------------')
}

function generateStars(ratings){

}



function detectLocation(){
  showSortBtns();
  showMyLocation(getCoordinates);
}

function listRestaurantsInUserLocation(){
  showMyLocation(getCoordinates);
}

async function showRestaurantByCity(){
  const city_name = document.getElementById('locationHomePage').value;
  const cityData = await searchCities(city_name);
  const city_id = cityData.location_suggestions[0].id;
  const restaurantData = await searchRestaurantsByCityId(city_id, sortObj);
  populateHomePage(restaurantData, city_name);
}

function showRestaurantsByLocationHomePage(){
  showRestaurantByCity();
  event.preventDefault();
}

//4) Create functionality to list the daily menu in the restaurant. 
// Not able to do this because https://developers.zomato.com/api/v2.1/dailymenu?res_id=18706428 responds back code 400 bad requests --

//5) Create functionality to populate the location details based on coordinates. 
// Step1: Make call to /geocode https://developers.zomato.com/api/v2.1/geocode?lat=12.2958&lon=76.6394 with latitude and longitude entered by the user and show the location details to the user


window.addEventListener('click', function(event){
  const btn = document.querySelector('.navbar-toggler');
  const ariaExpanded = btn.getAttribute('aria-expanded') === "true";
  if(ariaExpanded){
    btn.click();
  }
});


