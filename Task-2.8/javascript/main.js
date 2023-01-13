/* Grab references to the DOM elements */

const inputSearch = document.querySelector('.search input');
const buttonSearch = document.querySelector('.search button');

/* Define constants */

/* Define classes */

/* Define functions */

const handleSearch = () => {
  if (inputSearch.value) {
    buttonSearch.disabled = false;
  } else {
    buttonSearch.disabled = true;
  }
};

/* Program implementation */

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
