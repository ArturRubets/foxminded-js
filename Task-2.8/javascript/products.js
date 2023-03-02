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
const btnSortingButtonMobile = document.querySelector('.sorting-btn');
const divSortingPopup = document.querySelector('.sort-popup');
const divSortPopupOverlay = document.querySelector('.sort-popup .overlay');
const divSortItems = document.querySelectorAll('.sort-popup .item');
const spanSortingCaption = document.querySelector('.sorting-caption');

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

const submitPrice = (isMobile, maxPrice) => {
  const minValue = isMobile
    ? parseInt(inputFilterPriceMinFilterPopup.value)
    : parseInt(inputFilterPriceMin.value);
  const maxValue = isMobile
    ? parseInt(inputFilterPriceMaxFilterPopup.value)
    : parseInt(inputFilterPriceMax.value);

  displayCatalog(
    productRepository.getProductsFilterByPrice(minValue, maxValue)
  );
  changeBadgeFilter(isMobile, maxPrice);
};

const setSortingCaption = (number) => {
  spanSortingItems.forEach((item) => {
    if (item.attributes['data-sort'].value == number) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  divSortItems.forEach((item) => {
    if (item.attributes['data-sort'].value == number) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }

    spanSortingCaption.textContent = typeSortingCaption[number];
  });
};

const handleSorting = (item) => {
  if (item.classList.contains('active')) {
    return;
  }
  setSortingCaption(item.attributes['data-sort'].value);
  const sortedProducts = typeSorting[item.attributes['data-sort'].value]();
  displayCatalog(sortedProducts);
};

const quantityFilters = (isMobile, maxPrice) => {
  let quantity = 0;
  if (isMobile) {
    if (
      parseInt(inputFilterPriceMaxFilterPopup.value) !== maxPrice ||
      parseInt(inputFilterPriceMinFilterPopup.value) !== 0
    ) {
      quantity++;
    }
  } else {
    if (
      parseInt(inputFilterPriceMin.value) !== 0 ||
      parseInt(inputFilterPriceMax.value) !== maxPrice
    ) {
      quantity++;
    }
  }

  return quantity;
};

const changeBadgeFilter = (isMobile, maxPrice) => {
  const quantity = quantityFilters(isMobile, maxPrice);
  quantity ? (badge.textContent = quantity) : (badge.textContent = '');
};

/* Define constants */

const typeSorting = {
  1: sortByPopularity,
  2: sortByCheaper,
  3: sortByName,
};

const typeSortingCaption = {
  1: 'За популярністю',
  2: 'Спочатку дешевше',
  3: 'За назвою',
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

      $divSliderRange.slider('values', 0, ui.values[0]);
      $divSliderRange.slider('values', 1, ui.values[1]);
    },
  });
  inputFilterPriceMin.value = $divSliderRange.slider('values', 0);
  inputFilterPriceMax.value = $divSliderRange.slider('values', 1);

  inputFilterPriceMinFilterPopup.value = $divSliderRange.slider('values', 0);
  inputFilterPriceMaxFilterPopup.value = $divSliderRange.slider('values', 1);

  const changeValueInput = (input, value, isMinInput) => {
    if (validateInputPrice(value, 0, maxPrice)) {
      $divSliderRange.slider('values', isMinInput ? 0 : 1, value);
      input.value = value;
      input.blur();
    } else {
      input.value = isMinInput ? 0 : maxPrice;
    }
  };

  inputFilterPriceMin.addEventListener('change', () => {
    const value = inputFilterPriceMin.value;
    changeValueInput(inputFilterPriceMin, value, true);
    changeValueInput(inputFilterPriceMinFilterPopup, value, true);
  });
  inputFilterPriceMinFilterPopup.addEventListener('change', () => {
    const value = inputFilterPriceMinFilterPopup.value;
    changeValueInput(inputFilterPriceMin, value, true);
    changeValueInput(inputFilterPriceMinFilterPopup, value, true);
  });
  inputFilterPriceMax.addEventListener('change', () => {
    const value = inputFilterPriceMax.value;
    changeValueInput(inputFilterPriceMax, value, false);
    changeValueInput(inputFilterPriceMaxFilterPopup, value, false);
  });
  inputFilterPriceMaxFilterPopup.addEventListener('change', () => {
    const value = inputFilterPriceMaxFilterPopup.value;
    changeValueInput(inputFilterPriceMax, value, false);
    changeValueInput(inputFilterPriceMaxFilterPopup, value, false);
  });

  btnFilterPriceSubmit.addEventListener('click', () =>
    submitPrice(false, maxPrice)
  );
  btnFilterPriceSubmitFilterPopup.addEventListener('click', () => {
    submitPrice(true, maxPrice);
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

  btnSortingButtonMobile.addEventListener('click', () => {
    openPopup(divSortingPopup);
  });

  divSortPopupOverlay.addEventListener('click', () => {
    closePopup(divSortingPopup);
  });

  divSortItems.forEach((item) => {
    item.addEventListener('click', () => {
      const sortNumber = item.attributes['data-sort'].value;
      const sortedProducts = typeSorting[sortNumber]();
      displayCatalog(sortedProducts);
      setSortingCaption(sortNumber);
      closePopup(divSortingPopup);
    });
  });

  resizeWindowCallback.push(() => closePopup(divFilterPopup));
  resizeWindowCallback.push(() => closePopup(divSortingPopup));
});
