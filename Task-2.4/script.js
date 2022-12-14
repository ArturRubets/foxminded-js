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

  containSpaces(text) {
    return text.includes(' ');
  }

  lengthLessThan(text, maxLength) {
    return text.length < maxLength;
  }
}

class FirstNameValidator extends Validator {
  maxLength = 3;

  validate(firstNameElement) {
    if (this.containSpaces(firstNameElement.value)) {
      this.showError('The name must not contain spaces', firstNameElement);
      return;
    }

    if (this.lengthLessThan(firstNameElement.value, this.maxLength)) {
      this.showError(
        `The name contains less than ${this.maxLength} characters`,
        firstNameElement
      );
      return;
    }

    this.hideError(firstNameElement);
  }
}

class EmailValidator extends Validator {
  validate(emailElement) {
    if (this.containSpaces(emailElement.value)) {
      this.showError('The email must not contain spaces', emailElement);
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
    if (this.containSpaces(passwordElement.value)) {
      this.showError('The password must not contain spaces', passwordElement);
      return;
    }

    if (this.lengthLessThan(passwordElement.value, this.maxLength)) {
      this.showError(
        `The password contains less than ${this.maxLength} characters`,
        passwordElement
      );
      return;
    }

    this.hideError(passwordElement);
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
