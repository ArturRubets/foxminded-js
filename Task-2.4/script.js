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
  showError(textError, element) {
    document.querySelector(`.${element.id}.error`).textContent = textError;
    element.setCustomValidity(textError);
  }

  hideError(element) {
    document.querySelector(`.${element.id}.error`).textContent = '';
    element.setCustomValidity('');
  }

  containSpaces(targetElement, textError) {
    if (targetElement.value.includes(' ')) {
      this.showError(textError, targetElement);
      return true;
    }
    this.hideError(targetElement);
    return false;
  }

  lengthCharacters(targetElement, textError, maxLength) {
    if (targetElement.value.length < maxLength) {
      this.showError(textError, targetElement);
      return true;
    }
    this.hideError(targetElement);
    return false;
  }
}

class FirstNameValidator extends Validator {
  validate(firstNameElement) {
    if (
      this.containSpaces(firstNameElement, 'The name must not contain spaces')
    ) {
      return;
    }

    if (
      this.lengthCharacters(
        firstNameElement,
        'The name contains less than 3 characters',
        3
      )
    ) {
      return;
    }

    this.hideError(firstNameElement);
  }
}

class EmailValidator extends Validator {
  validate(emailElement) {
    if (this.containSpaces(emailElement, 'The email must not contain spaces')) {
      return;
    }

    if (emailElement.validity.typeMismatch) {
      this.showError('Incorrect email', emailElement);
      return;
    }

    this.hideError(emailElement);
  }
}

class PasswordValidator extends Validator {
  maxLength = 6;

  validate(passwordElement) {
    if (
      this.containSpaces(
        passwordElement,
        'The password must not contain spaces'
      )
    ) {
      return;
    }

    if (
      this.lengthCharacters(
        passwordElement,
        `The password contains less than ${this.maxLength} characters`,
        this.maxLength
      )
    ) {
      return;
    }
  }
}

class ConfirmPasswordValidator extends Validator {
  validate(passwordElement, confirmPasswordElement) {
    if (passwordElement.value !== confirmPasswordElement.value) {
      this.showError('Passwords must be the same', confirmPasswordElement);
      return;
    }
    this.hideError(confirmPasswordElement);
  }
}

const firstNameValidator = new FirstNameValidator();
const emailValidator = new EmailValidator();
const passwordValidator = new PasswordValidator();
const confirmPasswordValidator = new ConfirmPasswordValidator();

firstName.addEventListener('input', () => {
  firstNameValidator.validate(firstName);
});

email.addEventListener('input', () => {
  emailValidator.validate(email);
});

pwd.addEventListener('input', () => {
  passwordValidator.validate(pwd);
});

cpwd.addEventListener('input', () => {
  confirmPasswordValidator.validate(pwd, cpwd);
});
