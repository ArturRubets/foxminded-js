const menu = document.querySelector('.menu');
const foods = document.querySelectorAll('.food');
const activeMenuItem = menu.querySelector('.active-menu-item');

const selectMenu = (menuItem) => {
  [...menu.children].forEach((element) => {
    if (element === menuItem) {
      element.classList.add('active-menu-item');
    } else {
      element.classList.remove('active-menu-item');
    }
  });
};

const displayFood = (menuItem) => {
  const category = menuItem.textContent.toUpperCase();

  foods.forEach((element) => {
    if (
      category === 'ALL' ||
      element.attributes['data-category'].value.toUpperCase() === category
    ) {
      element.classList.add('view');
    } else {
      element.classList.remove('view');
    }
  });
};

menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const menuItem = e.target;

    selectMenu(menuItem);
    displayFood(menuItem);
  }
});

selectMenu(activeMenuItem);
displayFood(activeMenuItem);
