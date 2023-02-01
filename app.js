let countries="";
let cities="";
let selectedCountry="";
let selectedCity="";

const countrySelect= document.querySelector(".country-select");
const weatherInfo=document.querySelector(".weather-info")
const bok=document.querySelector(".bok")

window.onload = function () {
    getCountriesDataFromRestApi();
  };
  
//? Ülkelerin isimlerini select box'a getir 
const getCountriesDataFromRestApi=async()=>{
    
try {
    const res = await fetch(`https://restcountries.com/v3.1/all`);
  if (!res.ok) {
    renderError(`Something went wrong:${res.status}`);
      throw new Error();
}
    const data=await res.json();
    getCountryNames(data)
} catch (error) {
console.log(error);
        }
};



const getCountryNames=(data)=>{
countries=data;
// console.log( "ülke dataları", countries);
countries.forEach((country) => {
  document.querySelector(".form-select").innerHTML += `
    <option value='${country.name.common}'>${country.name.common}</option> `;
  });
}





countrySelect.addEventListener("change",(e)=>{
    const countryName=e.target.value;
    if (countryName) {
        const country=countries.filter(country=>country.name.common===countryName);
        selectedCountry=country[0].name.common;
        renderCountry(country[0])
    }
    weatherInfo.innerHTML=`
    <select class="weather-select"></select>
    <div class="weather">bok</div>
    `
    
       fetch(`https://countriesnow.space/api/v0.1/countries/population/cities`)
       .then(res=>res.json())
       .then(data=>getCityNames(data))
       
const getCityNames=(data)=>{
cities=data.data;
  console.log( "şehir dataları", cities);
  const countryName=e.target.value;
  console.log(countryName);
  if (countryName) {
      const city=cities.filter(city=>city.country===countryName);


     city.map((city)=>{
      document.querySelector(".weather-select").innerHTML+=`
      <option value='${city.city}'>${city.city}</option>
      `
      console.log(selectedCity);
     })
}} 
document.querySelector(".weather-select").addEventListener("change",()=>{
  getWeatherDataByCityName(selectedCity[0])

})



})


const renderCountry=(selectedCountryData)=>{
  const countriesInfo=document.querySelector(".countries-info");
  // console.log(selectedCountryData);
  const{name:{common},currencies, capital, languages, maps:{googleMaps},population,flags:{svg},region,borders }=selectedCountryData;
  countriesInfo.innerHTML=`
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
    <i class="fa-solid fa-map-location-dot"></i><span class="fw-bold"> Map:</span> <a href=${
      googleMaps
    } target='_blank'> Go to google map</a> </li>
  </ul>
</div>
  `

}




//? Ülkelerin hava durumu bilgisini al
const getWeatherDataByCityName= async(selectedCity)=>{
    const API_KEY="f4a43088e4b5cd3c7f24923585afd1d9"; 
    const URL= `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric&?lang=tr`
try {
    const res= await fetch(URL);
    if (!res.ok) {
        throw new Error("Something went wrong in openweathermap api");
    }
const data=await res.json();
// console.log("Ülke hava durumu datası", data);
rendersCountrysWeather(data);
} catch (error) {
// renderErrors(error)
}
}






const rendersCountrysWeather=(cityData)=>{
   
const {name,main:{temp, feels_like,temp_max
,temp_min }, weather, wind:{deg, gust, speed},sys:{country}}=cityData;
console.log(name, temp,feels_like,weather[0].id);

bok.innerHTML=`
<div class="city">
<div class="city-name">${name}<sup>${country}</sup> </div>
<div class="city-temp">${temp}<sup>&#8451</></div>
<div class="city-icon"> <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="img"></div>
<div> <figcaption>${weather[0].main}</figcaption></div>
</div>
`+bok.innerHTML
}


























//! Hataları doma bas 
// const renderErrors=(error)=>{
//     console.log(error);
//     }
//     renderErrors()