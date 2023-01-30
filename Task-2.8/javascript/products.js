/* Define functions */

const displayCatalog = (products) => {
  products.forEach((product) => {
    divCatalog.append(createProductElement(product));
  });
};

/* Program implementation */

fetchProducts.then(() => {
  displayCatalog(productRepository.getProducts());
});
