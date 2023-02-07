let countries = "";

// let selectedCountry = "";

const countrySelect = document.querySelector(".country-select");
const weatherInfo = document.querySelector(".weather-info");

window.onload = function () {
  getCountriesDataFromRestApi();
};

//? Ülkelerin isimlerini select box'a getir
const getCountriesDataFromRestApi = async () => {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/all`);
    if (!res.ok) {
      renderError(`Something went wrong:${res.status}`);
      throw new Error();
    }
    const data = await res.json();
    getCountryNames(data);
  } catch (error) {
    console.log(error);
  }
};

const getCountryNames = (data) => {
  countries = data;
  // console.log( "ülke dataları", countries);
  countries.forEach((country) => {
    document.querySelector(".form-select").innerHTML += `
    <option value='${country.name.common}'>${country.name.common}</option> `;
  });
};

countrySelect.addEventListener("change", (e) => {
  const countryName = e.target.value;
  if (countryName) {
    const country = countries.filter(
      (country) => country.name.common === countryName
    );
    // selectedCountry = country[0].name.common;
    renderCountry(country[0]);
  }
  weatherInfo.innerHTML = `
    <div class="weather-container"></div>
    `;

  fetch(`https://countriesnow.space/api/v0.1/countries`)
    .then((res) => res.json())
    .then((data) => getCityNames(data));

  const getCityNames = (data) => {
    cities = data.data;
    getWeatherDataByCityName(e.target.value);
    const countryName = e.target.value;

    if (countryName) {
      const city = cities.filter((city) => city.country == countryName);

      const sehirler = city[0].cities;
      console.log(sehirler[0]);

      document.querySelector(".cities").innerHTML = `
      <p> Please select from ${countryName}'s cities</p>
      <select class="cities-select-box form-select w-50"><select>
      `;

      for (let i = 0; i < cities.length; i++) {
        document.querySelector(".cities-select-box").innerHTML += `
        <option value="${sehirler[i]}">${sehirler[i]}</option>`;
      }
    }
    document
      .querySelector(".cities-select-box")
      .addEventListener("change", (e) => {
        console.log(e.target.value);
        getWeatherDataByCityName(e.target.value);
      });
  };
});

const renderCountry = (selectedCountryData) => {
  const countriesInfo = document.querySelector(".countries-info");
  // console.log(selectedCountryData);
  const {
    name: { common },
    currencies,
    capital,
    languages,
    maps: { googleMaps },
    population,
    flags: { svg },
    region,
    borders,
  } = selectedCountryData;
  countriesInfo.innerHTML = `
  <div class="card shadow-lg" style="width: 22rem">
  <img src="${svg}" class="card-img-top shadow" alt="..." />
  <div >
    <h5 class="p-2 text-center">${common}</h5>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <i class="fa-solid fa-earth-oceania"></i><span class="fw-bold"> Region:</span> ${region}
    </li>
    <li class="list-group-item">
      <i class="fas fa-lg fa-landmark"></i>
      <span class="fw-bold"> Capitals:</span> ${capital}
    </li>
    <li class="list-group-item">
      <i class="fas fa-lg fa-comments"></i>
      <span class="fw-bold"> Languages:</span> ${Object.values(languages)}
    </li>
    <li class="list-group-item">
      <i class="fas fa-lg fa-money-bill-wave"></i>
      <span class="fw-bold"> Currencies:</span> ${
        Object.values(currencies)[0].name
      },
      ${Object.values(currencies)[0].symbol}
    </li>
    <li class="list-group-item">
    <i class="fa-solid fa-people-group"></i></i>
    <span class="fw-bold"> Population:</span> ${population.toLocaleString(
      "en-US"
    )}
  </li>
    <li class="list-group-item">
    <i class="fa-sharp fa-solid fa-road-barrier"></i>
    <span class="fw-bold"> Borders:</span>  ${borders ? borders : "None"}
  </li>
  </li>
  <li class="list-group-item">
    <i class="fa-solid fa-map-location-dot"></i><span class="fw-bold"> Map:</span> <a href=${googleMaps} target='_blank'> Go to google map</a> </li>
  </ul>
</div>
  `;
};

