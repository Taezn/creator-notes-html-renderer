import { sanitize } from "./sanitizer";

export function setup(ctx) {
  const widget = ctx.ui.createFloatWidget({
    width: 480,
    height: 400,
    snapToEdge: true,
    tooltip: "HTML Preview — Creator Notes"
  });

  const container = widget.root;

  function showContent(html) {
    if (container) {
      container.innerHTML = renderPreview(html);
    }
  }

  async function loadCreatorNotes(characterId) {
    try {
      const card = await ctx.characters.get(characterId);
      const creatorNotes = card.creator_notes ?? "";
      showContent(creatorNotes || "<p style='opacity:0.5'>Creator notes are empty.</p>");
    } catch (err) {
      showContent(`<p style="color:#f87171">Failed to read creator notes: ${err}</p>`);
    }
  }

  const { characterId } = ctx.getActiveChat();
  if (characterId) {
    loadCreatorNotes(characterId);
  } else {
    showContent("<p style='opacity:0.5'>Open a character in the editor to see a live HTML preview of their creator notes.</p>");
  }

  return () => {
    try { widget.destroy(); } catch (_) {}
  };
}

function renderPreview(raw) {
  const safe = sanitize(raw);

  return `
    <div style="
      display: flex;
      flex-direction: column;
      height: 100%;
      font-family: var(--font-sans, sans-serif);
      color: var(--color-text, #e4e4e7);
      background: var(--color-surface, #18181b);
      border-radius: 8px;
      overflow: hidden;
    ">
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-bottom: 1px solid var(--color-border, #27272a);
        font-size: 12px;
        opacity: 0.6;
      ">
        <span style="font-weight:600;">HTML Preview</span>
        <span style="flex:1;"></span>
        <span>Creator Notes</span>
      </div>
      <iframe
        sandbox=""
        style="
          flex: 1;
          border: none;
          width: 100%;
          background: var(--color-surface, #18181b);
        "
        srcdoc="${escapeAttr(safe)}"
      ></iframe>
    </div>
  `;
}

function escapeAttr(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
