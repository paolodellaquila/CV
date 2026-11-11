/* ==========================================================================
   Portfolio interactions — vanilla ES6+
   ========================================================================== */

(() => {
  "use strict";

  const COOKIE_KEY = "fpd_cookie_consent_v1";
  const typedPhrases = [
    "Mobile Manager",
    "Flutter Specialist",
    "iOS & Android Engineer",
    "AI-First Builder",
    "Team Leader",
  ];

  /* Obfuscated contact payload (char codes) — never in plain HTML */
  const CONTACT = {
    e: [102, 112, 46, 100, 101, 108, 108, 97, 113, 117, 105, 108, 97, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109],
    p: [43, 51, 57, 32, 51, 52, 53, 32, 51, 56, 53, 32, 53, 52, 57, 50],
  };

  const decode = (codes) => String.fromCharCode(...codes);

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* -------------------------------------------------------------------------- */
  /* Year
  /* -------------------------------------------------------------------------- */
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -------------------------------------------------------------------------- */
  /* Mobile navigation
  /* -------------------------------------------------------------------------- */
  const navToggle = qs("#nav-toggle");
  const siteNav = qs("#site-nav");

  const setNavOpen = (open) => {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    siteNav.classList.toggle("is-open", open);
    siteNav.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("nav-open", open);
  };

  if (navToggle && siteNav) {
    setNavOpen(false);
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") !== "true";
      setNavOpen(open);
    });

    qsa("a", siteNav).forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setNavOpen(false);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Typed effect
  /* -------------------------------------------------------------------------- */
  const typedEl = qs("#typed-text");
  if (typedEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = typedPhrases[phraseIndex];
      typedEl.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex < current.length) {
        charIndex += 1;
        setTimeout(tick, 70);
        return;
      }
      if (!deleting && charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
      if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(tick, 36);
        return;
      }
      deleting = false;
      phraseIndex = (phraseIndex + 1) % typedPhrases.length;
      setTimeout(tick, 280);
    };
    tick();
  } else if (typedEl) {
    typedEl.textContent = typedPhrases[0];
  }

  /* -------------------------------------------------------------------------- */
  /* Reveal on scroll
  /* -------------------------------------------------------------------------- */
  const reveals = qsa(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* -------------------------------------------------------------------------- */
  /* Experience accordion toggle
  /* -------------------------------------------------------------------------- */
  const expToggle = qs("#experience-toggle");
  const expMore = qs("#experience-more");
  if (expToggle && expMore) {
    expToggle.addEventListener("click", () => {
      const expanded = expToggle.getAttribute("aria-expanded") === "true";
      expToggle.setAttribute("aria-expanded", String(!expanded));
      expMore.hidden = expanded;
      expToggle.textContent = expanded ? "Show earlier roles" : "Hide earlier roles";
      if (!expanded) {
        qsa(".reveal", expMore).forEach((el) => el.classList.add("is-visible"));
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Accordion
  /* -------------------------------------------------------------------------- */
  qsa("[data-accordion]").forEach((accordion) => {
    qsa(".accordion__trigger", accordion).forEach((btn) => {
      btn.addEventListener("click", () => {
        const panelId = btn.getAttribute("aria-controls");
        const panel = panelId ? qs(`#${panelId}`) : null;
        if (!panel) return;
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
        const icon = btn.querySelector("span[aria-hidden]");
        if (icon) icon.textContent = open ? "+" : "−";
      });
    });
  });

  /* -------------------------------------------------------------------------- */
  /* Contact reveal (anti-scraper)
  /* -------------------------------------------------------------------------- */
  const revealEmailBtn = qs("#reveal-email");
  const revealPhoneBtn = qs("#reveal-phone");
  const emailSlot = qs("#email-slot");
  const phoneSlot = qs("#phone-slot");

  const revealEmail = () => {
    if (!emailSlot) return;
    const email = decode(CONTACT.e);
    emailSlot.hidden = false;
    emailSlot.innerHTML = "";
    const link = document.createElement("a");
    link.href = `mailto:${email}`;
    link.rel = "nofollow noopener";
    link.textContent = email;
    emailSlot.appendChild(link);
    if (revealEmailBtn) {
      revealEmailBtn.setAttribute("aria-pressed", "true");
      revealEmailBtn.textContent = "Email revealed";
    }
  };

  const revealPhone = () => {
    if (!phoneSlot) return;
    const phone = decode(CONTACT.p);
    const tel = phone.replace(/\s+/g, "");
    phoneSlot.hidden = false;
    phoneSlot.innerHTML = "";
    const link = document.createElement("a");
    link.href = `tel:${tel}`;
    link.rel = "nofollow noopener";
    link.textContent = phone;
    phoneSlot.appendChild(link);
    if (revealPhoneBtn) {
      revealPhoneBtn.setAttribute("aria-pressed", "true");
      revealPhoneBtn.textContent = "Phone revealed";
    }
  };

  revealEmailBtn?.addEventListener("click", revealEmail);
  revealPhoneBtn?.addEventListener("click", revealPhone);

  /* -------------------------------------------------------------------------- */
  /* Contact form validation + mailto handoff
  /* -------------------------------------------------------------------------- */
  const form = qs("#contact-form");
  if (form) {
    const setError = (fieldId, message) => {
      const field = qs(`#${fieldId}`)?.closest(".form-field");
      const error = qs(`#${fieldId}-error`);
      if (field) field.classList.toggle("is-invalid", Boolean(message));
      if (error) {
        error.hidden = !message;
        error.textContent = message || "";
      }
    };

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Honeypot — bots fill this
      const hp = qs("#company_url");
      if (hp && hp.value.trim() !== "") {
        return;
      }

      const name = qs("#name")?.value.trim() || "";
      const email = qs("#email")?.value.trim() || "";
      const message = qs("#message")?.value.trim() || "";
      const privacy = qs("#privacy")?.checked;

      let valid = true;
      if (!name) {
        setError("name", "Please enter your name.");
        valid = false;
      } else setError("name", "");

      if (!email) {
        setError("email", "Please enter your email.");
        valid = false;
      } else if (!validateEmail(email)) {
        setError("email", "Please enter a valid email address.");
        valid = false;
      } else setError("email", "");

      if (!message || message.length < 10) {
        setError("message", "Please write a message (at least 10 characters).");
        valid = false;
      } else setError("message", "");

      if (!privacy) {
        setError("privacy", "Please accept the privacy policy.");
        valid = false;
      } else setError("privacy", "");

      if (!valid) return;

      const to = decode(CONTACT.e);
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      const success = qs("#form-success");
      if (success) success.hidden = false;
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      form.reset();
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Back to top
  /* -------------------------------------------------------------------------- */
  const backTop = qs("#back-top");
  if (backTop) {
    const onScroll = () => {
      backTop.hidden = window.scrollY < 500;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Cookie consent (GDPR)
  /* -------------------------------------------------------------------------- */
  const banner = qs("#cookie-banner");
  const modal = qs("#cookie-modal");
  const analyticsToggle = qs("#cookie-analytics");
  const prefsForm = qs("#cookie-prefs-form");

  const readConsent = () => {
    try {
      return JSON.parse(localStorage.getItem(COOKIE_KEY) || "null");
    } catch {
      return null;
    }
  };

  const writeConsent = (consent) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    applyConsent(consent);
  };

  const applyConsent = (consent) => {
    // Hook for future analytics loaders — only when analytics === true
    window.__FPD_CONSENT__ = consent;
    if (consent?.analytics) {
      document.documentElement.dataset.analytics = "granted";
    } else {
      document.documentElement.dataset.analytics = "denied";
    }
  };

  const openModal = () => {
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    const existing = readConsent();
    if (analyticsToggle) analyticsToggle.checked = Boolean(existing?.analytics);
    qs(".modal__close", modal)?.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  const showBanner = () => {
    if (banner) banner.hidden = false;
  };

  const hideBanner = () => {
    if (banner) banner.hidden = true;
  };

  const existingConsent = readConsent();
  if (existingConsent) {
    applyConsent(existingConsent);
    hideBanner();
  } else {
    showBanner();
  }

  qsa("[data-cookie]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-cookie");
      if (action === "accept") {
        writeConsent({ essential: true, analytics: true, ts: Date.now() });
        hideBanner();
        closeModal();
      } else if (action === "reject") {
        writeConsent({ essential: true, analytics: false, ts: Date.now() });
        hideBanner();
        closeModal();
      } else if (action === "prefs") {
        openModal();
      }
    });
  });

  qsa("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  prefsForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    writeConsent({
      essential: true,
      analytics: Boolean(analyticsToggle?.checked),
      ts: Date.now(),
    });
    hideBanner();
    closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();
