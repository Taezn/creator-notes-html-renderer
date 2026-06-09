(function() {
  const log = (msg) => console.log("[HTML Renderer] " + msg);

  log("=== Spindle API Diagnostic ===");
  log("typeof spindle: " + typeof spindle);
  log("typeof window?.spindle: " + typeof window?.spindle);
  log("typeof self?.spindle: " + typeof self?.spindle);
  log("typeof globalThis?.spindle: " + typeof globalThis?.spindle);

  if (typeof window !== "undefined") {
    const keys = Object.keys(window).filter(k => k.toLowerCase().includes("spindle"));
    log("window keys containing 'spindle': " + JSON.stringify(keys));
  }

  if (typeof globalThis !== "undefined") {
    const keys = Object.keys(globalThis).filter(k => k.toLowerCase().includes("spindle"));
    log("globalThis keys containing 'spindle': " + JSON.stringify(keys));
  }

  log("=== End Diagnostic ===");
})();
