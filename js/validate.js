// validate.js — small, dependency-free validation helpers shared by forms
var Validate = (function () {
  "use strict";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Accepts spaces, dashes, parentheses, optional leading +, 7-15 digits total.
  var PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

  function isEmpty(value) {
    return !value || String(value).trim().length === 0;
  }

  function isValidEmail(value) {
    return EMAIL_RE.test(String(value).trim());
  }

  function isValidPhone(value) {
    return PHONE_RE.test(String(value).trim());
  }

  function isAdult(dateString, minAge) {
    if (!dateString) return false;
    var dob = new Date(dateString);
    if (isNaN(dob.getTime())) return false;
    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age >= (minAge || 0);
  }

  // Shows/hides the .error-text under a field and toggles the "invalid" class.
  function setFieldError(fieldEl, message) {
    if (!fieldEl) return;
    var errorEl = fieldEl.querySelector(".error-text");
    if (message) {
      fieldEl.classList.add("invalid");
      if (errorEl) errorEl.textContent = message;
    } else {
      fieldEl.classList.remove("invalid");
      if (errorEl) errorEl.textContent = "";
    }
  }

  return {
    isEmpty: isEmpty,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    isAdult: isAdult,
    setFieldError: setFieldError
  };
})();
