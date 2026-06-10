var ALLOWED_TAGS = new Set([
  "a", "abbr", "address", "article", "aside", "audio",
  "b", "bdi", "bdo", "blockquote", "br",
  "caption", "cite", "code", "col", "colgroup",
  "data", "datalist", "dd", "del", "details", "dfn", "div", "dl", "dt",
  "em",
  "fieldset", "figcaption", "figure", "footer",
  "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr",
  "i", "img", "ins",
  "kbd",
  "label", "legend", "li",
  "main", "map", "mark", "meter",
  "nav",
  "ol", "optgroup", "option", "output",
  "p", "picture", "pre", "progress",
  "q",
  "rp", "rt", "ruby",
  "s", "samp", "section", "small", "source", "span", "strong",
  "style", "sub", "summary", "sup",
  "table", "tbody", "td", "tfoot", "th", "thead", "time", "tr", "track",
  "u", "ul",
  "var", "video",
  "wbr"
]);

var BLOCKED_TAGS = new Set([
  "script", "svg", "math", "noscript", "iframe", "embed", "object",
  "applet", "base", "link", "template", "meta"
]);

var ALLOWED_ATTRS = new Set([
  "href", "src", "alt", "title", "class", "id", "style",
  "width", "height", "target", "rel", "loading", "decoding",
  "colspan", "rowspan", "span", "headers", "scope",
  "type", "value", "placeholder", "disabled", "readonly",
  "name", "for", "label",
  "start", "reversed", "cite", "datetime", "wrap",
  "open", "max", "min", "low", "high", "optimum",
  "controls", "loop", "muted", "preload",
  "poster", "playsinline"
]);

var URL_ATTRS = new Set(["href", "src", "poster", "data", "action", "formaction"]);
var SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:", "data:image/"]);
var RAW_TEXT_ELEMENTS = new Set(["style"]);

