(function () {
  function scrollToHash() {
    var id = window.location.hash.slice(1);
    if (!id) {
      return;
    }

    var target = document.getElementById(id);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scrollToHash);
  } else {
    scrollToHash();
  }

  window.addEventListener("hashchange", scrollToHash);
})();
