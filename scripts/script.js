const cityForm = document.forms["location"];
const cityCard = document.querySelector(".details-card");
const deatilsBox = document.querySelector(".details");
const time = document.querySelector(".time");
const icon = document.querySelector(".icon img");
const iconBox = document.querySelector(".icon");
const CountriesListBox = document.querySelector(".country-cities-list");
const mainInput = document.querySelector(".main-input");
const list = document.querySelector(".cities-list");

// new weather object
const weather = new Weather();

// general information main box
const infoBox = document.querySelector(".weather-box .info");

// show weather conditions 
const updateUI = data => {
  const { details, weather } = data;

  // update details template
  deatilsBox.innerHTML = `
    <h5 class="my-3">${details.EnglishName}</h5>
    <div class="my-3">${weather[0].WeatherText}</div>
    <div class="display-4 my-4">
      <span>${weather[0].Temperature.Metric.Value}</span>
      <span>&deg;C</span>
    </div>
  `;

  // show information in the main page
  if(cityCard.classList.contains("d-none")){
    cityCard.classList.remove("d-none");
  }

  // show current time image
  const img = weather[0].IsDayTime ? "imgs/day.svg" : "imgs/night.svg";
  time.setAttribute("src", img);

  // show weather icon
  icon.setAttribute("src", `imgs/icons/${weather[0].WeatherIcon}.svg`);
};

// show general information about the city
const generalInfo = data => {
  const { details, weather } = data;
  const day = dateFns.format(weather[0].LocalObservationDateTime, "ddd D");
  const time =  dateFns.format( weather[0].LocalObservationDateTime, "hh:mm");
  const html = `
    <div class="info-head d-flex gap-4 align-self-start w-100">
      <div class="degree d-flex flex-column align-items-start">
        <div class="data-time fs-6">
          <span>${day} | ${weather[0].isDayTime ? "Day" : "Night"}</span>
        </div>
        <div class="degree-number">
          <h2 class="display-4 fw-semibold">${weather[0].Temperature.Metric.Value}&deg;</h2>
        </div>
      </div>
      <div class="city-info">
        <span class="fs-4 lh-1 fw-semibold">${details.EnglishName}, ${details.Country.EnglishName}</span>
        <p class="text-black-50 mt-2 fs-6">${time}</p>
      </div>
    </div>
    <div class="info-body">
      <div class="general-info">
        <div class="info-box">
          <h2 class="display-6 mb-4 fs-4">General Information</h2>
          <div class="information d-flex gap-3 flex-wrap justify-content-between">
            <div class="">
              <span class="lead fs-6 text-uppercase">country</span>
              <p class="fw-semibold fs-4 text-capitalize mt-2">${details.Country.EnglishName}</p>
            </div>
            <div class="">
              <span class="lead fs-6 text-uppercase">city</span>
              <p class="fw-semibold fs-4 text-capitalize mt-2">${details.EnglishName}</p>
            </div>
            <div class="">
              <span class="lead fs-6 text-uppercase">type</span>
              <p class="fw-semibold fs-4 text-capitalize mt-2">${details.Type}</p>
            </div>
            <div class="">
              <span class="lead fs-6 text-uppercase">region</span>
              <p class="fw-semibold fs-4 text-capitalize mt-2">${details.Region.EnglishName}</p>
            </div>
          </div>
        </div>
        <div class="info-box">
          <h2 class="display-6 my-4 fs-4">Geo Position</h2>
          <div class="information d-flex gap-5 flex-wrap">
            <div class="">
              <span class="lead fs-6 text-uppercase">latitude</span>
              <p class="fw-semibold fs-4 text-capitalize mt-2">${details.GeoPosition.Latitude}</p>
            </div>
            <div class="">
              <span class="lead fs-6 text-uppercase">longitude</span>
              <p class="fw-semibold fs-4 text-capitalize mt-2">${details.GeoPosition.Longitude}</p>
            </div>
          </div>
        </div>
        ${
          details.PrimaryPostalCode 
          ? 
          `<div class="info-box">
            <h2 class="display-6 my-4 fs-4">Primary Postal Code</h2>
            <div class="information d-flex gap-3 flex-wrap justify-content-between">
              <div class="">
                <span class="lead fs-6 text-uppercase">postal code</span>
                <p class="fw-semibold fs-4 text-capitalize mt-2">${details.PrimaryPostalCode}</p>
              </div>
            </div>
          </div>` 
          : 
          ""
        }
        <div class="info-box">
          <h2 class="display-6 my-4 fs-4">Timezone</h2>
          <div class="information d-flex gap-5 flex-wrap">
            <div class="">
              <span class="lead fs-6 text-uppercase">name</span>
              <p class="fw-semibold fs-4 text-capitalize mt-2">${details.TimeZone.Name}</p>
            </div>
            <div class="">
              <span class="lead fs-6 text-uppercase">code</span>
              <p class="fw-semibold fs-4 text-capitalize mt-2">${details.TimeZone.Code}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="info-foot text-center">
      <a href="${weather[0].Link}" target="_blank">Full Details <i class="fas fa-angle-double-right"></i></a>
    </div>
  `;
  infoBox.classList.remove("d-none");
  infoBox.innerHTML = html;
};

