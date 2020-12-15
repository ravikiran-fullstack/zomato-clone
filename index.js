console.log(API_KEY);
console.log(LOCATION_DETAILS_URL);


//https://developers.zomato.com/api/v2.1/geocode?lat=12.2958&lon=76.6394
async function fetchLocationDetails(latitude, longitude){
  let url = `${LOCATION_DETAILS_URL}?lat=${latitude}&lon=${longitude}`
  
  const response = await fetch(url, {
                      headers: {
                        'Content-Type': 'application/json',
                        'user-key': `${API_KEY}`
                      },
                  });
  const data = await response.json();
  console.log(data);
}

//fetchLocationDetails(12.2958, 76.6394);

function test(){
  const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;
  console.log(latitude, longitude);
  fetchLocationDetails(latitude, longitude);
  event.preventDefault();
}