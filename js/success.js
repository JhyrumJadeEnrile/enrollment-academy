// success.js — runs only on success.html
(function () {
  "use strict";

  var STORAGE_KEY = "northfield_enrollments";

  document.addEventListener("DOMContentLoaded", function () {
    var mount = document.getElementById("summary-mount");
    var empty = document.getElementById("summary-empty");
    if (!mount) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var inlineData = params.get("data");

    var record = null;

    if (inlineData) {
      try {
        record = JSON.parse(decodeURIComponent(inlineData));
      } catch (e) {
        record = null;
      }
    } else if (id) {
      record = findRecordById(id);
    }

    if (!record) {
      mount.style.display = "none";
      if (empty) empty.style.display = "block";
      return;
    }

    mount.innerHTML = renderSummary(record);
  });

  function findRecordById(id) {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) return list[i];
      }
    } catch (e) {
      /* localStorage unavailable */
    }
    return null;
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function renderSummary(r) {
    var submitted = r.submittedAt ? new Date(r.submittedAt) : null;
    var submittedText = submitted ? submitted.toLocaleString() : "—";
    return (
      '<dl>' +
      "<dt>Reference</dt><dd>" + escapeHtml(r.id) + "</dd>" +
      "<dt>Student</dt><dd>" + escapeHtml(r.fullName) + "</dd>" +
      "<dt>Email</dt><dd>" + escapeHtml(r.email) + "</dd>" +
      "<dt>Phone</dt><dd>" + escapeHtml(r.phone) + "</dd>" +
      "<dt>Course</dt><dd>" + escapeHtml(r.course) + "</dd>" +
      "<dt>Schedule</dt><dd>" + escapeHtml(r.schedule) + "</dd>" +
      "<dt>Submitted</dt><dd>" + escapeHtml(submittedText) + "</dd>" +
      "</dl>"
    );
  }
})();
