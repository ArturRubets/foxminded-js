/* Grab references to the DOM elements */

const buttonSearch = document.querySelector('.search button');
const divBasket = document.querySelector('.basket');
const elementHTML = document.querySelector('html');
const inputSearch = document.querySelector('.search input');

/* Define constants */

/* Define classes */

class Banner {
  constructor(url, alt) {
    this.url = url;
    this.alt = alt;
  }

  static fromObject(obj) {
    return new Banner(obj.url, obj.alt);
  }
}

class Product {
  get id() {
    return this.code;
  }

  constructor(url, alt, hit, code, title, price) {
    this.url = url;
    this.alt = alt;
    this.hit = hit;
    this.code = code;
    this.title = title;
    this.price = price;
  }

  static fromObject(obj) {
    return new Product(
      obj.url,
      obj.alt,
      obj.hit,
      obj.code,
      obj.title,
      obj.price
    );
  }
}

class BasketItem {
  get isEmpty() {
    return this.quantity === 0;
  }

  get price() {
    return this.product.price * this.quantity;
  }

  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  identical(product) {
    return this.product.id === product.id;
  }
}

class Basket {
  static basketKey = 'myBasketKey';

  get isEmpty() {
    if (this.basketItems.length) {
      return false;
    }
    return true;
  }

  get price() {
    if (this.isEmpty) {
      return 0;
    }
    return this.basketItems
      .map((value) => value.price)
      .reduce((previousValue, currentValue) => previousValue + currentValue);
  }

  get quantity() {
    if (this.isEmpty) {
      return 0;
    }
    return this.basketItems
      .map((value) => value.quantity)
      .reduce((previousValue, currentValue) => previousValue + currentValue);
  }

  constructor() {
    const savedBasketItems = JSON.parse(
      localStorage.getItem(this.basketKey)
    )?.map(
      (value) =>
        new BasketItem(Product.fromObject(value.product), value.quantity)
    );
    this.basketItems = savedBasketItems ? savedBasketItems : [];
  }

  create(product) {
    this.basketItems.push(new BasketItem(product));
    localStorage.setItem(this.basketKey, JSON.stringify(this.basketItems));
  }

  delete(basketItem) {
    this.basketItems = this.basketItems.filter((value) => value !== basketItem);
    localStorage.setItem(this.basketKey, JSON.stringify(this.basketItems));
  }

  update(basketItem, quantity) {
    basketItem.quantity = quantity;
    this.basketItems = this.basketItems.filter((value) => value.quantity > 0);
    localStorage.setItem(this.basketKey, JSON.stringify(this.basketItems));
  }

