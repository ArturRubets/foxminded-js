/* Grab references to the DOM elements */

const inputFilterPriceMin = document.querySelector(
  '.aside-filters .filter-price-min'
);
const inputFilterPriceMax = document.querySelector(
  '.aside-filters .filter-price-max'
);
const btnFilterPriceSubmit = document.querySelector(
  '.aside-filters .filter-price-submit'
);
const spanSortingItems = document.querySelectorAll('.sorting-item');
const btnMobileFilter = document.querySelector('.mobile-filter-btn');
const divFilterPopup = document.querySelector('.filter-popup');
const divFilterPopupOverlay = document.querySelector('.filter-popup .overlay');
const imgCloseFilterPopup = document.querySelector(
  '.filter-popup .navbar .icon'
);
const $divSliderRange = $('.slider-range');
const inputFilterPriceMinFilterPopup = document.querySelector(
  '.filter-popup .filter-price-min'
);
const inputFilterPriceMaxFilterPopup = document.querySelector(
  '.filter-popup .filter-price-max'
);
const btnFilterPriceSubmitFilterPopup = document.querySelector(
  '.filter-popup .button-filter'
);

const badge = document.querySelector('.badge');

const quantityFilters = (maxPrice) => {
  let quantity = 0;
  if (
    parseInt(inputFilterPriceMaxFilterPopup.value) !== maxPrice ||
    parseInt(inputFilterPriceMinFilterPopup.value) !== 0 ||
    parseInt(inputFilterPriceMin.value) !== 0 ||
    parseInt(inputFilterPriceMax.value) !== maxPrice
  ) {
    quantity++;
  }

  return quantity;
};

const changeBadgeFilter = (maxPrice) => {
  const quantity = quantityFilters(maxPrice);
  if (quantity) {
    badge.textContent = quantity;
  }
};

/* Define functions */

const sortByPopularity = () =>
  productRepository.getProducts().sort((a, b) => b.hit - a.hit);

const sortByCheaper = () =>
  productRepository.getProducts().sort((a, b) => a.price - b.price);

const sortByName = () =>
  productRepository
    .getProducts()
    .sort((a, b) => a.title.localeCompare(b.title));

const displayCatalog = (products) => {
  divCatalog.innerHTML = '';
  if (products && products.length > 0) {
    divCatalog.style.display = 'grid';
    products.forEach((product) => {
      divCatalog.append(createProductElement(product));
    });
  } else {
    const para = document.createElement('p');
    para.textContent = 'Не знайдено';
    para.classList.add('not-found');
    divCatalog.style.display = 'block';
    divCatalog.append(para);
  }
};

const validateInputPrice = (value, minValue, maxValue) => {
  if (!value || value < minValue || value > maxValue) {
    return false;
  }

  return true;
};

const submitPrice = (maxPrice) => {
  displayCatalog(
    productRepository.getProductsFilterByPrice(
      inputFilterPriceMin.value,
      inputFilterPriceMax.value
    )
  );
  changeBadgeFilter(maxPrice);
};

const handleSorting = (item) => {
  if (item.classList.contains('active')) {
    return;
  }
  spanSortingItems.forEach((value) => value.classList.remove('active'));
  item.classList.add('active');
  const sortedProducts = typeSorting[item.attributes['data-sort'].value]();
  displayCatalog(sortedProducts);
};

/* Define constants */

const typeSorting = {
  1: sortByPopularity,
  2: sortByCheaper,
  3: sortByName,
};

/* Program implementation */

fetchProducts.then(() => {
  displayCatalog(productRepository.getProducts());

  const maxPrice = productRepository.maxPrice;

  $divSliderRange.slider({
    range: true,
    min: 0,
    max: maxPrice,
    values: [0, maxPrice],
    slide: (_, ui) => {
      inputFilterPriceMin.value = ui.values[0];
      inputFilterPriceMax.value = ui.values[1];

      inputFilterPriceMinFilterPopup.value = ui.values[0];
      inputFilterPriceMaxFilterPopup.value = ui.values[1];
    },
  });
  inputFilterPriceMin.value = $divSliderRange.slider('values', 0);
  inputFilterPriceMax.value = $divSliderRange.slider('values', 1);

  inputFilterPriceMinFilterPopup.value = $divSliderRange.slider('values', 0);
  inputFilterPriceMaxFilterPopup.value = $divSliderRange.slider('values', 1);

  inputFilterPriceMin.addEventListener('change', () => {
    if (validateInputPrice(inputFilterPriceMin.value, 0, maxPrice)) {
      $divSliderRange.slider('values', 0, inputFilterPriceMin.value);
      inputFilterPriceMin.blur();
    } else {
      inputFilterPriceMin.value = 0;
    }
  });
  inputFilterPriceMinFilterPopup.addEventListener('change', () => {
    if (validateInputPrice(inputFilterPriceMinFilterPopup.value, 0, maxPrice)) {
      $divSliderRange.slider('values', 0, inputFilterPriceMinFilterPopup.value);
      inputFilterPriceMinFilterPopup.blur();
    } else {
      inputFilterPriceMinFilterPopup.value = 0;
    }
  });

  inputFilterPriceMax.addEventListener('change', () => {
    if (validateInputPrice(inputFilterPriceMax.value, 0, maxPrice)) {
      $divSliderRange.slider('values', 1, inputFilterPriceMax.value);
      inputFilterPriceMax.blur();
    } else {
      inputFilterPriceMax.value = maxPrice;
    }
  });

  inputFilterPriceMaxFilterPopup.addEventListener('change', () => {
    if (validateInputPrice(inputFilterPriceMaxFilterPopup.value, 0, maxPrice)) {
      $divSliderRange.slider('values', 1, inputFilterPriceMaxFilterPopup.value);
      inputFilterPriceMaxFilterPopup.blur();
    } else {
      inputFilterPriceMaxFilterPopup.value = maxPrice;
    }
  });

  btnFilterPriceSubmit.addEventListener('click', () => submitPrice(maxPrice));
  btnFilterPriceSubmitFilterPopup.addEventListener('click', () => {
    submitPrice(maxPrice);
    closePopup(divFilterPopup);
  });

  spanSortingItems.forEach((item) => {
    item.addEventListener('click', () => handleSorting(item));

    if (item.classList.contains('active')) {
      handleSorting(item);
    }
  });

  btnMobileFilter.addEventListener('click', () => {
    openPopup(divFilterPopup);
  });

  divFilterPopupOverlay.addEventListener('click', () => {
    closePopup(divFilterPopup);
  });

  imgCloseFilterPopup.addEventListener('click', () => {
    closePopup(divFilterPopup);
  });
});