// city form
cityForm.addEventListener("submit", e => {
  e.preventDefault();

  const cityName = cityForm.city.value.trim();
  if(cityName.length > 0){
    cityForm.reset();
    list.classList.add("d-none");
    cityCard.classList.add("show-loader");
    if(cityCard.classList.contains("d-none")){
      cityCard.classList.remove("d-none");
    }

    // general information skeleton screen
    infoBox.classList.remove("d-none");
    infoBox.classList.add("skeleton-wrapper");
    const skeletonScreen = `
      <div class="info-head d-flex gap-4 align-self-start w-100">
        <div class="degree d-flex flex-column align-items-start">
          <div class="data-time fs-6 skeleton-element sm-title">
          </div>
          <div class="degree-number skeleton-element thumbnail">
          </div>
        </div>
        <div class="city-info">
          <p class="fs-4 lh-1 fw-semibold skeleton-element lg-heading"></p>
          <p class="text-black-50 mt-2 fs-6 skeleton-element sm-title"></p>
        </div>
      </div>
      <div class="info-body">
        <div class="general-info">
          <div class="info-box">
            <h2 class="display-6 mb-4 fs-4 skeleton-element lg-title"></h2>
            <div class="information d-flex gap-3 flex-wrap justify-content-between">
              <div class="">
                <p class="lead fs-6 text-uppercase skeleton-element md-title"></p>
                <p class="fw-semibold fs-4 text-capitalize mt-2 skeleton-element lg-heading"></p>
              </div>
              <div class="">
                <p class="lead fs-6 text-uppercase skeleton-element md-title"></p>
                <p class="fw-semibold fs-4 text-capitalize mt-2 skeleton-element lg-heading"></p>
              </div>
              <div class="">
                <p class="lead fs-6 text-uppercase skeleton-element md-title"></p>
                <p class="fw-semibold fs-4 text-capitalize mt-2 skeleton-element lg-heading"></p>
              </div>
              <div class="">
                <p class="lead fs-6 text-uppercase skeleton-element md-title"></p>
                <p class="fw-semibold fs-4 text-capitalize mt-2 skeleton-element lg-heading"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    infoBox.innerHTML = skeletonScreen;
    weather.updateCity(cityName)
    .then(data => {
      if(data){
        cityCard.classList.remove("show-loader");
        deatilsBox.classList.remove("not-found");
        time.style.display = "block";
        iconBox.style.display = "block";
        infoBox.classList.remove("skeleton-wrapper");
        infoBox.classList.remove("d-none");
        cityCard.classList.remove("flex-grow-1");
        updateUI(data);
        generalInfo(data);
      }
      else{
        cityCard.classList.remove("show-loader");
        deatilsBox.classList.add("not-found");
        time.style.display = "none";
        iconBox.style.display = "none";
        infoBox.classList.add("d-none");
        cityCard.classList.add("flex-grow-1");
        deatilsBox.innerHTML = "Could find weather conditions related to the city that you've entered. Please make sure you entered a correct city name";
      }
    })
    .catch(err => console.log(err));
  }
});

// inject citie list to the UI
const injectCities = (title, list) => {
  // main div
  const div = document.createElement("div");
  div.className = "country-info";

  // h2 and code
  const h2 = document.createElement("h2");
  h2.textContent = title;

  // ul
  const ul = document.createElement("ul");
  list.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.setAttribute("data-city", city);
    ul.appendChild(li);
  });

  // append created elements to the box
  div.append(h2);
  div.append(ul);

  // append created elements to the main box
  CountriesListBox.append(div);
};

// search countries 
const search = document.querySelector(".search-country");
search.addEventListener("keyup", e => {
  const term = search.value.toLowerCase().trim();
  if(term.length > 0){
    // grap list of the cities
    if(e.keyCode === 13){
      // show list
      CountriesListBox.style.display = "block";
      weather.getTopCountryCities().then(data => {
        for(country in data){
          if(country.toLowerCase().includes(term)){
            injectCities(country, data[country]);
          }
        }
      });
    }

    // query all h2's
    const searchTerm = document.querySelectorAll(".country-info h2");
    searchTerm.forEach(h2 => {
      const value = h2.textContent;
      if(!value.trim().toLowerCase().includes(term)){
        h2.parentElement.style.display = "none";
      } else{
        h2.parentElement.style.display = "block";
      }
    }) 
  }
  else{
    CountriesListBox.style.display = "none";
  }
});

// show list while main input is focused
mainInput.addEventListener("focus", e => {
  e.stopPropagation();
  list.classList.remove("d-none");
})
mainInput.addEventListener("click", e => {
  e.stopPropagation();
  list.classList.remove("d-none");
})

// hide suggestions when body clicked
document.documentElement.addEventListener("click", () => {
  list.classList.add("d-none");
});

list.addEventListener("click", e => e.stopPropagation());

const watchElement = mutationList => {
  for(const mutation of mutationList){
    if(mutation.type === "childList"){
      //child node has been added or removed
      const li = CountriesListBox.querySelectorAll(".country-info ul li");
      li.forEach(item => {
        item.addEventListener("click", e => {
          mainInput.value = e.target.dataset.city;
          list.classList.add("d-none");
        }); 
      });
    }
  }
};

const observer = new MutationObserver(watchElement);
observer.observe(CountriesListBox, { childList: true });