var NAMED_ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  nbsp: "\u00A0", ensp: "\u2002", emsp: "\u2003",
  thinsp: "\u2009", zwnj: "\u200C", zwj: "\u200D",
  lrm: "\u200E", rlm: "\u200F",
  ndash: "\u2013", mdash: "\u2014",
  lsquo: "\u2018", rsquo: "\u2019",
  ldquo: "\u201C", rdquo: "\u201D",
  bull: "\u2022", hellip: "\u2026",
  prime: "\u2032", Prime: "\u2033",
  copy: "\u00A9", reg: "\u00AE", trade: "\u2122",
  laquo: "\u00AB", raquo: "\u00BB",
  deg: "\u00B0", plusmn: "\u00B1",
  micro: "\u00B5", para: "\u00B6",
  middot: "\u00B7", frac12: "\u00BD",
  times: "\u00D7", divide: "\u00F7",
  euro: "\u20AC", pound: "\u00A3", yen: "\u00A5", cent: "\u00A2",
  iexcl: "\u00A1", curren: "\u00A4",
  brvbar: "\u00A6", sect: "\u00A7",
  uml: "\u00A8", ordf: "\u00AA",
  not: "\u00AC", shy: "\u00AD",
  macr: "\u00AF", ordm: "\u00BA",
  sup1: "\u00B9", sup2: "\u00B2", sup3: "\u00B3",
  acute: "\u00B4", cedil: "\u00B8",
  iquest: "\u00BF",
  Agrave: "\u00C0", Aacute: "\u00C1", Acirc: "\u00C2",
  Atilde: "\u00C3", Auml: "\u00C4", Aring: "\u00C5",
  AElig: "\u00C6", Ccedil: "\u00C7",
  Egrave: "\u00C8", Eacute: "\u00C9", Ecirc: "\u00CA", Euml: "\u00CB",
  Igrave: "\u00CC", Iacute: "\u00CD", Icirc: "\u00CE", Iuml: "\u00CF",
  ETH: "\u00D0", Ntilde: "\u00D1",
  Ograve: "\u00D2", Oacute: "\u00D3", Ocirc: "\u00D4",
  Otilde: "\u00D5", Ouml: "\u00D6",
  Oslash: "\u00D8", Ugrave: "\u00D9",
  Uacute: "\u00DA", Ucirc: "\u00DB", Uuml: "\u00DC",
  Yacute: "\u00DD", THORN: "\u00DE", szlig: "\u00DF",
  agrave: "\u00E0", aacute: "\u00E1", acirc: "\u00E2",
  atilde: "\u00E3", auml: "\u00E4", aring: "\u00E5",
  aelig: "\u00E6", ccedil: "\u00E7",
  egrave: "\u00E8", eacute: "\u00E9", ecirc: "\u00EA", euml: "\u00EB",
  igrave: "\u00EC", iacute: "\u00ED", icirc: "\u00EE", iuml: "\u00EF",
  eth: "\u00F0", ntilde: "\u00F1",
  ograve: "\u00F2", oacute: "\u00F3", ocirc: "\u00F4",
  otilde: "\u00F5", ouml: "\u00F6",
  oslash: "\u00F8", ugrave: "\u00F9",
  uacute: "\u00FA", ucirc: "\u00FB", uuml: "\u00FC",
  yacute: "\u00FD", thorn: "\u00FE", yuml: "\u00FF",
  OElig: "\u0152", oelig: "\u0153",
  Scaron: "\u0160", scaron: "\u0161",
  Yuml: "\u0178", fnof: "\u0192",
  circ: "\u02C6", tilde: "\u02DC",
  Alpha: "\u0391", Beta: "\u0392", Gamma: "\u0393", Delta: "\u0394",
  Epsilon: "\u0395", Zeta: "\u0396", Eta: "\u0397", Theta: "\u0398",
  Iota: "\u0399", Kappa: "\u039A", Lambda: "\u039B", Mu: "\u039C",
  Nu: "\u039D", Xi: "\u039E", Omicron: "\u039F", Pi: "\u03A0",
  Rho: "\u03A1", Sigma: "\u03A3", Tau: "\u03A4", Upsilon: "\u03A5",
  Phi: "\u03A6", Chi: "\u03A7", Psi: "\u03A8", Omega: "\u03A9",
  alpha: "\u03B1", beta: "\u03B2", gamma: "\u03B3", delta: "\u03B4",
  epsilon: "\u03B5", zeta: "\u03B6", eta: "\u03B7", theta: "\u03B8",
  iota: "\u03B9", kappa: "\u03BA", lambda: "\u03BB", mu: "\u03BC",
  nu: "\u03BD", xi: "\u03BE", omicron: "\u03BF", pi: "\u03C0",
  rho: "\u03C1", sigmaf: "\u03C2", sigma: "\u03C3", tau: "\u03C4",
  upsilon: "\u03C5", phi: "\u03C6", chi: "\u03C7", psi: "\u03C8", omega: "\u03C9",
  thetasym: "\u03D1", upsih: "\u03D2", piv: "\u03D6",
  larr: "\u2190", uarr: "\u2191", rarr: "\u2192", darr: "\u2193",
  harr: "\u2194", crarr: "\u21B5",
  lArr: "\u21D0", uArr: "\u21D1", rArr: "\u21D2", dArr: "\u21D3", hArr: "\u21D4",
  forall: "\u2200", part: "\u2202", exist: "\u2203", empty: "\u2205",
  nabla: "\u2207", isin: "\u2208", notin: "\u2209", ni: "\u220B",
  prod: "\u220F", sum: "\u2211", minus: "\u2212", lowast: "\u2217",
  radic: "\u221A", prop: "\u221D", infin: "\u221E", ang: "\u2220",
  and: "\u2227", or: "\u2228", cap: "\u2229", cup: "\u222A",
  int: "\u222B", there4: "\u2234", sim: "\u223C", cong: "\u2245",
  asymp: "\u2248", ne: "\u2260", equiv: "\u2261", le: "\u2264",
  ge: "\u2265", sub: "\u2282", sup: "\u2283", nsub: "\u2284",
  sube: "\u2286", supe: "\u2287",
  oplus: "\u2295", otimes: "\u2297", perp: "\u22A5",
  sdot: "\u22C5",
  lceil: "\u2308", rceil: "\u2309", lfloor: "\u230A", rfloor: "\u230B",
  lang: "\u2329", rang: "\u232A",
  loz: "\u25CA", spades: "\u2660", clubs: "\u2663",
  hearts: "\u2665", diams: "\u2666"
};

var VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr"
]);

function sanitize(raw) {
  var decoded = decodeEntities(raw);
  var stripped = stripDangerousConstructs(decoded);
  var doc = parseHTML(stripped);
  walkAndFilter(doc, ALLOWED_TAGS, BLOCKED_TAGS, ALLOWED_ATTRS, URL_ATTRS, SAFE_PROTOCOLS);
  return serialize(doc);
}

function decodeEntities(html) {
  var result = html;
  result = result.replace(/&#x([0-9A-Fa-f]+);/g, function(_, hex) {
    var cp = parseInt(hex, 16);
    return cp > 0 ? String.fromCodePoint(cp) : "\uFFFD";
  });
  result = result.replace(/&#(\d+);/g, function(_, dec) {
    var cp = parseInt(dec, 10);
    return cp > 0 ? String.fromCodePoint(cp) : "\uFFFD";
  });
  result = result.replace(/&([A-Za-z]+);/g, function(full, name) {
    return NAMED_ENTITIES[name] !== undefined ? NAMED_ENTITIES[name] : full;
  });
  return result;
}

function stripDangerousConstructs(html) {
  var out = html;
  out = out.replace(/<script[\s\S]*?<\/script\s*>/gi, "");
  out = out.replace(/<script[^>]*>/gi, "");
  out = out.replace(/<svg[\s\S]*?<\/svg\s*>/gi, "");
  out = out.replace(/<svg[^>]*>/gi, "");
  out = out.replace(/<math[\s\S]*?<\/math\s*>/gi, "");
  out = out.replace(/<math[^>]*>/gi, "");
  out = out.replace(/<noscript[\s\S]*?<\/noscript\s*>/gi, "");
  out = out.replace(/<noscript[^>]*>/gi, "");
  out = out.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");
  return out;
}

function parseHTML(html) {
  var root = { type: "root", children: [] };
  var stack = [root];
  var tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^>]*?)?)(\/?)>/g;
  var last = 0;
  var m;

  while ((m = tagRe.exec(html)) !== null) {
    if (m.index > last) {
      var text = html.slice(last, m.index);
      if (text) {
        var parent = stack[stack.length - 1];
        (parent.children = parent.children || []).push({ type: "text", content: text });
      }
    }

    var closing = m[1], tag = m[2], attrStr = m[3], selfClose = m[4];
    var tagLower = tag.toLowerCase();

    if (closing) {
      if (RAW_TEXT_ELEMENTS.has(tagLower)) {
        var rawEnd = html.indexOf("</" + tagLower + ">", m.index + m[0].length);
        if (rawEnd !== -1) {
          var innerContent = html.slice(m.index + m[0].length, rawEnd);
          var parent = stack[stack.length - 1];
          var el = {
            type: "element",
            tag: tagLower,
            attrs: parseAttrs(attrStr),
            children: [{ type: "text", content: innerContent }]
          };
          (parent.children = parent.children || []).push(el);
          tagRe.lastIndex = rawEnd + ("</" + tagLower + ">").length;
          last = tagRe.lastIndex;
          continue;
        }
      }
      var i = stack.length - 1;
      while (i > 0 && stack[i].tag !== tagLower) i--;
      if (i > 0) stack.length = i;
    } else {
      var el = {
        type: "element",
        tag: tagLower,
        attrs: parseAttrs(attrStr),
        children: []
      };
      var parent = stack[stack.length - 1];
      (parent.children = parent.children || []).push(el);
      if (!selfClose && !VOID_TAGS.has(tagLower) && !RAW_TEXT_ELEMENTS.has(tagLower)) {
        stack.push(el);
      } else if (RAW_TEXT_ELEMENTS.has(tagLower)) {
        var closingTag = "</" + tagLower + ">";
        var rawEnd = html.indexOf(closingTag, m.index + m[0].length);
        if (rawEnd !== -1) {
          var innerContent = html.slice(m.index + m[0].length, rawEnd);
          el.children = [{ type: "text", content: innerContent }];
          tagRe.lastIndex = rawEnd + closingTag.length;
          last = tagRe.lastIndex;
          continue;
        }
      }
    }

    last = m.index + m[0].length;
  }

  if (last < html.length) {
    var text = html.slice(last);
    if (text) {
      var parent = stack[stack.length - 1];
      (parent.children = parent.children || []).push({ type: "text", content: text });
    }
  }

  return root;
}

