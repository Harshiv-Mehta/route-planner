(function () {
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("siteNav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  var page = document.body.getAttribute("data-page");
  if (page && nav) {
    Array.prototype.forEach.call(nav.querySelectorAll("a[data-nav]"), function (link) {
      if (link.getAttribute("data-nav") === page) {
        link.classList.add("active");
      }
    });
  }

  var yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
})();
