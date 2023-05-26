import { fetchQuery } from './src/js/fetchQuery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.form-input');
const gallery = document.querySelector('.gallery');
const marker = document.querySelector('.marker');

let lightbox = new SimpleLightbox('.gallery div a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  scrollZoom: false,
});

// -----------------------------//--------------------------

searchForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  // console.log(`before trim - ${searchInput.value}`)
  page = 1;
  const value = searchInput.value.trim();
  // console.log(`after trim - ${value}`)
  if (value !== '') {
    fetchQuery(value, page)
      .then(response => {
        console.log(response);
        // gallery.innerHTML = markup(response);
        if (response.data.totalHits > 0) {
          Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
          gallery.innerHTML = markup(response);
          lightbox.refresh();
        } else {
          Notify.warning(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        lightbox.refresh();
      });
  } else {
    Notify.info(
      `It seems you didn't write enything, please specify what exactly you are looking for`
    );
  }
}

function markup(obj) {
  const arrHits = obj.data.hits;
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
        lightbox.refresh();
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

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

function smoothScroll(gallery, step) {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * step,
    behavior: 'smooth',
  });
}
