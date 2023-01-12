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

const flickity = new Flickity('.carousel', {
  groupCells: true,
  cellAlign: 'left',
  contain: true,
  pageDots: false,
  adaptiveHeight: true,
  arrowShape: {
    x0: 0,
    x1: 60,
    y1: 50,
    x2: 60,
    y2: 0,
    x3: 40,
  },
});
