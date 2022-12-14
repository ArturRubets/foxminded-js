const income = document.getElementById('income');
const incomeOutput = document.getElementById('income-output');
const firstName = document.querySelector('#first-name');
const email = document.querySelector('#mail');
const pwd = document.querySelector('#pwd');
const cpwd = document.querySelector('#cpwd');

function changeIncome() {
  incomeOutput.innerHTML = income.value;
}
income.oninput = changeIncome;
changeIncome();

class Validator {
  firstName(text, element) {
    if (this.containSpaces(text, element, 'The name must not contain spaces')) {
      return;
    }

    if (
      this.lengthCharacters(
        text,
        element,
        'The name contains less than 3 characters',
        3
      )
    ) {
      return;
    }

    this.hideError(element);
  }

  email(text, element) {
    if (
      this.containSpaces(text, element, 'The email must not contain spaces')
    ) {
      return;
    }

    if (element.validity.typeMismatch) {
      this.showError('Incorrect email', element);
      return;
    }

    this.hideError(element);
  }

  password(text, element) {
    if (
      this.containSpaces(text, element, 'The password must not contain spaces')
    ) {
      return;
    }

    const maxLength = 6;
    if (
      this.lengthCharacters(
        text,
        element,
        `The password contains less than ${maxLength} characters`,
        maxLength
      )
    ) {
      return;
    }
  }

  confirmPassword(password, confirmPassword, element) {
    if (password !== confirmPassword) {
      this.showError('Passwords must be the same', element);
      return;
    }
    this.hideError(element);
  }

  showError(error, element) {
    document.querySelector(`.${element.id}.error`).textContent = error;
  }

  hideError(element) {
    document.querySelector(`.${element.id}.error`).textContent = '';
  }

  containSpaces(text, element, textError) {
    if (text.includes(' ')) {
      this.showError(textError, element);
      return true;
    }
    this.hideError(element);
    return false;
  }

  lengthCharacters(text, element, textError, maxLength) {
    if (text.length < maxLength) {
      this.showError(textError, element);
      return true;
    }
    this.hideError(element);
    return false;
  }
}

const validator = new Validator();

firstName.addEventListener('input', () => {
  validator.firstName(firstName.value, firstName);
});

email.addEventListener('input', () => {
  validator.email(email.value, email);
});

pwd.addEventListener('input', () => {
  validator.password(pwd.value, pwd);
});

cpwd.addEventListener('input', () => {
  validator.confirmPassword(pwd.value, cpwd.value, cpwd);
});
