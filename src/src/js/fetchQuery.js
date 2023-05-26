// import { Notify } from "notiflix";
import axios from 'axios';

export async function fetchQuery(query, page) {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '36718920-ea0d15de6c7dfa9439d7f0740';
    const params = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: '40',
      page,
    });
    return await axios.get(`${BASE_URL}?key=${KEY}&q=${query}&${params}`)
    // return (
    //   await axios
    //     .get(`${BASE_URL}?key=${KEY}&q=${query}&${params}`)
    //     .then(response => {
    //       // console.log(response);
    //       return response;
    //     })
        // .then(data => data)
        // .catch(error => {
        //   Notify.failure(error.message);
        //   // console.error();
        // })
  }
  