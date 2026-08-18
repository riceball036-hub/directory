const navToggle = document.querySelector("[data-nav-toggle]");
const primaryNav = document.querySelector("[data-primary-nav]");

if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    primaryNav.toggleAttribute("data-open", !expanded);
  });
}

const ageGate = document.querySelector("[data-age-gate]");
const ageConfirmedKey = "directory-age-confirmed";

if (ageGate instanceof HTMLDialogElement && localStorage.getItem(ageConfirmedKey) !== "yes") {
  ageGate.showModal();
  document.documentElement.classList.add("dialog-open");
}

document.querySelector("[data-age-confirm]")?.addEventListener("click", () => {
  localStorage.setItem(ageConfirmedKey, "yes");
  if (ageGate instanceof HTMLDialogElement) ageGate.close();
  document.documentElement.classList.remove("dialog-open");
});

document.querySelector("[data-age-exit]")?.addEventListener("click", () => {
  window.location.replace("https://www.google.com/");
});

const backToTop = document.querySelector("[data-back-to-top]");
if (backToTop) {
  const progressCircle = backToTop.querySelector("circle");
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    backToTop.toggleAttribute("data-visible", window.scrollY > 500);
    if (progressCircle) progressCircle.style.strokeDashoffset = String(119.4 - 119.4 * progress);
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  updateProgress();
}

