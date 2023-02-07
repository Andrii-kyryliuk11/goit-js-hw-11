import API from './API';
let request = '';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const api = new API();
let totalHits = 0;

const refs = {
  button: document.querySelector("[type='submit']"),
  form: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
console.log(refs.gallery);
let lightbox = new SimpleLightbox('.gallery a');
lightbox.on('show.simplelightbox');

refs.form.addEventListener('submit', onsub);
refs.loadMore.addEventListener('click', onLoadMoreClick);

function onsub(e) {
  e.preventDefault();
  request = refs.input.value;

    refs.form.classList.add('search-form__submited');
    refs.gallery.innerHTML = ''
  createMarkup();
}

async function createMarkup() {
  try {
    const array = [];
    api.fetchImages(request).then(response => {
      totalHits = response.data.totalHits;
      if (totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      refs.loadMore.classList.remove('hidden');
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
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
      let lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();
      lightbox.on('show.simplelightbox');
    });
  } catch (error) {
    console.log(error);
  }
}

function onLoadMoreClick() {
  api.page += 1;
  if (totalHits <= api.page * api.perPage) {
    refs.loadMore.classList.add('hidden');
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );

    return;
  }

  createMarkup();
}
