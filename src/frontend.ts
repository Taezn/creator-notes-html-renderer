import { registerFloatWidget, rpc } from "@lumiverse/spindle";
import { sanitize } from "./sanitizer";

registerFloatWidget("html_preview", {
  label: "HTML Preview",
  icon: "code",
  width: 480,
  height: 400,
  resizable: true,
  snap: "right",
  render: async (ctx) => {
    const charId = ctx.activeCharacterId;
    if (!charId) {
      return renderPreview("<p style='opacity:0.5'>Open a character in the editor to see a live HTML preview of their creator notes.</p>");
    }

    try {
      const { creator_notes } = await rpc("read_creator_notes", { character_id: charId });
      return renderPreview(creator_notes);
    } catch (err) {
      return renderPreview(`<p style="color:#f87171">Failed to read creator notes: ${err}</p>`);
    }
  },

  onUpdate: async (ctx) => {
    const charId = ctx.activeCharacterId;
    if (!charId) return;

    try {
      const { creator_notes } = await rpc("read_creator_notes", { character_id: charId });
      ctx.update(renderPreview(creator_notes));
    } catch {}
  },
});

function renderPreview(raw: string): string {
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

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
