const key = "M7EL2EaCDUfEWFVR7r9SD3smD95AthFV";

// get weather information
const getWeather = async citykey => {
  const url = `http://dataservice.accuweather.com/currentconditions/v1/`;
  const query = `${citykey}?apikey=${key}`;
  const response = await fetch(url + query);
  if(response.status !== 200){
    throw new Error("Something went wrong! Could not get weather information.");
  }
  const data = await response.json();
  return data;
};

// get city information
const getCity= async city => {
  const url = "http://dataservice.accuweather.com/locations/v1/cities/search";
  const query = `?apikey=${key}&q=${city}`;
  const response = await fetch(url + query);
  if(response.status !== 200){
    throw new Error("Something went wrong! Could not get city information.");
  }
  const data = await response.json();
  console.log(data[0]);
  return data[0];
};

// get worldwide countries top cities
const getTopCountryCities = async () => {
  const response = await fetch("db/cities.json");
  const data = await response.json();
  return data;
};