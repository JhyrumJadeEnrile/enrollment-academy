// enroll.js — runs only on enroll.html
(function () {
  "use strict";

  var STORAGE_KEY = "northfield_enrollments";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("enroll-form");
    if (!form) return;

    var status = document.getElementById("form-status");

    form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var data = collectData(form);
      var errors = validateData(data, form);

      if (Object.keys(errors).length > 0) {
        applyErrors(form, errors);
        showStatus("Please fix the highlighted fields before continuing.", "error");
        var firstInvalid = form.querySelector(".invalid input, .invalid select, .invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      clearErrors(form);

      var record = data;
      record.id = "EN-" + Date.now().toString(36).toUpperCase();
      record.submittedAt = new Date().toISOString();

      var saved = saveRecord(record);

      if (!saved) {
        // localStorage can fail in private-browsing modes or when storage is full.
        // Fall back to passing the record through the URL so the flow still completes.
        showStatus(
          "Enrollment recorded for this session (your browser blocked local storage).",
          "success"
        );
      }

      var params = new URLSearchParams();
      params.set("id", record.id);
      if (!saved) {
        params.set("data", encodeURIComponent(JSON.stringify(record)));
      }
      window.location.href = "success.html?" + params.toString();
    });

    // Live-clear an error once the person edits that field.
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        var field = el.closest(".field");
        if (field) Validate.setFieldError(field, "");
      });
    });
  });

  function collectData(form) {
    var fd = new FormData(form);
    return {
      fullName: (fd.get("fullName") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      phone: (fd.get("phone") || "").toString().trim(),
      dob: (fd.get("dob") || "").toString(),
      course: (fd.get("course") || "").toString(),
      schedule: (fd.get("schedule") || "").toString(),
      notes: (fd.get("notes") || "").toString().trim(),
      terms: fd.get("terms") === "on"
    };
  }

  function validateData(data) {
    var errors = {};
    if (Validate.isEmpty(data.fullName)) errors.fullName = "Enter the student's full name.";
    if (Validate.isEmpty(data.email)) {
      errors.email = "Enter an email address.";
    } else if (!Validate.isValidEmail(data.email)) {
      errors.email = "Enter a valid email address, like name@example.com.";
    }
    if (Validate.isEmpty(data.phone)) {
      errors.phone = "Enter a phone number.";
    } else if (!Validate.isValidPhone(data.phone)) {
      errors.phone = "Enter a valid phone number.";
    }
    if (Validate.isEmpty(data.dob)) {
      errors.dob = "Enter a date of birth.";
    } else if (!Validate.isAdult(data.dob, 0)) {
      errors.dob = "Enter a valid date of birth.";
    }
    if (Validate.isEmpty(data.course)) errors.course = "Choose a course.";
    if (Validate.isEmpty(data.schedule)) errors.schedule = "Choose a preferred schedule.";
    if (!data.terms) errors.terms = "You must accept the enrollment terms to continue.";
    return errors;
  }

  function applyErrors(form, errors) {
    clearErrors(form);
    Object.keys(errors).forEach(function (name) {
      var input = form.querySelector('[name="' + name + '"]');
      var field = input ? input.closest(".field") : null;
      Validate.setFieldError(field, errors[name]);
    });
  }

  function clearErrors(form) {
    form.querySelectorAll(".field.invalid").forEach(function (field) {
      Validate.setFieldError(field, "");
    });
  }

  function showStatus(message, kind) {
    var status = document.getElementById("form-status");
    if (!status) return;
    status.textContent = message;
    status.className = "form-status show " + kind;
  }

  function saveRecord(record) {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      list.push(record);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }
})();