//? Ülkelerin hava durumu bilgisini al
const getWeatherDataByCityName = async (selectedCity) => {
  const API_KEY = "f4a43088e4b5cd3c7f24923585afd1d9";
  const lang = "tr";
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric&lang=tr`;
  try {
    const res = await fetch(URL);
    if (!res.ok) {
      throw new Error("Something went wrong in openweathermap api");
    }
    const data = await res.json();
    // console.log("Ülke hava durumu datası", data);
    rendersCountrysWeather(data);
  } catch (error) {
    // renderErrors(error)
  }
};

const rendersCountrysWeather = (cityData) => {
  const body = document.querySelector("body");
  const {
    name,
    main: { temp, feels_like, temp_max, temp_min },
    weather,
    wind: { deg, gust, speed },
    sys: { country },
  } = cityData;

  const setupBodyStyle = () => {
    body.style.backgroundPosition = "center center";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundSize = "cover";
    return (
      body.style.backgroundPosition,
      body.style.backgroundRepeat,
      body.style.backgroundSize
    );
  };
  console.log("178", weather[0].description);

  switch (weather[0].description) {
    case "kapalı":
      body.style.background = `url("weather-animations/fog.gif")`;
      setupBodyStyle();
      weatherInfo.innerHTML = `
      <div class="card" style="width: 18rem;">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Şehir: ${name}</li>
        <li class="list-group-item">Sıcaklık: ${temp}<sup>&#8451</li>
        <li class="list-group-item">Hissedilen ${Math.Round(
          feels_like
        )}<sup>&#8451</li>
        <li class="list-group-item">MAX Sıcaklık: ${Math.Round(
          temp_max
        )}<sup>&#8451</li>
        <li class="list-group-item">MIN Sıcaklık: ${Math.Round(
          temp_min
        )}<sup>&#8451</li>
        <li class="list-group-item">Hava Durumu: ${weather[0].description.toUpperCase()}.</li>
        <li class="list-group-item">Rüzgar Hızı: ${speed}</li>
      </ul>
      <div class="card-footer">
      ${country}
      </div>
    </div>
`;
      break;

    case "açık":
      body.style.background = `url("weather-animations/clear.gif")`;
      setupBodyStyle();
      weatherInfo.innerHTML = `
   
      <div class="card" style="width: 18rem;">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Şehir: ${name}</li>
        <li class="list-group-item">Sıcaklık: ${Math.round(
          temp
        )}<sup>&#8451</li>
        <li class="list-group-item">Hissedilen ${Math.round(
          feels_like
        )}<sup>&#8451</li>
        <li class="list-group-item">MAX Sıcaklık: ${Math.round(
          temp
        )}<sup>&#8451</li>
        <li class="list-group-item">MIN Sıcaklık: ${Math.round(
          temp_min
        )}<sup>&#8451</li>
        <li class="list-group-item">Hava Durumu: ${weather[0].description.toUpperCase()}</li>
        <li class="list-group-item">Rüzgar Hızı: ${speed}</li>
      </ul>
      <div class="card-footer">
      ${country}
      </div>
    </div>
      `;
      break;

    case "parçalı bulutlu":
      body.style.background = `url("weather-animations/clouds.gif")`;
      setupBodyStyle();
      weatherInfo.innerHTML = `
   
      <div class="card" style="width: 30rem;">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Şehir: ${name}</li>
        <li class="list-group-item">Sıcaklık: ${Math.round(
          temp
        )}<sup>&#8451</></li>
        <li class="list-group-item">Hissedilen ${Math.round(
          feels_like
        )}<sup>&#8451</></li>
        <li class="list-group-item">MAX Sıcaklık: ${Math.round(
          temp_max
        )}<sup>&#8451</></li>
        <li class="list-group-item">MIN Sıcaklık: ${Math.round(
          temp_min
        )}<sup>&#8451</></li>
        <li class="list-group-item">Hava Durumu: ${weather[0].description.toUpperCase()}</li>
        <li class="list-group-item">Rüzgar Hızı: ${speed}</li>
      </ul>
      <div class="card-footer">
      ${country}
      </div>
    </div>
      `;
      break;

    case "hafif kar yağışlı":
      body.style.background = `url("weather-animations/snow.gif")`;
      setupBodyStyle();
      weatherInfo.innerHTML = `
   
      <div class="card" style="width: 18rem;">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Şehir: ${name}</li>
        <li class="list-group-item">Sıcaklık:${Math.round(
          temp
        )}<sup>&#8451</></li>
        <li class="list-group-item">Hissedilen Sıcaklık: ${Math.round(
          feels_like
        )}<sup>&#8451</></li>
        <li class="list-group-item">MAX Sıcaklık: ${Math.round(
          temp_max
        )}<sup>&#8451</></li>
        <li class="list-group-item">MIN Sıcaklık: ${Math.round(
          temp_min
        )}<sup>&#8451</></li>
        <li class="list-group-item">Hava Durumu: ${weather[0].description.toUpperCase()}</li>
        <li class="list-group-item">Rüzgar Hızı: ${speed}</li>
      </ul>
      <div class="card-footer">
      ${country}
      </div>
    </div>
      `;

      break;
    case "hafif kar duşu":
      body.style.background = `url("weather-animations/snow.gif")`;
      setupBodyStyle();
      weatherInfo.innerHTML = `
  
      <div class="card" style="width: 18rem;">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Şehir: ${name}</li>
        <li class="list-group-item">Sıcaklık: ${Math.Round(
          temp
        )}<sup>&#8451</></li>
        <li class="list-group-item">Hissedilen Sıcaklık: ${Math.Round(
          feels_like
        )}<sup>&#8451</></li>
        <li class="list-group-item">MAX Sıcaklık: ${Math.Round(
          temp_max
        )}<sup>&#8451</></li>
        <li class="list-group-item">MIN Sıcaklık: ${Math.Round(
          temp_min
        )}<sup>&#8451</></li>
        <li class="list-group-item">Hava Durumu: ${weather[0].description.toUpperCase()}</li>
        <li class="list-group-item">Rüzgar Hızı: ${speed}</li>
      </ul>
      <div class="card-footer">
      ${country}
      </div>
    </div>
  
      `;
      break;

    case "hafif yağmur":
      body.style.background = `url("weather-animations/rain.gif")`;
      setupBodyStyle();
      weatherInfo.innerHTML = `
  
      <div class="card" style="width: 18rem;">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Şehir: ${name}</li>
        <li class="list-group-item">Sıcaklık: ${Mat.Round(
          temp
        )}<sup>&#8451</></li>
        <li class="list-group-item">Hissedilen Sıcaklık: ${Mat.Round(
          feels_like
        )}</li>
        <li class="list-group-item">MAX Sıcaklık: ${Math.Round(
          temp_max
        )}<sup>&#8451</></li>
        <li class="list-group-item">MIN Sıcaklık: ${Math.Round(
          temp_min
        )}<sup>&#8451</></li>
        <li class="list-group-item">Hava Durumu: ${weather[0].description.toUpperCase()}</li>
        <li class="list-group-item">Rüzgar Hızı: ${speed}</li>
      </ul>
      <div class="card-footer">
     Ülke: ${country}
      </div>
    </div>
  
      `;

      break;

    default:
      break;
  }
};

//! Hataları doma bas
// const renderErrors=(error)=>{
//     console.log(error);
//     }
//     renderErrors()
