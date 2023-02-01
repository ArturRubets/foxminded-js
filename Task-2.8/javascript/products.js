/* Grab references to the DOM elements */

const inputFilterPriceMin = document.querySelector('.filter-price-min');
const inputFilterPriceMax = document.querySelector('.filter-price-max');
const btnFilterPriceSubmit = document.querySelector('.filter-price-submit');
const spanSortingItems = document.querySelectorAll('.sorting-item');

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
    products.forEach((product) => {
      divCatalog.append(createProductElement(product));
    });
  } else {
    const para = document.createElement('p');
    para.textContent = 'Не знайдено';
    para.classList.add('not-found');
    divCatalog.append(para);
  }
};

const validateInputPrice = (value, minValue, maxValue) => {
  if (!value || value < minValue || value > maxValue) {
    return false;
  }

  return true;
};

const submitPrice = () => {
  displayCatalog(
    productRepository.getProductsFilterByPrice(
      inputFilterPriceMin.value,
      inputFilterPriceMax.value
    )
  );
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

  $('#slider-range').slider({
    range: true,
    min: 0,
    max: maxPrice,
    values: [0, maxPrice],
    slide: (_, ui) => {
      inputFilterPriceMin.value = ui.values[0];
      inputFilterPriceMax.value = ui.values[1];
    },
  });
  inputFilterPriceMin.value = $('#slider-range').slider('values', 0);
  inputFilterPriceMax.value = $('#slider-range').slider('values', 1);

  inputFilterPriceMin.addEventListener('change', () => {
    if (validateInputPrice(inputFilterPriceMin.value, 0, maxPrice)) {
      $('#slider-range').slider('values', 0, inputFilterPriceMin.value);
      inputFilterPriceMin.blur();
    } else {
      inputFilterPriceMin.value = 0;
    }
  });
  inputFilterPriceMax.addEventListener('change', () => {
    if (validateInputPrice(inputFilterPriceMax.value, 0, maxPrice)) {
      $('#slider-range').slider('values', 1, inputFilterPriceMax.value);
      inputFilterPriceMax.blur();
    } else {
      inputFilterPriceMax.value = maxPrice;
    }
  });
  btnFilterPriceSubmit.addEventListener('click', () => submitPrice(maxPrice));

  spanSortingItems.forEach((item) => {
    item.addEventListener('click', () => handleSorting(item));

    if (item.classList.contains('active')) {
      handleSorting(item);
    }
  });
});
