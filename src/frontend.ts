import { sanitize } from "./sanitizer";

export function setup(ctx) {
  const tab = ctx.ui.registerDrawerTab({
    id: "html_preview",
    title: "HTML Preview",
    shortName: "Preview",
    description: "Renders HTML and CSS from the creator notes field as a live preview.",
    keywords: ["html", "css", "preview", "creator notes", "render"],
    headerTitle: "HTML Preview",
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
  });

  const root = tab.root;
  root.style.cssText = "display:flex;flex-direction:column;height:100%;";

  const iframeContainer = document.createElement("div");
  iframeContainer.style.cssText = "flex:1;overflow:hidden;";
  root.appendChild(iframeContainer);

  function renderContent(html) {
    const safe = sanitize(html);
    const doc = `<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;background:transparent;color:inherit;}</style></head><body>${safe}</body></html>`;
    iframeContainer.innerHTML = '';
    const iframe = document.createElement("iframe");
    iframe.sandbox.add();
    iframe.style.cssText = "width:100%;height:100%;border:none;background:transparent;";
    iframe.srcdoc = doc;
    iframeContainer.appendChild(iframe);
  }

  function showError(msg) {
    iframeContainer.innerHTML = `<p style="color:#f87171;padding:12px;">${msg}</p>`;
  }

  function showPlaceholder(msg) {
    iframeContainer.innerHTML = `<p style="opacity:0.5;padding:12px;">${msg}</p>`;
  }

  async function loadCreatorNotes() {
    const { characterId } = ctx.getActiveChat();
    if (!characterId) {
      showPlaceholder("Open a character in the editor to see a live HTML preview of their creator notes.");
      return;
    }

    try {
      const card = await ctx.characters.get(characterId);
      const creatorNotes = card.creator_notes ?? "";
      if (!creatorNotes) {
        showPlaceholder("Creator notes are empty.");
      } else {
        renderContent(creatorNotes);
      }
    } catch (err) {
      showError(`Failed to read creator notes: ${err}`);
    }
  }

  loadCreatorNotes();

  const unsubActivate = tab.onActivate(() => loadCreatorNotes());
  const unsubChatSwitched = ctx.events.on("CHAT_SWITCHED", () => loadCreatorNotes());
  const unsubCharEdited = ctx.events.on("CHARACTER_EDITED", () => loadCreatorNotes());

  return () => {
    try { unsubActivate(); } catch (_) {}
    try { unsubChatSwitched(); } catch (_) {}
    try { unsubCharEdited(); } catch (_) {}
    try { tab.destroy(); } catch (_) {}
  };
}
