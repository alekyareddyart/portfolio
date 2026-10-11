// Single source of truth for gallery artwork data.
// NOTE: gallery.html must NOT hardcode .art-card markup — cards are
// rendered here only, once, to avoid duplicate rendering.
const artworks = [
  { image: "images/art01.jpg", width: 1276, height: 1600, title: "The colors of theyyam -The mask", category: "Acrylic",         description: "Acrylic • 8 × 10 in" },
  { image: "images/art02.jpg", width: 1600, height: 1587, title: "", category: "Acrylic",     description: "Acrylic • 6 × 6 in" },
  { image: "images/art03.jpg", width: 865, height: 1078, title: "Whispering Woods: The Enchanting Canopy", category: "Acrylic",  description: "Acrylic • 8 × 10 in" },
  { image: "images/art04.jpg", width: 684, height: 862, title: "Shade of prismatic soul", category: "Acrylic", description: "Acrylic • 8 × 10 in" },
  { image: "images/art05.jpg", width: 1600, height: 1569, title: "Artwork 05", category: "Acrylic",         description: "Acrylic • 6 × 6 in" },
  { image: "images/art06.jpg", width: 849, height: 831, title: "Artwork 06", category: "Acrylic",     description: "Acrylic • 6 × 6 in" },
  { image: "images/art07.jpg", width: 749, height: 1009, title: "Artwork 07", category: "Acrylic",         description: "Acrylic • 6 × 8 in" },
  { image: "images/art08.jpg", width: 960, height: 1280, title: "Artwork 08", category: "Acrylic",     description: "Acrylic • 6 × 8 in" },
  { image: "images/art09.jpg", width: 1165, height: 1175, title: "Artwork 09", category: "Acrylic",  description: "Acrylic • 6 × 6 in" },
  { image: "images/art10.jpg", width: 1600, height: 1578, title: "Artwork 10", category: "Acrylic",         description: "Acrylic • 6 × 6 in" },
  { image: "images/art11.jpg", width: 1278, height: 1600, title: "Blue Temple-Wat Rong Suea Ten", category: "Acrylic",         description: "Acrylic • 8 × 10 in" },
  { image: "images/art12.jpg", width: 1257, height: 1600, title: "The memories of secret chamber", category: "Acrylic", description: "Acrylic • 8 × 10 in" },
  { image: "images/art13.jpg", width: 1200, height: 1600, title: "Artwork 13", category: "Acrylic",         description: "Acrylic • 6 × 6 in" },
  { image: "images/art14.jpg", width: 1202, height: 1600, title: "Artwork 14", category: "Acrylic", description: "Acrylic • 6 × 8 in" },
  { image: "images/art15.jpg", width: 720, height: 1280, title: "Artwork 15", category: "Acrylic",     description: "Acrylic • 6 × 8 in" },
  { image: "images/art16.jpg", width: 720, height: 1280, title: "Artwork 16", category: "Acrylic",         description: "Acrylic • 6 × 8 in" },
  { image: "pics/any.jpg", width: 1280, height: 1084, title: "Moss & sparkels", category: "Acrylic",         description: "Acrylic • 14 × 12 in" }
];
// Artwork 17 was removed: its image file was byte-identical to Artwork 05
// (both were copies of images/art1.jpg used as the homepage feature image),
// but listed with a different medium/size — i.e. the same painting was
// presented twice under contradictory captions. Add a genuine 17th piece
// here (with its own image file) when one is available.

const CATEGORIES = ["All", "Oil", "Acrylic", "Watercolor", "Mixed Media"];

const gallery = document.getElementById("gallery-grid");
const filterBar = document.getElementById("gallery-filter");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDesc = document.getElementById("lightbox-desc");
const closeBtn = document.getElementById("close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let activeFilter = "All";
let visible = artworks; // the list currently on screen, kept in sync with the filter
let currentIndex = 0;
let lightboxIsOpen = false;
let returnFocusTo = null;
let previousOverflow = "";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function renderFilters() {
  if (!filterBar) return;
  filterBar.innerHTML = CATEGORIES.map(
    (cat) => `<button type="button" data-filter="${cat}" aria-pressed="${cat === activeFilter}" class="${cat === activeFilter ? "active" : ""}">${cat}</button>`
  ).join("");
}

// Render each artwork exactly once. This is the single source of truth —
// gallery.html should NOT contain hardcoded .art-card markup, or every
// artwork will render twice.
function renderGallery() {
  visible = activeFilter === "All" ? artworks : artworks.filter((a) => a.category === activeFilter);

  gallery.innerHTML = visible
    .map(
      (art, i) => `
      <div class="art-card" data-index="${i}">
        <img src="${art.image}" width="${art.width}" height="${art.height}" alt="${escapeHtml(art.title || "Untitled artwork")} — ${escapeHtml(art.description)}" loading="lazy" decoding="async">
        <div class="art-info">
          <h3>${escapeHtml(art.title || "Untitled artwork")}</h3>
          <p>${escapeHtml(art.description)}</p>
          <button type="button" class="view-btn" aria-label="View ${escapeHtml(art.title || "Untitled artwork")}">View Artwork →</button>
        </div>
      </div>
    `
    )
    .join("");
}

function setFilter(cat) {
  activeFilter = cat;
  renderFilters();
  renderGallery();
}

function updateLightboxContent() {
  const art = visible[currentIndex];
  lightboxImg.src = art.image;
  lightboxImg.alt = art.title || "Untitled artwork";
  lightboxImg.width = art.width;
  lightboxImg.height = art.height;
  if (lightboxTitle) lightboxTitle.textContent = art.title || "Untitled artwork";
  if (lightboxDesc) lightboxDesc.textContent = art.description;
}

function openLightbox(index, trigger) {
  currentIndex = index;
  returnFocusTo = trigger;
  previousOverflow = document.body.style.overflow;
  updateLightboxContent();
  lightboxIsOpen = true;
  lightbox.style.display = "grid";
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeBtn.focus({ preventScroll: true });
}

function closeLightbox() {
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden", "true");
  lightboxIsOpen = false;
  document.body.style.overflow = previousOverflow;
  if (returnFocusTo && returnFocusTo.isConnected) returnFocusTo.focus({ preventScroll: true });
}

function showPrev() {
  currentIndex = (currentIndex - 1 + visible.length) % visible.length;
  updateLightboxContent();
}

function showNext() {
  currentIndex = (currentIndex + 1) % visible.length;
  updateLightboxContent();
}

renderFilters();
renderGallery();

if (filterBar) {
  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (btn) setFilter(btn.dataset.filter);
  });
}

gallery.addEventListener("click", (e) => {
  const card = e.target.closest(".art-card");
  if (card) {
    openLightbox(Number(card.dataset.index), card.querySelector(".view-btn"));
  }
});

closeBtn.addEventListener("click", closeLightbox);

prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  showPrev();
});

nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  showNext();
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightboxIsOpen) return;
  if (e.key === "Escape") {
    e.preventDefault();
    closeLightbox();
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    showPrev();
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    showNext();
  }
  if (e.key === "Tab") {
    if (e.shiftKey && document.activeElement === closeBtn) {
      e.preventDefault();
      nextBtn.focus();
    } else if (!e.shiftKey && document.activeElement === nextBtn) {
      e.preventDefault();
      closeBtn.focus();
    }
  }
});
