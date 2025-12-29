// ===== Helpers
const $ = (sel) => document.querySelector(sel);

const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Mobile nav
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  // close menu on link click
  navMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ===== WhatsApp links (REMPLACE le numéro)
const WHATSAPP_NUMBER = "212600000000"; // <-- Mets ton numéro: ex: 2126XXXXXXXX
const WA_MESSAGE = encodeURIComponent(
  "Bonjour, je souhaite un devis pour Biofertik. (Culture / surface / format souhaité) : "
);

const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MESSAGE}`;

const waFloat = $("#waFloat");
const whatsBtn = $("#whatsBtn");
if (waFloat) waFloat.href = waLink;
if (whatsBtn) whatsBtn.href = waLink;

// ===== Contact form: opens email (simple + gratuit)
const form = $("#contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = data.get("name") || "";
    const phone = data.get("phone") || "";
    const city = data.get("city") || "";
    const format = data.get("format") || "";
    const message = data.get("message") || "";

    const subject = encodeURIComponent("Demande Biofertik — Devis / Informations");
    const body = encodeURIComponent(
      `Nom/Coopérative: ${name}\nTéléphone: ${phone}\nVille: ${city}\nFormat: ${format}\n\nMessage:\n${message}\n\n— Envoyé depuis le site Biofertik`
    );

    // Mets ton email ici (ou laisse vide et change plus tard)
    const EMAIL = "contact@biofertik.ma"; // <-- remplace si tu as un email réel
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  });
}
