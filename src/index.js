import { fetchQuery, PER_PAGE } from './src/js/fetchQuery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.form-input');
const gallery = document.querySelector('.gallery');
const marker = document.querySelector('.marker');

const options = {
  rootMargin: '0px',
  threshold: 1
}

const observer = new IntersectionObserver(observerCallback, options);
// const lastGalleryElem = new IntersectionObserver(lastElemObserver, options);

let lightbox = new SimpleLightbox('.gallery div a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  scrollZoom: false,
});

let page = 0;

searchForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  observer.unobserve(marker);
  const value = searchInput.value.trim();
  // console.log(`after trim - ${value}`)
  if (value !== '') {
    fetchQuery(value, page)
      .then(response => {
        if (response.data.totalHits > 0) {
          Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
          gallery.insertAdjacentHTML('beforeend', markup(response));
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
        observer.observe(marker);
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

function smoothScroll(gallery, step) {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * step,
    behavior: 'smooth',
  });
}

function observerCallback(entries){
  entries.forEach(entry => {
    if (entry.isIntersecting === true) {
      page +=1;
      fetchQuery(searchInput.value, page)
      .then(response => {
        // console.log(response);
          // Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
          gallery.insertAdjacentHTML('beforeend', markup(response));
          console.log(response);
          const lastPage = Math.ceil(response.data.totalHits / PER_PAGE);
          console.log(lastPage);
          // lightbox.refresh();
          smoothScroll(gallery, 2)
          if (page === lastPage){
            observer.unobserve(marker);
            Notify.info(`We're sorry, but you've reached the end of search results.`);
          }
      })
      .catch(error => console.log(error))
      .finally(() => {
        lightbox.refresh();
      });
    }
  })
}

// function lastElemObserver(entries){
//   entries.forEach(entry => {
//     if (entry.isIntersecting === true){
//       Notify.info(`We're sorry, but you've reached the end of search results.`);
//       lastElem.unobserve(lastElemMarker);
//     }
//   })
// }

// function scrollTracking(entries) {
//   entries.forEach(entry => )
// }

// const newObserver = new IntersectionObserver(scrollTracking, {
//     threshold: 1
// });

// newObserver.observe(gallery.lastElementChild);
