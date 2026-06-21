/* assets/js/boot.js
 * Détection de langue AVANT le premier rendu (script bloquant dans <head>).
 * Pose lang/dir immédiatement (pas de "flash" RTL) et masque le contenu le
 * temps de traduire si la langue cible n'est pas la langue par défaut.
 * Cascade : ?lang -> localStorage -> navigator.languages -> défaut.
 */
(function () {
  "use strict";
  var AV = ["fr", "en", "ar"], DEF = "fr", DIR = { fr: "ltr", en: "ltr", ar: "rtl" };

  function san(l) {
    if (!l) return null;
    l = ("" + l).toLowerCase().split("-")[0];
    return AV.indexOf(l) > -1 ? l : null;
  }

  var lang = null;
  try { lang = san(new URLSearchParams(location.search).get("lang")); } catch (e) {}
  if (!lang) { try { lang = san(localStorage.getItem("lang")); } catch (e) {} }
  if (!lang) {
    var pl = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < pl.length; i++) { var m = san(pl[i]); if (m) { lang = m; break; } }
  }
  if (!lang) lang = DEF;

  var d = document.documentElement;
  d.setAttribute("lang", lang);
  d.setAttribute("dir", DIR[lang] || "ltr");
  if (lang !== DEF) { d.className += (d.className ? " " : "") + "translating"; }

  window.__lang = lang;
  window.__i18n = { available: AV, default: DEF, dir: DIR };
})();
