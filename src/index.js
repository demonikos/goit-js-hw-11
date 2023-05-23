import './css/styles.css';
// import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const countryInput = document.querySelector('#search-box');

countryInput.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function inputHandler(inputValue) {
    // const newValue = inputValue.trim();
    // checkSpaces(inputValue);
    inputValue.preventDefault();
    // inputValue.trim();
    if (inputValue.target.value === ""){
        return
        // console.log()
    }
    else {
    fetchCountries(inputValue.target.value.trim())
    .then(value => {
            if (value.length === 1) {
                clearMarkups();
                countryInfo.innerHTML = createCountryMarkup(value);
            }
            else if (value.length <= 10 && value.length > 1){
                clearMarkups();
                countryList.innerHTML = createFewCountriesMarkup(value);
            }
            else if (value.length > 10){
                clearMarkups();            
                // console.log("too many countries!")
                Notify.info('Too many matches found. Please enter a more specific name.');
            }
        }
    )
        .catch(error => {
    if (error.message === 'Not Found') {
        Notify.failure('Oops, there is no country with that name');
        // console.dir(error);
    } else {
        Notify.failure(error.message);
        console.dir(error);
    }
        });


}
}

function createCountryMarkup(obj){
    // fetchCountries(obj);
    return obj.map(({name: {official}, capital, languages, population, flags: {svg},}) => {
        const langValues = Object.values(languages).join(', ');
        return (`
            <div class = "country-wrap">
            <img class = "solo-img" src="${svg}" alt="">
            <h2>${official}</h2>
            </div>
            <ul>
            <li class="country-data"><span>Capital</span>: ${capital}</li>
            <li class="country-data"><span>Population</span>: ${population}</h3>
            <li class="country-data"><span>Languages</span>: ${langValues}</li>
            </ul>
            `)
    }).join('');
}

function createFewCountriesMarkup(obj){
    return obj.map(({name: {official}, flags: {svg},}) => {
        return (`
        <div class = "country-wrap">
        <img class = "solo-img" src="${svg}" alt="">
        <h2>${official}</h2>
        </div>
        `)
    }).join('');      
}

function clearMarkups(){
    countryInfo.innerHTML = "";
    countryList.innerHTML = "";
}