function parseAttrs(raw) {
  var attrs = {};
  var re = /([a-zA-Z_][\w:.%-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
  var m;
  while ((m = re.exec(raw)) !== null) {
    var key = m[1].toLowerCase();
    if (key.startsWith("on")) continue;
    attrs[key] = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : ""));
  }
  return attrs;
}

function walkAndFilter(node, allowedTags, blockedTags, allowedAttrs, urlAttrs, safeProtocols) {
  if (node.type !== "element" && node.type !== "root") return;
  if (!node.children) return;

  node.children = node.children.filter(function(child) {
    if (child.type === "text") {
      if (node.type === "element" && node.tag === "style") {
        child.content = sanitizeCSS(child.content || "");
      }
      return true;
    }
    if (child.type !== "element") return false;
    if (!child.tag || blockedTags.has(child.tag)) return false;
    if (!allowedTags.has(child.tag)) return false;

    var filteredAttrs = {};
    if (child.attrs) {
      var keys = Object.keys(child.attrs);
      for (var k = 0; k < keys.length; k++) {
        var attrKey = keys[k];
        var attrVal = child.attrs[attrKey];
        if (!allowedAttrs.has(attrKey)) continue;
        if (attrKey === "style") {
          filteredAttrs[attrKey] = sanitizeCSS(attrVal);
          continue;
        }
        if (urlAttrs.has(attrKey) && !isSafeURL(attrVal, safeProtocols)) continue;
        filteredAttrs[attrKey] = attrVal;
      }
    }
    child.attrs = filteredAttrs;

    walkAndFilter(child, allowedTags, blockedTags, allowedAttrs, urlAttrs, safeProtocols);
    return true;
  });
}

