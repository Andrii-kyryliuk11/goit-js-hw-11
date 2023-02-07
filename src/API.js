import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const USER_KEY = '33396439-d181ce3350cbdcaf61f3b27a3';

export default class API {
  constructor() {
    this.totalHits = 0;
    this.page = 1;
    this.perPage = 40;
  }
  async fetchImages(request) {
    const response = await axios.get(
      `${BASE_URL}?key=${USER_KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`
    );
    return response;
  }
}
