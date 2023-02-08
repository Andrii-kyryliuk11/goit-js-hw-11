import API from './API';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const api = new API();
let lightbox = new SimpleLightbox('.gallery a');
let totalHits = 0;
let request = '';

const refs = {
  button: document.querySelector("[type='submit']"),
  form: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onsub);
refs.loadMore.addEventListener('click', onLoadMoreClick);

async function onsub(e) {
  e.preventDefault();
  api.page = 1;
  request = refs.input.value.trim();
  refs.loadMore.classList.add('hidden');
  if (request === '') {
    Notiflix.Notify.failure(`Please,type something.`);
    return;
  }
  refs.form.classList.add('search-form__submited');
  refs.gallery.innerHTML = '';
  try {
    const goFetch = await api.fetchImages(request);
    totalHits = goFetch.data.totalHits;
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    return onFetchResult(goFetch);
  } catch (error) {
    console.log(error);
  }
}

function onFetchResult(response) {
  totalHits = response.data.totalHits;
  if (totalHits === 0) {
    refs.loadMore.classList.add('hidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return;
  }
  createMarkup(response);

  if (totalHits <= api.perPage) {
    refs.loadMore.classList.add('hidden');
    return;
  }

  refs.loadMore.classList.remove('hidden');
}

function createMarkup(response) {
  const array = [];
  response.data.hits.forEach(image => {
    array.push(
      `<a class="gallery__item" href="${image.largeImageURL}">
          <div class="photo-card">
  <img class="gallery__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${image.downloads}</span>
    </p>
  </div>
</div>
</a>`
    );
  });
  refs.gallery.insertAdjacentHTML('beforeend', array.join(''));

  lightbox.refresh();
}

async function onLoadMoreClick() {
  api.page += 1;
  try {
    const goFetch = await api.fetchImages(request);
    totalHits = goFetch.data.totalHits;
    onFetchResult(goFetch);
    if (totalHits <= api.page * api.perPage) {
      refs.loadMore.classList.add('hidden');
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  } catch (error) {
    console.log(error);
  }
}
