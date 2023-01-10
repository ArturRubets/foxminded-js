// /* Grab references to the DOM elements */

// const inputSearch = [...document.querySelectorAll('.search input')];

// /* Define constants */

// /* Define classes */

// /* Define functions */

// const handleSearch = (e, input, button) => {
//   input.value = e.target.value;

//   if (input.value) {
//     button.disabled = false;
//   } else {
//     button.disabled = true;
//   }
// };

// /* Program implementation */

// inputSearch.forEach((el) => {
//   const button = el.parentNode.querySelector('button');

//   el.addEventListener('input', (e) => {
//     inputSearch.forEach((el) => handleSearch(e, el, button));
//   });
// });
