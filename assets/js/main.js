/* assets/js/main.js
 * --------------------------------------------------------------
 * Rendu multilingue côté navigateur (la détection initiale est faite par
 * boot.js, exécuté avant le rendu). Ce script :
 *   - charge translations.json (source de données indexée par (id, langue)) ;
 *   - traduit les textes et attributs marqués data-i18n / data-i18n-attr ;
 *   - met à jour titre, meta description, Open Graph, JSON-LD, liens perso ;
 *   - charge la vidéo YouTube de la langue active à la demande (lazy) ;
 *   - change de langue sans rechargement (l'ancre #section est conservée).
 * -------------------------------------------------------------- */
(function () {
  "use strict";

  var CFG = window.__i18n || { available: ["fr", "en", "ar"], default: "fr", dir: { fr: "ltr", en: "ltr", ar: "rtl" } };
  var OG_LOCALE = { fr: "fr_FR", en: "en_US", ar: "ar_AR" };
  var DATA = null;
  var videoLoaded = false;

  function san(l) {
    if (!l) return null;
    l = ("" + l).toLowerCase().split("-")[0];
    return CFG.available.indexOf(l) > -1 ? l : null;
  }

  function detect() {
    var u = null;
    try { u = san(new URLSearchParams(location.search).get("lang")); } catch (e) {}
    if (u) return u;
    var s = null;
    try { s = san(localStorage.getItem("lang")); } catch (e) {}
    if (s) return s;
    var pl = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < pl.length; i++) { var m = san(pl[i]); if (m) return m; }
    return CFG.default;
  }

  function tr(id, lang) {
    var b = DATA.content[id];
    if (!b) return "";
    return b[lang] != null ? b[lang] : (b[CFG.default] || "");
  }

  function setAttr(id, attr, val) {
    var el = document.getElementById(id);
    if (el) el.setAttribute(attr, val);
  }

  function videoId(lang) {
    return DATA.video[lang] || DATA.video[CFG.default];
  }

  // --- Vidéo : façade légère, l'iframe ne charge qu'au clic ---------------
  function refreshVideo(lang) {
    var id = videoId(lang);
    var thumb = document.getElementById("video-thumb");
    if (thumb) thumb.src = "https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/hqdefault.jpg";

    if (videoLoaded) {
      var frame = document.getElementById("video-frame");
      var iframe = document.getElementById("video-iframe");
      if (iframe && frame) {
        iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
      }
    }
  }

  function loadVideo(lang) {
    var frame = document.getElementById("video-frame");
    var facade = document.getElementById("video-facade");
    if (!frame || !facade) return;
    var iframe = document.createElement("iframe");
    iframe.id = "video-iframe";
    iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(videoId(lang)) + "?autoplay=1&rel=0";
    iframe.title = tr("video_heading", lang);
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.setAttribute("allowfullscreen", "allowfullscreen");
    facade.replaceWith(iframe);
    videoLoaded = true;
  }

  // --- Métadonnées dynamiques (OG / JSON-LD / canonical) ------------------
  function updateMeta(lang) {
    document.title = tr("meta_title", lang);
    // Dublin Core (RDFa) — métadonnées du document
    setAttr("dc-title", "content", tr("meta_title", lang));
    setAttr("dc-desc", "content", tr("meta_description", lang));
    setAttr("dc-language", "content", lang);
    setAttr("og-title", "content", tr("meta_title", lang));
    setAttr("og-desc", "content", tr("meta_description", lang));
    setAttr("og-locale", "content", OG_LOCALE[lang] || "fr_FR");
    var canonical = location.origin + location.pathname + "?lang=" + lang;
    setAttr("canonical", "href", canonical);

    var p = DATA.person;
    var ld = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": p.name,
      "email": "mailto:" + p.email,
      "jobTitle": tr("role", lang),
      "description": tr("meta_description", lang),
      "knowsLanguage": ["ar", "fr", "en"],
      "alumniOf": { "@type": "CollegeOrUniversity", "name": "Sup Galilée — Université Sorbonne Paris Nord" },
      "sameAs": [p.linkedin, p.github]
    };
    var tag = document.getElementById("ld-person");
    if (tag) tag.textContent = JSON.stringify(ld);
  }

  // --- Application d'une langue -------------------------------------------
  function applyLang(lang) {
    var d = document.documentElement;
    d.setAttribute("lang", lang);
    d.setAttribute("dir", CFG.dir[lang] || "ltr");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = tr(el.getAttribute("data-i18n"), lang);
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var b = pair.split(":");
        el.setAttribute(b[0].trim(), tr(b[1].trim(), lang));
      });
    });

    var p = DATA.person;
    setAttr("contact-email", "href", "mailto:" + p.email);
    setAttr("contact-linkedin", "href", p.linkedin);
    setAttr("contact-github", "href", p.github);
    setAttr("meta-linkedin", "href", p.linkedin);
    setAttr("meta-github", "href", p.github);
    setAttr("brand-home", "href", "?lang=" + lang);

    updateMeta(lang);
    refreshVideo(lang);

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var on = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", on);
      if (on) btn.setAttribute("aria-current", "true"); else btn.removeAttribute("aria-current");
    });

    try { localStorage.setItem("lang", lang); } catch (e) {}
    window.history.replaceState(null, "", "?lang=" + lang + (location.hash || ""));

    document.documentElement.classList.remove("translating");
  }

  // --- Démarrage ----------------------------------------------------------
  function init() {
    applyLang(window.__lang || detect());

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { applyLang(btn.getAttribute("data-lang")); });
    });

    var facade = document.getElementById("video-facade");
    if (facade) {
      facade.addEventListener("click", function () {
        loadVideo(document.documentElement.getAttribute("lang") || CFG.default);
      });
    }
  }

  fetch("translations.json")
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (json) { DATA = json; init(); })
    .catch(function (err) {
      console.error("translations.json :", err);
      document.documentElement.classList.remove("translating"); // révèle le FR pré-rendu
    });
})();