  find(product) {
    if (!product) {
      return;
    }
    return this.basketItems.find((value) => value.identical(product));
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

class ProductApi {
  url = './assets/data/products.json';

  async fetchProducts() {
    const response = await fetch(this.url);
    if (response.ok) {
      return response.json();
    } else {
      console.log(
        `Request for ${this.url} failed with response ${response.status}:${response.statusText}`
      );
    }
  }
}

class ProductRepository {
  constructor() {
    this.products = [];
  }

  setProducts(products) {
    this.products = products;
  }

  getProducts() {
    return this.products;
  }

  getProductsFilterByHit() {
    return this.getProducts().filter((value) => value.hit);
  }
}

class BasketPopup {
  constructor() {
    this.divOverlay = document.querySelector('.overlay');
    this.tbodyPopupItems = this.divOverlay.querySelector('.popup-items');
    this.divPopupCloseButton = this.divOverlay.querySelector(
      '.popup-close-button'
    );
    this.divCartBtnBack = this.divOverlay.querySelector('.cart-btnBack');
    this.divBasketSummary = this.divOverlay.querySelector('.cart-summary-b');
    this.popupBasketMobile = this.divOverlay.querySelector(
      '.popup-basket-mobile'
    );
    this.divCloseBasketMobile = this.popupBasketMobile.querySelector('.close');
    this.divPriceBasketMobile = this.popupBasketMobile.querySelector('.price');
    this.divItemsBasketMobile = this.popupBasketMobile.querySelector('.items');
    this.divCloseSecondBasketMobile =
      this.popupBasketMobile.querySelector('.cart-btnBack');

    this.divOverlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('overlay')) {
        this.close();
      }
    });
    this.divPopupCloseButton.addEventListener('click', () => {
      this.close();
    });
    this.divCartBtnBack.addEventListener('click', () => {
      this.close();
    });
    this.divCloseBasketMobile.addEventListener('click', () => {
      this.close();
    });
    this.divCloseSecondBasketMobile.addEventListener('click', () => {
      this.close();
    });
    window.addEventListener('resize', () => {
      this.close();
    });
  }

  close() {
    elementHTML.style.overflow = 'initial';
    this.divOverlay.classList.remove('visible');
  }

  setListenersToCounter(
    basketItem,
    inputCounter,
    btnCounterMinus,
    btnCounterPlus,
    updateQuantity,
    removeCardItem
  ) {
    const handleInputSymbol = (e) => {
      if (!onlyNumberSymbol(e.key)) {
        e.preventDefault();
      }
    };

    const handleInput = () => {
      const input = parseInt(inputCounter.value);
      if (!input) {
        return;
      }
      updateQuantity(input);
      this.update();
    };

    inputCounter.addEventListener('keypress', handleInputSymbol);
    inputCounter.addEventListener('paste', handleInputSymbol);
    inputCounter.addEventListener('change', handleInput);
    inputCounter.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') {
        handleInput();
        inputCounter.blur();
      }
    });
    inputCounter.addEventListener('blur', (e) => {
      if (!inputCounter.value) {
        inputCounter.value = basketItem.quantity;
      }
    });
    btnCounterMinus.addEventListener('click', () => {
      updateQuantity(basketItem.quantity - 1);
      if (!basket.find(basketItem.product)) {
        removeCardItem();
      }
    });
    btnCounterPlus.addEventListener('click', () => {
      updateQuantity(basketItem.quantity + 1);
    });
  }

  createProductItem(basketItem) {
    const tr = document.createElement('tr');
    tr.classList.add('popup-card-item');
    tr.innerHTML = `
      <td>
        <div class="cart-remove">
              <svg
                viewBox="0 0 64 64"
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.846 64h44.309V19.692H9.846V64zm29.539-34.461h4.923v24.615h-4.923V29.539zm-9.847 0h4.924v24.615h-4.924V29.539zm-9.846 0h4.923v24.615h-4.923V29.539zM39.385 4.923V0h-14.77v4.923H4.923v9.847h54.154V4.923H39.385z"
                ></path>
              </svg>
        </div>
        <div class="cart-image">
          <img
            alt='${basketItem.product.title}'
            width="69"
            height="78"
            src="${basketItem.product.url}"
          />
        </div>
      </td>
      <td class="cart-description">
        <p>${basketItem.product.title}</p>
        <p class='cart-price'>${numberWithSpaces(
          basketItem.product.price
        )} грн</p>
      </td>
      <td>
        <div class="counter">
          <button class="counter-minus">
          <img class="icon" src="assets/images/minus.svg" alt="">
          </button>
          <input type="text" value="${numberWithSpaces(
            basketItem.quantity
          )}" class="counter-input" />
          <button class="counter-plus">
            <img class="icon" src="assets/images/plus.svg" alt="">
          </button>
        </div>
      </td>
      <td class="card-cost">${numberWithSpaces(basketItem.price)} грн</td>
    `;

    const inputCounter = tr.querySelector('.counter-input');
    const divCartRemove = tr.querySelector('.cart-remove');
    const btnCounterMinus = tr.querySelector('.counter-minus');
    const btnCounterPlus = tr.querySelector('.counter-plus');
    const tdCardCost = tr.querySelector('.card-cost');

    const removeCardItem = () => {
      tr.remove();
      const btnBuy = carouselProducts[0].querySelector(
        `.carousel-cell[data-id="${basketItem.product.id}"] button.buy`
      );
      btnBuy.innerText = 'Купити';
    };
    const updateQuantity = (quantity) => {
      basket.update(basketItem, quantity);
      inputCounter.value = quantity;
      tdCardCost.textContent = `${numberWithSpaces(basketItem.price)} грн`;
      this.divBasketSummary.textContent = `${numberWithSpaces(
        basket.price
      )} грн`;
      this.update();
    };

    divCartRemove.addEventListener('click', () => {
      basket.delete(basketItem);
      removeCardItem();
      updateQuantity(basketItem.quantity);
    });

    this.setListenersToCounter(
      basketItem,
      inputCounter,
      btnCounterMinus,
      btnCounterPlus,
      updateQuantity,
      removeCardItem
    );

    updateQuantity(basketItem.quantity);

    return tr;
  }

  createProductItemMobile(basketItem) {
    const div = document.createElement('div');
    div.classList.add('item');
    div.innerHTML = `
    <div class="item-image">
      <img
        class="icon"
        src="${basketItem.product.url}"
        alt="${basketItem.product.title}"
      />
    </div>
    <div class="info">
      <div class="title">
        <a href="javascript:void(0);">${basketItem.product.title}</a>
      </div>
      <div class="item-price">${numberWithSpaces(
        basketItem.product.price
      )} грн</div>
      <div class="buttons">
        <div class="counter">
          <button class="counter-minus">
            <img class="icon" src="assets/images/minus.svg" alt="" />
          </button>
          <input class="counter-input" type="text" value="${numberWithSpaces(
            basketItem.quantity
          )}"/>
          <button class="counter-plus">
            <img class="icon" src="assets/images/plus.svg" alt="" />
          </button>
        </div>
        <div class="remove-icon">
          <button class="remove-button">
            <img
              class="remove-button-icon"
              src="assets/images/icon-remove.svg"
              alt=""
            />
          </button>
        </div>
      </div>
    </div>
    `;

    const inputCounter = div.querySelector('.counter-input');
    const btnCounterMinus = div.querySelector('.counter-minus');
    const btnCounterPlus = div.querySelector('.counter-plus');
    const divRemoveIcon = div.querySelector('.remove-icon');

    const removeCardItem = () => {
      div.remove();
      const btnBuy = carouselProducts[0].querySelector(
        `.carousel-cell[data-id="${basketItem.product.id}"] button.buy`
      );
      btnBuy.innerText = 'Купити';
    };
    const updateQuantity = (quantity) => {
      basket.update(basketItem, quantity);
      inputCounter.value = quantity;
      this.divPriceBasketMobile.textContent = `${numberWithSpaces(
        basket.price
      )} грн`;
      this.update();
    };

    divRemoveIcon.addEventListener('click', () => {
      basket.delete(basketItem);
      removeCardItem();
      updateQuantity(basketItem.quantity);
    });

    this.setListenersToCounter(
      basketItem,
      inputCounter,
      btnCounterMinus,
      btnCounterPlus,
      updateQuantity,
      removeCardItem
    );

    updateQuantity(basketItem.quantity);

    return div;
  }

  display() {
    if (basket.isEmpty) {
      return;
    }

    elementHTML.style.overflow = 'hidden';
    this.divOverlay.classList.add('visible');

    this.tbodyPopupItems.innerHTML = '';
    this.divItemsBasketMobile.innerHTML = '';

    basket.basketItems.map((value) => {
      this.tbodyPopupItems.append(this.createProductItem(value));
      this.divItemsBasketMobile.append(this.createProductItemMobile(value));
    });
  }

  update() {
    (function toggleBasketLink() {
      const isLink = divBasket.innerHTML.includes('basket-link');
      if (!basket.isEmpty && !isLink) {
        const children = divBasket.innerHTML;
        const newContent = `<a class="basket-link" href="javascript:void(0);">${children}</a>`;
        divBasket.innerHTML = newContent;
      } else if (basket.isEmpty && isLink) {
        const link = divBasket.firstChild;
        divBasket.innerHTML = link.innerHTML;
      }
    })();

    // After toggleBasketLink method .basket-items is updated.
    // We find each update through querySelector.
    divBasket.querySelector('.basket-items').textContent = basket.quantity;

    divBasket.querySelector('.basket-value').textContent = `${numberWithSpaces(
      basket.price
    )} грн`;

    if (basket.isEmpty) {
      this.close();
    }
  }

  create() {
    this.update();
    this.display();
  }
}