function sanitizeCSS(css) {
  var out = css;
  out = out.replace(/@import\b[^;]*;?/gi, "");
  out = out.replace(/expression\s*\(/gi, "/* removed */(");
  out = out.replace(/behavior\s*:/gi, "/* removed */:");
  out = out.replace(/-moz-binding\s*:/gi, "/* removed */:");
  out = out.replace(/javascript\s*:/gi, "/* removed */:");
  out = out.replace(/vbscript\s*:/gi, "/* removed */:");
  out = out.replace(/url\s*\(\s*(["']?)\s*javascript\s*:/gi, "url($1/* removed */:");
  out = out.replace(/url\s*\(\s*(["']?)\s*vbscript\s*:/gi, "url($1/* removed */:");
  out = out.replace(/url\s*\(\s*(["']?)\s*data\s*:\s*(?!image\/)/gi, "url($1/* removed */:");
  return out;
}

function isSafeURL(url, safeProtocols) {
  var trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith("#") || trimmed.startsWith("data:image/")) return true;
  try {
    var parsed = new URL(url, "https://placeholder");
    return safeProtocols.has(parsed.protocol);
  } catch (e) {
    return false;
  }
}

function serialize(node) {
  if (node.type === "text") return node.content || "";
  if (node.type === "root" || !node.tag) {
    return (node.children || []).map(serialize).join("");
  }

  var attrs = Object.entries(node.attrs || {})
    .map(function(entry) { return " " + entry[0] + "=\"" + escAttr(entry[1]) + "\""; })
    .join("");

  if (VOID_TAGS.has(node.tag)) return "<" + node.tag + attrs + ">";

  var children = (node.children || []).map(serialize).join("");
  return "<" + node.tag + attrs + ">" + children + "</" + node.tag + ">";
}

function escAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function setup(ctx) {
  var tab = ctx.ui.registerDrawerTab({
    id: "html_preview",
    title: "HTML Preview",
    shortName: "Preview",
    description: "Renders HTML and CSS from the creator notes field as a live preview.",
    keywords: ["html", "css", "preview", "creator notes", "render"],
    headerTitle: "HTML Preview",
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
  });

  var root = tab.root;
  root.style.cssText = "display:flex;flex-direction:column;height:100%;";

  var iframeContainer = document.createElement("div");
  iframeContainer.style.cssText = "flex:1;overflow:hidden;";
  root.appendChild(iframeContainer);

  function renderContent(html) {
    var safe = sanitize(html);
    var doc = '<!DOCTYPE html><html style="color-scheme:dark light;"><head><style>html,body{margin:0;padding:0;background:transparent !important;color:inherit;white-space:pre-wrap;word-wrap:break-word;overflow-x:auto;filter:contrast(0.82) brightness(1.08);}*{max-width:100vw !important;box-sizing:border-box !important;max-height:100vh;}img{max-width:100% !important;height:auto !important;}body *{text-shadow:0 0 3px rgba(128,128,128,0.35),0 0 1px rgba(0,0,0,0.45);}</style></head><body>' + safe + '</body></html>';
    iframeContainer.innerHTML = '';
    var iframe = document.createElement("iframe");
    iframe.sandbox.add();
    iframe.style.cssText = "width:100%;height:100%;border:none;background:transparent;";
    iframe.srcdoc = doc;
    iframeContainer.appendChild(iframe);
  }

  function showError(msg) {
    iframeContainer.innerHTML = '<p style="color:#f87171;padding:12px;">' + msg + "</p>";
  }

  function showPlaceholder(msg) {
    iframeContainer.innerHTML = '<p style="opacity:0.5;padding:12px;">' + msg + "</p>";
  }

  function loadCreatorNotes() {
    var activeChat = ctx.getActiveChat();
    var characterId = activeChat.characterId;

    if (!characterId) {
      showPlaceholder("Open a character in the editor to see a live HTML preview of their creator notes.");
      return;
    }

    ctx.characters.get(characterId).then(function(card) {
      var creatorNotes = card.creator_notes ?? "";
      if (!creatorNotes) {
        showPlaceholder("Creator notes are empty.");
      } else {
        renderContent(creatorNotes);
      }
    }).catch(function(err) {
      showError("Failed to read creator notes: " + err);
    });
  }

  loadCreatorNotes();

  var unsubActivate = tab.onActivate(function() { loadCreatorNotes(); });
  var unsubChatSwitched = ctx.events.on("CHAT_SWITCHED", function() { loadCreatorNotes(); });
  var unsubCharEdited = ctx.events.on("CHARACTER_EDITED", function() { loadCreatorNotes(); });

  return function() {
    try { unsubActivate(); } catch (_) {}
    try { unsubChatSwitched(); } catch (_) {}
    try { unsubCharEdited(); } catch (_) {}
    try { tab.destroy(); } catch (_) {}
  };
}
