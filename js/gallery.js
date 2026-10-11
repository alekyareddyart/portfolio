// Single source of truth for gallery artwork data.
// NOTE: gallery.html must NOT hardcode .art-card markup — cards are
// rendered here only, once, to avoid duplicate rendering.
const artworks = [
  { image: "images/art01.jpg", title: "The colors of theyyam -The mask", category: "Acrylic",         description: "Acrylic • 8 × 10 in" },
  { image: "images/art02.jpg", title: "", category: "Acrylic",     description: "Acrylic • 6 × 6 in" },
  { image: "images/art03.jpg", title: "Whispering Woods: The Enchanting Canopy", category: "Acrylic",  description: "Acrylic • 8 × 10 in" },
  { image: "images/art04.jpg", title: "Shade of prismatic soul", category: "Acrylic", description: "Acrylic • 8 × 10 in" },
  { image: "images/art05.jpg", title: "Artwork 05", category: "Acrylic",         description: "Acrylic • 6 × 6 in" },
  { image: "images/art06.jpg", title: "Artwork 06", category: "Acrylic",     description: "Acrylic • 6 × 6 in" },
  { image: "images/art07.jpg", title: "Artwork 07", category: "Acrylic",         description: "Acrylic • 6 × 8 in" },
  { image: "images/art08.jpg", title: "Artwork 08", category: "Acrylic",     description: "Acrylic • 6 × 8 in" },
  { image: "images/art09.jpg", title: "Artwork 09", category: "Acrylic",  description: "Acrylic • 6 × 6 in" },
  { image: "images/art10.jpg", title: "Artwork 10", category: "Acrylic",         description: "Acrylic • 6 × 6 in" },
  { image: "images/art11.jpg", title: "Blue Temple-Wat Rong Suea Ten", category: "Acrylic",         description: "Acrylic • 8 × 10 in" },
  { image: "images/art12.jpg", title: "The memories of secret chamber", category: "Acrylic", description: "Acrylic • 8 × 10 in" },
  { image: "images/art13.jpg", title: "Artwork 13", category: "Acrylic",         description: "Acrylic • 6 × 6 in" },
  { image: "images/art14.jpg", title: "Artwork 14", category: "Acrylic", description: "Acrylic • 6 × 8 in" },
  { image: "images/art15.jpg", title: "Artwork 15", category: "Acrylic",     description: "Acrylic • 6 × 8 in" },
  { image: "images/art16.jpg", title: "Artwork 16", category: "Acrylic",         description: "Acrylic • 6 × 8 in" },
  { image: "pics/any.jpg", title: "Moss & sparkels", category: "Acrylic",         description: "Acrylic • 14 × 12 in" }
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

function renderFilters() {
  if (!filterBar) return;
  filterBar.innerHTML = CATEGORIES.map(
    (cat) => `<button type="button" data-filter="${cat}" class="${cat === activeFilter ? "active" : ""}">${cat}</button>`
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
        <img src="${art.image}" alt="${art.title} — ${art.description}" loading="lazy">
        <div class="art-info">
          <h3>${art.title}</h3>
          <p>${art.description}</p>
          <a class="view-btn">View Artwork →</a>
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
  lightboxImg.alt = art.title;
  if (lightboxTitle) lightboxTitle.textContent = art.title;
  if (lightboxDesc) lightboxDesc.textContent = art.description;
}

function openLightbox(index) {
  currentIndex = index;
  updateLightboxContent();
  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.style.display = "none";
  document.body.style.overflow = "";
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
    openLightbox(Number(card.dataset.index));
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
  if (lightbox.style.display !== "flex") return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
});