/* Define functions */

const onlyNumberSymbol = (symbol) => {
  if (!(symbol >= 0 && symbol < 10)) {
    return false;
  }
  return true;
};

const numberWithSpaces = (x) => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
};

const handleSearch = () => {
  if (inputSearch.value) {
    buttonSearch.disabled = false;
  } else {
    buttonSearch.disabled = true;
  }
};

const handleBasket = () => basketPopup.create();

const displayCarouselBanners = (banners) => {
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
  carouselBanners.slick('slickAdd', banners.map(createBannerElement));
};

const displayCarouselProducts = (products) => {
  const createProductElement = (product) => {
    const handleProductButtonClick = (product) => {
      if (!basket.find(product)) {
        basket.create(product);
      }
      basketPopup.create();
    };

    const div = document.createElement('div');
    div.classList.add('carousel-cell');
    div.setAttribute('data-id', product.id);
    div.innerHTML = `
    <div class="product-container">
      <div class="product-image">
        <a href="javascript:void(0);">
          <img
            alt="${product.alt}"
            width="200"
            height="240"
            src="${product.url}"
          />
        </a>
        ${
          product.hit
            ? `
              <div class="product-sticker">
                <div class="product-sticker-item">Хіт</div>
              </div>
              `
            : ''
        }
      </div>
      <div class="product-info">
        <div class="product-code">Артикул: ${product.code}</div>
        <div class="product-title">
          <a
            href="javascript:void(0);"
            title="${product.title}"
          >
            ${product.title}
          </a>
        </div>
        <div class="product-price-container">
          <div class="product-price">${numberWithSpaces(
            product.price
          )} грн</div>
        </div>
      </div>
    </div>
    `;

    const buttonBuy = document.createElement('button');
    buttonBuy.classList.add('button', 'buy');
    buttonBuy.setAttribute('type', 'submit');
    buttonBuy.innerText = basket.find(product) ? 'В кошику' : 'Купити';
    buttonBuy.addEventListener('click', () => {
      handleProductButtonClick(product);
      buttonBuy.innerText = 'В кошику';
    });

    div.querySelector('.product-price-container').append(buttonBuy);

    return div;
  };
  carouselProducts.slick('slickAdd', products.map(createProductElement));
};

