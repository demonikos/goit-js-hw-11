import { fetchQuery } from './fetchQuery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.form-input');
const gallery = document.querySelector('.gallery');

let lightbox = new SimpleLightbox('.gallery div a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});

// countryInput.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

// function inputHandler(inputValue) {
//     // const newValue = inputValue.trim();
//     // checkSpaces(inputValue);
//     inputValue.preventDefault();
//     // inputValue.trim();
//     if (inputValue.target.value === ""){
//         return
//         // console.log()
//     }
//     else {
//     fetchCountries(inputValue.target.value.trim())
//     .then(value => {
//             if (value.length === 1) {
//                 clearMarkups();
//                 countryInfo.innerHTML = createCountryMarkup(value);
//             }
//             else if (value.length <= 10 && value.length > 1){
//                 clearMarkups();
//                 countryList.innerHTML = createFewCountriesMarkup(value);
//             }
//             else if (value.length > 10){
//                 clearMarkups();
//                 // console.log("too many countries!")
//                 Notify.info('Too many matches found. Please enter a more specific name.');
//             }
//         }
//     )
//         .catch(error => {
//     if (error.message === 'Not Found') {
//         Notify.failure('Oops, there is no country with that name');
//         // console.dir(error);
//     } else {
//         Notify.failure(error.message);
//         console.dir(error);
//     }
//         });

// }
// }


// -----------------------------//--------------------------

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = searchInput.value;
  //   console.log(`this is value - ${value}`);
  fetchQuery(value)
    .then(result => {
      // console.log(typeof(result));
      console.log(markup(result));
      gallery.innerHTML = markup(result);
    })
    .catch(error => console.log(error));
});

function markup(obj) {
  // const newObj = JSON.parse(obj);
  // console.log(typeof(newObj));
  const arrHits = obj.data.hits;
  console.log(arrHits);
  console.log(typeof arrHits);

  return arrHits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <div class="photo-card">
        <div class="photo-wrap">
            <a href="${largeImageURL}">
                <img class="card-image" src="${webformatURL}" alt="${tags}" loading="lazy" />  
            </a>
        </div>
        <div class="info">
            <p class="info-item">
                <b>Likes</b>:</br>${likes}
            </p>
            <p class="info-item">
                <b>Views</b>:</br>${views}
            </p>
            <p class="info-item">
                <b>Comments</b>:</br>${comments}
            </p>
            <p class="info-item">
                <b>Downloads</b>:</br>${downloads}
            </p>
        </div>
    </div>
            `;
      }
    )
    .join('');
}
