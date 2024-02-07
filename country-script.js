let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.querySelector('#dark-mode-toggle');
const countryName = new URLSearchParams(location.search).get('name');

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

const displayCountry = (country) =>{
    const singleCountry = document.createElement('div');
    singleCountry.classList.add('container', 'grid');
    singleCountry.innerHTML= `
            <div>
                <img src="${country.flags.svg}" alt="${country.name.common} flag">
            </div>
            <div class="flow">
                <h2 class="fs-900">${country.name.common}</h2>
                <div class="flex country-details">
                    <div class="flow">
                        <p class="fw-bold">Native Name: <span class="fw-light">${Object.values(country.name.nativeName)[0].common}</span></p>
                        <p class="fw-bold">Population: <span class="fw-light">${country.population.toLocaleString('en-US')} </p>
                        <p class="fw-bold">Region: <span class="fw-light">${country.region}</span></p>
                        <p class="fw-bold">Sub Region: <span class="fw-light">${country.subregion}</span></p>
                        <p class="fw-bold">Capital: <span class="fw-light">${country.capital}</span></p>
                    </div>
                    <div class="flow">
                        <p class="fw-bold">Top Level Domain: <span class="fw-light">${country.tld[0]}</span></p>
                        <p class="fw-bold">Currencies: <span class="fw-light">${Object.values(country.currencies)[0].name}</span></p>
                        <p class="fw-bold">Languages: <span class="fw-light">${Object.values(country.languages).join(', ')}</span></p>
                    </div>
                </div>
                <p class="fw-bold fs-600">Border Countries:</p>
                <div id="border-countries" class="flex" style="--gap:1rem">
                </div>
            </div>
    `;
    document.getElementsByTagName('main')[0].appendChild(singleCountry);
}

darkModeToggle.addEventListener('click', () =>{
    darkMode = localStorage.getItem('darkMode');

    if(darkMode !== 'enabled'){
        enableDarkMode();
    } else{
        disableDarkMode();
    }
})

const getBordersURL = (country) =>{
    let url = 'https://restcountries.com/v3.1/alpha?codes='
    country.borders.forEach((border) => {
        url += `${border},`
    });
    return url;
}

const createButtons = (buttons) => {
    buttons.forEach((button) => {
        console.log(button.name.common);
        const borderButton = document.createElement('a')
        borderButton.href = `/country.html?name=${button.name.common}`;
        borderButton.innerHTML = `<div>
        <button class="btn">${button.name.common}</button>
        </div>`;
        document.querySelector('#border-countries').appendChild(borderButton);
    })
}

async function getBorderCountries(url){
    try{
        const response = await fetch(url);
        const data = await response.json();
        createButtons(data);
    }
    catch(error){
        console.error(`Error: ${error}`);
    }
    
} 


fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
.then((res) => res.json())
.then(([country]) => {
    displayCountry(country);
    getBorderCountries(getBordersURL(country));
})