/* Program implementation */

const carouselBanners = $('.carousel-banners').slick({
  fade: true,
  dots: true,
  prevArrow:
    '<div class="arrow-prev"><svg class="image" viewBox="0 0 22 48"><polygon points="17.6,47.1 19.2,45.9 3.6,24 19.2,2.1 17.6,0.9 1.2,24 "></polygon> <polygon style="opacity:0.1; fill:#000" points="19.9,47 21.2,46 5.6,24 21.2,2 19.9,1 3.6,24 "></polygon></svg></div>',
  nextArrow:
    '<div class="arrow-next"><svg class="image" viewBox="0 0 22 48"><polygon points="4.8,47.1 3.2,45.9 18.8,24 3.2,2.1 4.8,0.9 21.2,24 "></polygon><polygon style="opacity:0.1; fill:#000" points="2.5,47 1.2,46 16.9,24 1.2,2 2.5,1 18.8,24 "></polygon></svg></div>',
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
      },
    },
  ],
});
const carouselProducts = $('.carousel-products').slick({
  infinite: false,
  slidesToShow: 6,
  slidesToScroll: 2,
  prevArrow:
    '<svg class="arrow-prev slick-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 24" fill="#333"><path d="M13 0 0 12.5 13 24V0z"/></svg>',
  nextArrow:
    '<svg class="arrow-next slick-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 24" fill="#333"><path d="m0 24 13-11.5L0 0v24z"/></svg>',
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        slidesToShow: 3.2,
      },
    },
    {
      breakpoint: 425,
      settings: {
        arrows: false,
        slidesToShow: 2.2,
      },
    },
  ],
});

const basket = new Basket();
const basketPopup = new BasketPopup();

const bannerClient = new BannerApi();
const productClient = new ProductApi();

const productRepository = new ProductRepository();

basketPopup.update();

bannerClient.fetchBanners().then((array) => {
  const banners = array.map(Banner.fromObject);
  displayCarouselBanners(banners);
});

productClient.fetchProducts().then((array) => {
  productRepository.setProducts(array.map(Product.fromObject));
  displayCarouselProducts(productRepository.getProductsFilterByHit());
});

inputSearch.addEventListener('input', handleSearch);
divBasket.addEventListener('click', handleBasket);
