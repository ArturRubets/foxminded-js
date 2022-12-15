const income = document.getElementById('income');
const incomeOutput = document.getElementById('income-output');
const firstName = document.querySelector('#first-name');
const email = document.querySelector('#mail');
const pwd = document.querySelector('#pwd');
const cpwd = document.querySelector('#cpwd');
const form = document.querySelector('form');

const changeIncome = () => {
  incomeOutput.innerHTML = income.value;
};
income.oninput = changeIncome;
changeIncome();

class Validator {
  showError(textError, element) {
    document.querySelector(`.${element.id}.error`).textContent = textError;
  }

  hideError(element) {
    document.querySelector(`.${element.id}.error`).textContent = '';
  }

  containSpaces(text) {
    return text.includes(' ');
  }

  lengthLessThan(text, maxLength) {
    return text.length < maxLength;
  }

  empty(text) {
    return text === '';
  }
}

class FirstNameValidator extends Validator {
  maxLength = 3;

  validate(firstNameElement) {
    if (this.empty(firstNameElement.value)) {
      this.showError('The name must not empty', firstNameElement);
      return false;
    }

    if (this.containSpaces(firstNameElement.value)) {
      this.showError('The name must not contain spaces', firstNameElement);
      return false;
    }

    if (this.lengthLessThan(firstNameElement.value, this.maxLength)) {
      this.showError(
        `The name contains less than ${this.maxLength} characters`,
        firstNameElement
      );
      return false;
    }

    this.hideError(firstNameElement);
    return true;
  }
}

class EmailValidator extends Validator {
  validate(emailElement) {
    if (this.empty(emailElement.value)) {
      this.showError('The email must not empty', emailElement);
      return false;
    }

    if (this.containSpaces(emailElement.value)) {
      this.showError('The email must not contain spaces', emailElement);
      return false;
    }

    if (emailElement.validity.typeMismatch) {
      this.showError('Incorrect email', emailElement);
      return false;
    }

    this.hideError(emailElement);
    return true;
  }
}

class PasswordValidator extends Validator {
  maxLength = 6;

  validate(passwordElement) {
    if (this.empty(passwordElement.value)) {
      this.showError('The password must not empty', passwordElement);
      return false;
    }

    if (this.containSpaces(passwordElement.value)) {
      this.showError('The password must not contain spaces', passwordElement);
      return false;
    }

    if (this.lengthLessThan(passwordElement.value, this.maxLength)) {
      this.showError(
        `The password contains less than ${this.maxLength} characters`,
        passwordElement
      );
      return false;
    }

    this.hideError(passwordElement);
    return true;
  }
}

class ConfirmPasswordValidator extends Validator {
  validate(passwordElement, confirmPasswordElement) {
    if (this.empty(confirmPasswordElement.value)) {
      this.showError('The password must not empty', confirmPasswordElement);
      return false;
    }

    if (passwordElement.value !== confirmPasswordElement.value) {
      this.showError('Passwords must be the same', confirmPasswordElement);
      return false;
    }

    this.hideError(confirmPasswordElement);
    return true;
  }
}

const firstNameValidator = new FirstNameValidator();
const emailValidator = new EmailValidator();
const passwordValidator = new PasswordValidator();
const confirmPasswordValidator = new ConfirmPasswordValidator();
const validatorCallbacks = {
  firstNameValidator: () => firstNameValidator.validate(firstName),
  emailValidator: () => emailValidator.validate(email),
  passwordValidator: () => passwordValidator.validate(pwd),
  confirmPasswordValidator: () => confirmPasswordValidator.validate(pwd, cpwd),
};
const debounce =
  (callback, delay, timeout = 0) =>
  () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(), delay);
  };
const delay = 2000;

firstName.addEventListener(
  'input',
  debounce(validatorCallbacks.firstNameValidator, delay)
);

email.addEventListener(
  'input',
  debounce(validatorCallbacks.emailValidator, delay)
);

pwd.addEventListener(
  'input',
  debounce(validatorCallbacks.passwordValidator, delay)
);

cpwd.addEventListener(
  'input',
  debounce(validatorCallbacks.confirmPasswordValidator, delay)
);

form.addEventListener('submit', (e) => {
  let isAllValidate = true;
  for (const validate of Object.values(validatorCallbacks)) {
    const isValidate = validate();
    isAllValidate &&= isValidate;
  }

  if (!isAllValidate) {
    e.preventDefault();
  }
});
