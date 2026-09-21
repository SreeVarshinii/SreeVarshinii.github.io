(function () {
  "use strict";

  var GITHUB_USER = "SreeVarshinii";

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Mobile menu */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("site-nav");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* Section toggles: one panel visible at a time, addressable by hash */
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var panelLinks = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));
  var DEFAULT_PANEL = "experience";

  function hasPanel(id) {
    return panels.some(function (panel) { return panel.id === id; });
  }

  function showPanel(id) {
    panels.forEach(function (panel) {
      panel.classList.toggle("is-active", panel.id === id);
    });
    panelLinks.forEach(function (link) {
      if (link.getAttribute("data-panel") === id) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function revealPanel(id) {
    var panel = document.getElementById(id);
    var narrow = window.matchMedia("(max-width: 59.99rem)").matches;
    if (narrow) {
      var barHeight = document.querySelector(".sidebar").offsetHeight;
      window.scrollTo(0, panel.getBoundingClientRect().top + window.pageYOffset - barHeight - 8);
    } else {
      window.scrollTo(0, 0);
    }
    var heading = panel.querySelector("h2");
    if (heading) heading.focus({ preventScroll: true });
  }

  if (panels.length) {
    var initial = window.location.hash.slice(1);
    showPanel(hasPanel(initial) ? initial : DEFAULT_PANEL);
    if (hasPanel(initial)) {
      window.addEventListener("load", function () {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    }

    panelLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        var id = link.getAttribute("data-panel");
        showPanel(id);
        history.replaceState(null, "", "#" + id);
        revealPanel(id);
      });
    });

    window.addEventListener("hashchange", function () {
      var id = window.location.hash.slice(1);
      if (hasPanel(id)) showPanel(id);
    });
  }

  /* Repository metadata from the GitHub API, cached per session */
  function repoText(data) {
    if (!data.pushed_at) return "";
    var when = new Date(data.pushed_at).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
    return "Updated " + when;
  }

  function fillRepo(node, text) {
    node.textContent = text;
  }

  document.querySelectorAll("[data-repo]").forEach(function (node) {
    var repo = node.getAttribute("data-repo");
    var key = "gh:" + repo;
    try {
      var cached = sessionStorage.getItem(key);
      if (cached) {
        fillRepo(node, cached);
        return;
      }
    } catch (e) { /* storage unavailable */ }

    fetch("https://api.github.com/repos/" + GITHUB_USER + "/" + repo, {
      headers: { Accept: "application/vnd.github+json" }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("GitHub responded " + response.status);
        return response.json();
      })
      .then(function (data) {
        var text = repoText(data);
        fillRepo(node, text);
        try { sessionStorage.setItem(key, text); } catch (e) { /* ignore */ }
      })
      .catch(function () {
        fillRepo(node, "");
      });
  });
})();
