class Weather {
  constructor(){
    this.key = "Bm9VAglzOAr16ZeNfZBDVZlvjI4ogbG1";
    this.weatherURI = "https://dataservice.accuweather.com/currentconditions/v1/";
    this.cityURI = "https://dataservice.accuweather.com/locations/v1/cities/search";
  }
  async updateCity(city) {
    const cityDetails = await this.getCity(city);
    if(cityDetails){
      const cityConditions = await this.getWeather(cityDetails.Key);
      return {
        details: cityDetails,
        weather: cityConditions
      }
    }
  }
  async getCity(city) {
    const query = `?apikey=${this.key}&q=${city}`;
    const response = await fetch(this.cityURI + query);
    if(response.status !== 200){
      throw new Error("Something went wrong! Could not get city information.");
    }
    const data = await response.json();
    return data[0];
  }
  async getWeather(cityKey) {
    const query = `${cityKey}?apikey=${this.key}`;
    const response = await fetch(this.weatherURI + query);
    if(response.status !== 200){
      throw new Error("Something went wrong! Could not get weather information.");
    }
    const data = await response.json();
    return data;
  }
  // get worldwide countries top cities
  async getTopCountryCities() {
    const response = await fetch("db/cities.json");
    const data = await response.json();
    return data;
  };
}
