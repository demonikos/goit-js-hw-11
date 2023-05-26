// import { Notify } from "notiflix";
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '36718920-ea0d15de6c7dfa9439d7f0740';
const PER_PAGE = 40;

async function fetchQuery(query, page) {
    const params = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: PER_PAGE,
      page,
    });
    return await axios.get(`${BASE_URL}?key=${KEY}&q=${query}&${params}`)
  }
  
  export {fetchQuery, PER_PAGE}