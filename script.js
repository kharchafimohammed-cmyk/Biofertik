// Helpers
const $ = (sel) => document.querySelector(sel);

// ====== CONFIG EMAILJS ======
const EMAILJS_PUBLIC_KEY = "BpQoNKPLcmdYvRiTa";  // OK en front
const EMAILJS_SERVICE_ID = "service_8rptu1n";     // ✅ ton service id
const TEMPLATE_ADMIN_ID = "template_utcxnfm";     // BIOFERTIK_ADMIN
const TEMPLATE_THANKYOU_ID = "template_83zcugh";  // BIOFERTIK_THANKYOU

// ====== Year ======
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ====== Mobile nav ======
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ====== WhatsApp ======
const WHATSAPP_NUMBER = "212600000000"; // <-- mets ton numéro sans +
const WA_MESSAGE = encodeURIComponent(
  "Bonjour, je souhaite un devis pour Biofertik. (Culture / surface / format souhaité) : "
);

function normalizePhoneToWa(raw) {
  if (!raw) return "";
  let digits = String(raw).replace(/[^\d]/g, "");

  // Maroc: 06... -> 2126...
  if (digits.startsWith("0")) {
    digits = "212" + digits.slice(1);
  }
  return digits;
}

function buildWaLink(phoneRaw) {
  const phone = normalizePhoneToWa(phoneRaw);
  if (phone) return `https://wa.me/${phone}?text=${WA_MESSAGE}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MESSAGE}`;
}

const waFloat = $("#waFloat");
const whatsBtn = $("#whatsBtn");
const defaultWaLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MESSAGE}`;
if (waFloat) waFloat.href = defaultWaLink;
if (whatsBtn) whatsBtn.href = defaultWaLink;

// ====== EmailJS init ======
(function initEmailJS() {
  if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();

// ====== Contact form (EmailJS: 2 emails) ======
const form = $("#contactForm");
const statusEl = $("#formStatus");
const sendBtn = $("#sendBtn");

function setStatus(message, isError = false) {
  if (!statusEl) return;
  statusEl.style.display = "block";
  statusEl.classList.toggle("is-error", isError);
  statusEl.textContent = message;
}

function clearStatus() {
  if (!statusEl) return;
  statusEl.style.display = "none";
  statusEl.classList.remove("is-error");
  statusEl.textContent = "";
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearStatus();

    if (!window.emailjs) {
      setStatus("❌ EmailJS n'est pas chargé. Vérifie le script CDN.", true);
      return;
    }

    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.textContent = "Envoi...";
    }

    try {
      // Récupérer les champs
      const fd = new FormData(form);

      const payload = {
        title: "Contact & Devis Biofertik",
        name: (fd.get("name") || "").toString().trim(),
        phone: (fd.get("phone") || "").toString().trim(),
        email: (fd.get("email") || "").toString().trim(),
        city: (fd.get("city") || "").toString().trim(),
        format: (fd.get("format") || "").toString().trim(),
        surface: (fd.get("surface") || "").toString().trim(),
        message: (fd.get("message") || "").toString().trim(),

        // pour le THANKYOU (To Email = {{to_email}})
        to_email: (fd.get("email") || "").toString().trim(),
      };

      // WhatsApp avec le tel saisi
      const waLinkClient = buildWaLink(payload.phone);
      if (waFloat) waFloat.href = waLinkClient;
      if (whatsBtn) whatsBtn.href = waLinkClient;

      // 1) Email ADMIN (toi)
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        TEMPLATE_ADMIN_ID,
        payload
      );

      // 2) Email THANKYOU (client/cooperative)
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        TEMPLATE_THANKYOU_ID,
        payload
      );

      setStatus("✅ Merci ! Votre demande a bien été envoyée. Nous vous contacterons très bientôt.");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("❌ Désolé, l’envoi a échoué. Réessaie ou contacte-nous via WhatsApp.", true);
    } finally {
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = "Envoyer la demande";
      }
    }
  });
}
