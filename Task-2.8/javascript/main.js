/* Grab references to the DOM elements */

const inputSearch = document.querySelector('.search input');
const buttonSearch = document.querySelector('.search button');

/* Define constants */

/* Define classes */

class Banner {
  constructor(url, alt) {
    this.url = url;
    this.alt = alt;
  }
}

class BannerApi {
  url = './assets/data/banners.json';

  async fetchBanners() {
    const response = await fetch(this.url);
    if (response.ok) {
      return response.json();
    } else {
      console.log(
        `Request for ${this.url} failed with response ${response.status}: ${response.statusText}`
      );
    }
  }
}

/* Define functions */

const handleSearch = () => {
  if (inputSearch.value) {
    buttonSearch.disabled = false;
  } else {
    buttonSearch.disabled = true;
  }
};

const createBannersElements = (banners) => {
  const createBannerElement = (banner) => {
    const div = document.createElement('div');
    div.classList.add('carousel-cell');
    div.innerHTML = `
     <a href="javascript:void(0);">
        <img
          src="${banner.url}"
          width="1440"
          height="576"
          alt="${banner.alt}"
        />
      </a>
    `;
    return div;
  };
  return banners.map(createBannerElement);
};

const displayBanners = (elements) => {
  carouselBanners.append(elements);
};

/* Program implementation */

const bannerClient = new BannerApi();
bannerClient.fetchBanners().then((array) => {
  const banners = array.map(({ url, alt }) => new Banner(url, alt));
  displayBanners(createBannersElements(banners));
});

inputSearch.addEventListener('input', handleSearch);

const carouselBanners = new Flickity('.carousel-banners', {
  wrapAround: true,
  autoPlay: 5000,
  fade: true,
  arrowShape: {
    x0: 10,
    x1: 40,
    y1: 50,
    x2: 45,
    y2: 45,
    x3: 20,
  },
});

const carouselProducts = new Flickity('.carousel-products', {
  groupCells: 2,
  cellAlign: 'left',
  contain: true,
  pageDots: false,
  freeScroll: true,
  arrowShape: {
    x0: 0,
    x1: 60,
    y1: 50,
    x2: 60,
    y2: 0,
    x3: 40,
  },
});
