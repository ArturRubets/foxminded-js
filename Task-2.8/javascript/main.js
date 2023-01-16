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

  static fromObject(obj) {
    return new Banner(obj.url, obj.alt);
  }
}

class Product {
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

const createProductsElements = (products) => {
  const createProductElement = (product) => {
    const div = document.createElement('div');
    div.classList.add('carousel-cell');
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
          <div class="product-price">${product.price} грн</div>
          <button class="buy" type="submit">Купити</button>
        </div>
      </div>
    </div>
    `;
    return div;
  };
  return products.map(createProductElement);
};

const displayCarouselBanners = (elements) => {
  carouselBanners.slick('slickAdd', elements);
};

const displayCarouselProducts = (elements) => {
  carouselProducts.slick('slickAdd', elements);
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

const bannerClient = new BannerApi();
const productClient = new ProductApi();

const productRepository = new ProductRepository();

bannerClient.fetchBanners().then((array) => {
  const banners = array.map(Banner.fromObject);
  displayCarouselBanners(createBannersElements(banners));
});

productClient.fetchProducts().then((array) => {
  productRepository.setProducts(array.map(Product.fromObject));
  displayCarouselProducts(
    createProductsElements(productRepository.getProductsFilterByHit())
  );
});

inputSearch.addEventListener('input', handleSearch);
