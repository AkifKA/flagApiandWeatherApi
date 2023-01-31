let countries="";
let selectedCountry="";
const select= document.querySelector(".form-select");
window.onload = function () {
    getCountriesDataFromRestApi();
  };
  
//? Ülkelerin isimlerini select box'a getir 
const getCountriesDataFromRestApi=async()=>{
    
try {
    const res = await fetch(`https://restcountries.com/v3.1/all`);
  if (!res.ok) {
    renderError(`Something went wrong`);
      throw new Error();
}
    const data=await res.json();
    getCountryNames(data)
} catch (error) {
console.log(error);
        }
};



// const getCountriesDataFromRestApi = async () => {
//     try {
//       const res = await fetch(`https://restcountries.com/v3.1/all`);
//       if (!res.ok) {
//         renderError(`Something went wrong:${res.status}`);
//         throw new Error();
//       }
//       const data = await res.json();
//       getCountryNames(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };



const getCountryNames=(data)=>{
countries=data;
console.log( "ülke dataları", countries);
countries.forEach((country) => {
  document.querySelector(".form-select").innerHTML += `
    <option value='${country.name.common}'>${country.name.common}</option> `;
  });
}

select.addEventListener("change",(e)=>{
    const countryName=e.target.value;
    if (countryName) {
        const selectedCountry=countries.filter(country=>country.name.common===countryName);
        renderCountry(selectedCountry[0])
    }
})






//? Ülkelerin hava durumu bilgisini al
const getWeatherDataByCityName= async(cityName)=>{
    const API_KEY="f4a43088e4b5cd3c7f24923585afd1d9"; 
    const URL= `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&?lang=tr`
try {
    const res= await fetch(URL);
    if (!res.ok) {
        throw new Error("Something went wrong in openweathermap api");
    }
const data=await res.json();
// console.log("Ülke hava durumu datası", data);
// rendersCountrysWeather(data);
} catch (error) {
// renderErrors(error)
}
}
// getWeatherDataByCityName("kayseri")
getWeatherDataByCityName("izmir")
getWeatherDataByCityName("istanbul")
getWeatherDataByCityName("muğla")
getWeatherDataByCityName("london")




const rendersCountrysWeather=(cityData)=>{
    const cities=document.querySelector(".cities");
const {name,main:{temp, feels_like,temp_max
,temp_min }, weather, wind:{deg, gust, speed},sys:{country}}=cityData;
console.log(name, temp,feels_like,weather[0].id);
cities.innerHTML=`
<div class="city">
<div class="city-name">${name}<sup>${country}</sup> </div>
<div class="city-temp">${temp}<sup>&#8451</></div>
<div class="city-icon"> <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="img"></div>
<div> <figcaption>${weather[0].main}</figcaption></div>
</div>
`+cities.innerHTML
}


























//! Hataları doma bas 
// const renderErrors=(error)=>{
//     console.log(error);
//     }
//     renderErrors()