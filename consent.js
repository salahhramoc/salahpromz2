/* ===== Google Analytics ===== 
   Klistra in ditt mätar-ID här, till exempel "G-ABC123XYZ". Lämna tomt för att stänga av. */
var GA_ID = "";
/* =========================== */
(function () {
  var K = "sr_consent", d = document;
  function get() { try { return localStorage.getItem(K); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(K, v); } catch (e) {} }
  function loadGA() {
    if (!GA_ID || window.__ga) return; window.__ga = 1;
    var s = d.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID; d.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }
  function clearGA() {
    d.cookie.split(";").forEach(function (c) {
      var n = c.split("=")[0].trim();
      if (n === "_ga" || n.indexOf("_ga_") === 0 || n === "_gid") {
        d.cookie = n + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        d.cookie = n + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + location.hostname.replace(/^www\./, "");
      }
    });
    if (GA_ID) window["ga-disable-" + GA_ID] = true;
  }
  function bar() {
    var old = d.getElementById("ckbar"); if (old) old.remove();
    var b = d.createElement("div"); b.id = "ckbar"; b.setAttribute("role", "dialog"); b.setAttribute("aria-label", "Cookies");
    var root = d.body.getAttribute("data-root") || "";
    b.innerHTML = '<p>Vi vill använda statistikcookies (Google Analytics) för att förbättra sidan. Du väljer själv. <a href="' + root + 'integritetspolicy.html">Läs mer</a></p><div><button class="btn" id="ckyes">Godkänn</button> <button class="btn alt" id="ckno">Avvisa</button></div>';
    d.body.appendChild(b);
    d.getElementById("ckyes").onclick = function () { set("yes"); b.remove(); loadGA(); };
    d.getElementById("ckno").onclick = function () { set("no"); b.remove(); clearGA(); };
  }
  var link = d.getElementById("ckset");
  if (!GA_ID) { if (link) link.hidden = true; return; }
  if (link) link.onclick = function (e) { e.preventDefault(); bar(); };
  var c = get();
  if (c === "yes") loadGA(); else if (c !== "no") bar();
})();
