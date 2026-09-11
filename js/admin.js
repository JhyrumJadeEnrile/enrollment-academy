// admin.js — runs only on admin.html
(function () {
  "use strict";

  var STORAGE_KEY = "northfield_enrollments";

  document.addEventListener("DOMContentLoaded", function () {
    var tableBody = document.getElementById("admin-body");
    var empty = document.getElementById("admin-empty");
    var table = document.getElementById("admin-table");
    var clearBtn = document.getElementById("clear-all");
    var countEl = document.getElementById("admin-count");

    if (!tableBody) return;

    render();

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (window.confirm("Remove all locally-stored enrollments on this device?")) {
          try {
            window.localStorage.removeItem(STORAGE_KEY);
          } catch (e) {
            /* ignore */
          }
          render();
        }
      });
    }

    function render() {
      var list = load();
      if (countEl) {
        countEl.textContent = list.length + (list.length === 1 ? " enrollment" : " enrollments");
      }
      if (list.length === 0) {
        if (table) table.style.display = "none";
        if (empty) empty.style.display = "block";
        return;
      }
      if (table) table.style.display = "table";
      if (empty) empty.style.display = "none";

      tableBody.innerHTML = list
        .slice()
        .reverse()
        .map(function (r) {
          var date = r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—";
          return (
            "<tr>" +
            "<td>" + escapeHtml(r.id) + "</td>" +
            "<td>" + escapeHtml(r.fullName) + "</td>" +
            "<td>" + escapeHtml(r.email) + "<br>" + escapeHtml(r.phone) + "</td>" +
            "<td>" + escapeHtml(r.course) + "</td>" +
            "<td>" + escapeHtml(r.schedule) + "</td>" +
            "<td>" + escapeHtml(date) + "</td>" +
            "</tr>"
          );
        })
        .join("");
    }

    function load() {
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    function escapeHtml(str) {
      var div = document.createElement("div");
      div.textContent = str == null ? "" : String(str);
      return div.innerHTML;
    }
  });
})();
