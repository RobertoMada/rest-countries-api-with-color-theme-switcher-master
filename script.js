let darkMode = localStorage.getItem('darkMode');
const regionSelected = document.querySelector('#region');
const countryCont = document.querySelector('.country-container');
const inputCountry = document.querySelector('#country');
let timer;
let countryArr = []

const allCountry = 'https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital';

const darkModeToggle = document.querySelector('#dark-mode-toggle');

const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkMode', null);
}

if(darkMode === 'enabled'){
    enableDarkMode();
}

darkModeToggle.addEventListener('click', () =>{
    darkMode = localStorage.getItem('darkMode');

    if(darkMode !== 'enabled'){
        enableDarkMode();
    } else{
        disableDarkMode();
    }
})

async function getData(url){
    try{
        const response = await fetch(url);
        const data = await response.json();
        countryArr = data;
        countryArr.forEach((country) => {
            displayCountry(country);
        });
    }
    catch(error){
        console.error(`Error: ${error}`);
    }
}

function displayCountry(country){

    const singleCountry = document.createElement('div');
    singleCountry.classList.add('box-shadow', 'country');
    singleCountry.innerHTML= `
        <a href="/country.html?name=${country.name.common}">
        <div class="flag">
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        </div>
        <div class="country-info flow">
            <h2>${country.name.common}</h2>
            <p class="fw-bold">Population: <span class="fw-light">${country.population.toLocaleString('en-US')}</span></p>
            <p class="fw-bold">Region: <span class="fw-light">${country.region}</span></p>
            <p class="fw-bold">Capital: <span class="fw-light">${country.capital}</span></p>
        </div>
        </a>
    `;
    countryCont.appendChild(singleCountry);
}

regionSelected.addEventListener('change', regionFilter);
inputCountry.addEventListener('keyup', countryFilter);

function regionFilter(){
    const value = regionSelected.value;
    if(value === 'all'){
        countryCont.replaceChildren();
        getData(allCountry)
    }else{
        countryCont.replaceChildren();
        getData(`https://restcountries.com/v3.1/region/${value}?fields=name,flags,population,region,capital`);
    }
}

function countryFilter(){
    const value = inputCountry.value.toLowerCase();
    clearTimeout(timer);
    if(value === ''){
        countryCont.replaceChildren();
        getData(allCountry);
    }else{
        timer = setTimeout(() =>{
            countryCont.replaceChildren();
            const match = countryArr.filter((country) => { return country.name.common.slice(0, value.length).toLowerCase() === value})
            match.forEach((country) => {
                displayCountry(country);
            })
        }, 500);
    }
}

getData(allCountry);


