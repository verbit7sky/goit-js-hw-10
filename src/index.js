import './css/styles.css';

const DEBOUNCE_DELAY = 300;

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

input.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput() {
  const name = input.value.trim();

  if (!name) {
    return (list.innerHTML = ''), (info.innerHTML = '');
  }

  fetchCountries(name)
    .then(countries => {
      list.innerHTML = '';
      info.innerHTML = '';

      if (countries.length === 1) {
        list.insertAdjacentHTML('beforeend', renderList(countries));
        info.insertAdjacentHTML('beforeend', renderInfo(countries));
      } else if (countries.length > 10) {
        alertTooManyMatches();
      } else {
        list.insertAdjacentHTML('beforeend', renderList(countries));
      }
    })
    .catch(alertWrongName);
}

function renderList(countries) {
  console.log(countries);
  return countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 70px >
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `;
    })
    .join('');
}

function renderInfo(countries) {
  return countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list" >
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(
              ', ',
            )}</p></li>
        </ul>
        `;
    })
    .join('');
}

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}
