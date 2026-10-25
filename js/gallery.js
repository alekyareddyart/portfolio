// Single source of truth for gallery artwork data.
// NOTE: gallery.html must NOT hardcode .art-card markup — cards are
// rendered here only, once, to avoid duplicate rendering.
const artworks = [
  {"image": "images/clean/art01.jpg", "width": 1263, "height": 1587, "title": "The colors of theyyam -The mask", "category": "Culture", "description": "Acrylic • 8 × 10 in"},
  {"image": "images/clean/art02.jpg", "width": 1569, "height": 1563, "title": "Radha Krishna: The Divine Advaita", "category": "Culture", "description": "Acrylic • 6 × 6 in", "original": true},
  {"image": "images/clean/art03.jpg", "width": 851, "height": 1066, "title": "Whispering Woods: The Enchanting Canopy", "category": "Nature", "description": "Acrylic • 8 × 10 in", "original": true},
  {"image": "images/clean/art04.jpg", "width": 679, "height": 857, "title": "Shade of prismatic soul", "category": "Imagination", "description": "Acrylic • 8 × 10 in"},
  {"image": "images/clean/art05.jpg", "width": 1589, "height": 1558, "title": "Whispering Pines, Aurora Sky", "category": "Nature", "description": "Acrylic • 6 × 6 in", "original": true},
  {"image": "images/clean/art06.jpg", "width": 828, "height": 815, "title": "Dark forest: Aurelia", "category": "Nature", "description": "Acrylic • 6 × 6 in", "original": true},
  {"image": "images/clean/art07.jpg", "width": 733, "height": 981, "title": "The Sakura Mirage", "category": "Nature", "description": "Acrylic • 6 × 8 in", "original": true},
  {"image": "images/clean/art08.jpg", "width": 806, "height": 1085, "title": "Lals of the Turban", "category": "Culture", "description": "Acrylic • 6 × 8 in"},
  {"image": "images/clean/art09.jpg", "width": 1158, "height": 1170, "title": "Ripples of Serenity", "category": "Nature", "description": "Acrylic • 6 × 6 in", "original": true},
  {"image": "images/clean/art10.jpg", "width": 1593, "height": 1571, "title": "The Kyoto Pagoda: Starry Sanctuaries", "category": "Culture", "description": "Acrylic • 6 × 6 in"},
  {"image": "images/clean/art11.jpg", "width": 1243, "height": 1563, "title": "Blue Temple-Wat Rong Suea Ten", "category": "Culture", "description": "Acrylic • 8 × 10 in", "original": true},
  {"image": "images/clean/art12.jpg", "width": 1242, "height": 1578, "title": "The memories of secret chamber", "category": "Culture", "description": "Acrylic • 8 × 10 in", "original": true},
  {"image": "images/clean/art13.jpg", "width": 916, "height": 907, "title": "Little Companion", "category": "Nature", "description": "Acrylic • 6 × 6 in"},
  {"image": "images/clean/art14.jpg", "width": 1195, "height": 1593, "title": "The Srirangam Rajagopuram: Devotional Gates", "category": "Culture", "description": "Acrylic • 6 × 8 in", "original": true},
  {"image": "images/clean/art15-straightened.jpg", "width": 562, "height": 754, "title": "The palace of illusions- Tales of cartoon odyssey", "category": "Imagination", "description": "Acrylic • 6 × 8 in", "original": true},
  {"image": "images/clean/art16.jpg", "width": 426, "height": 562, "title": "Golden Hour’s - Gorge rays", "category": "Nature", "description": "Acrylic • 6 × 8 in", "original": true},
  {"image": "images/clean/any.jpg", "width": 1277, "height": 1081, "title": "Moss & sparkels", "category": "Nature", "description": "Acrylic • 14 × 12 in"},
  {"image": "images/clean/lakshmi-narayan.jpg", "width": 954, "height": 952, "title": "Lakshmi-Narayan Ardh swaroop", "category": "Culture", "description": "12 × 15 inches", "original": true},
  {"image": "images/clean/gargantua.jpg", "width": 706, "height": 1095, "title": "The infinity gargantua", "category": "Imagination", "description": "30 × 45 cm", "original": true},
  {"image": "images/clean/quiet-homecoming.jpg", "width": 245, "height": 189, "title": "A Walk Beside the Stream", "category": "Culture", "description": "Original artwork", "original": true},
  {"image": "images/clean/hawkins-after-dark.jpg", "width": 900, "height": 1200, "title": "Hawkins after dark", "category": "Imagination", "description": "30 × 40 cm"}
];
const CATEGORIES = ["All", "Culture", "Nature", "Imagination", "Originals"];

const gallery = document.getElementById("gallery-grid");
const sectionEyebrow = document.getElementById("gallery-section-eyebrow");
const sectionTitle = document.getElementById("gallery-section-title");
const ORIGINAL_ORDER = ["images/clean/art03.jpg", "images/clean/art11.jpg", "images/clean/art12.jpg", "images/clean/art15-straightened.jpg", "images/clean/art07.jpg", "images/clean/art16.jpg", "images/clean/quiet-homecoming.jpg", "images/clean/art14.jpg", "images/clean/art05.jpg", "images/clean/art09.jpg", "images/clean/art06.jpg", "images/clean/art02.jpg", "images/clean/gargantua.jpg", "images/clean/lakshmi-narayan.jpg"];
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
  visible = activeFilter === "All"
    ? artworks
    : activeFilter === "Originals"
      ? ORIGINAL_ORDER.map((image) => artworks.find((artwork) => artwork.image === image)).filter(Boolean)
      : artworks.filter((a) => a.category === activeFilter);

  if (sectionEyebrow && sectionTitle) {
    sectionEyebrow.textContent = activeFilter === "Originals" ? "A CURATED COLLECTION" : "ARTWORK COLLECTION";
    sectionTitle.textContent = activeFilter === "Originals" ? "Originals" : activeFilter === "All" ? "All artworks" : activeFilter;
  }

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
