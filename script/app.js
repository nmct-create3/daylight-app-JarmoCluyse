'use strict';
let sun, timeLeft, totmin, riseandshine, setyouslet;

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}
const DoesTheSunShine = function () {
	if ((Date.now() /1000) > setyouslet)
	{
		console.log('bravo six going dark');
	}
};
// 5 TODO: maak updateSun functie
const UpdateSun = function () {

	console.log('update');
	
	let passedmin = (Date.now() /1000 - riseandshine) /60
	let leftchange = passedmin / totmin *100;
	let bottomchange;
	if (leftchange > 50)
	{
		bottomchange = (100-leftchange) *2
	}
	else
	{
		bottomchange =  leftchange * 2
	}
	sun.style["cssText"] = `bottom: ${bottomchange}%; left: ${leftchange}%`;
	sun.dataset["time"] = `${_parseMillisecondsIntoReadableTime(Date.now()/1000)}`;
	timeLeft.innerHTML = `${Math.round(totmin - passedmin)}`;
	DoesTheSunShine()

}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	totmin = totalMinutes
	riseandshine = sunrise
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	sun = document.querySelector('.js-sun')
	timeLeft = document.querySelector('.js-time-left')
	// Bepaal het aantal minuten dat de zon al op is.
	let passedmin = (Date.now() /1000 - sunrise) /60
	console.log(passedmin);
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	let leftchange = passedmin / totalMinutes *100;
	let bottomchange;
	if (leftchange > 50)
	{
		bottomchange = (100-leftchange) *2
	}
	else
	{
		bottomchange =  leftchange * 2
	}
	sun.style["cssText"] = `bottom: ${bottomchange}%; left: ${leftchange}%`;
	sun.dataset["time"] = `${_parseMillisecondsIntoReadableTime(Date.now()/1000)}`;
	console.log(sun.dataset);
	 
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	document.querySelector("body").classList.add(".is-loaded")
	// Vergeet niet om het resterende aantal minuten in te vullen.
	timeLeft.innerHTML = `${Math.round(totalMinutes - passedmin)}`;
	// Nu maken we een functie die de zon elke minuut zal updaten
	setInterval(UpdateSun, 5 * 1000);
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	console.log(queryResponse);
	console.log(queryResponse.city.name);
	document.querySelector('.js-location').innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	document.querySelector('.js-sunrise').innerHTML = `${_parseMillisecondsIntoReadableTime(queryResponse.city.sunrise)}`;
	document.querySelector('.js-sunset').innerHTML = `${_parseMillisecondsIntoReadableTime(queryResponse.city.sunset)}`;
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	setyouslet = queryResponse.city.sunset
	let minutes = (queryResponse.city.sunset - queryResponse.city.sunrise) / 60
	console.log(minutes);
	placeSunAndStartMoving(minutes, queryResponse.city.sunrise)
	DoesTheSunShine();

	
	
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Eerst bouwen we onze url op
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.
	let APIKey = 'b41e5df13ce9a059c39db50348a756bd';
	let uri = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric&lang=nl&cnt=1`;
	fetch(uri)
		.then(function(response) {
			if (!response.ok) {
				throw Error(
					`Looks like there was a problem. Status Code: ${response.status}`
				);
			} else {
				return response.json();
			}
		})
		.then(function(jsonObject) {
			showResult(jsonObject);
		})
		.catch(function(error) {
			console.error(`fout bij verwerken json ${error}`);
		});
};

document.addEventListener('DOMContentLoaded', function() {
	console.log('domcontent loaded 👍');
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
