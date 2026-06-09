import { registerFloatWidget, rpc } from "@lumiverse/spindle";
import { HtmlPreviewWidget } from "./widget";

registerFloatWidget("html-preview", {
  label: "HTML Preview",
  render: async (ctx) => {
    const charId = ctx.activeCharacterId;
    if (!charId) {
      return HtmlPreviewWidget({ html: "<p style='opacity:0.5'>Open a character in the editor to see a live HTML preview of their creator notes.</p>" });
    }

    try {
      const card = await rpc("characters.read", { character_id: charId });
      const raw = card.creator_notes ?? "";
      return HtmlPreviewWidget({ html: raw });
    } catch (err) {
      return HtmlPreviewWidget({ html: `<p style="color:#f87171">Failed to read creator notes: ${err}</p>` });
    }
  },

  onUpdate: async (ctx) => {
    const charId = ctx.activeCharacterId;
    if (!charId) return;

    try {
      const card = await rpc("characters.read", { character_id: charId });
      const raw = card.creator_notes ?? "";
      ctx.update(HtmlPreviewWidget({ html: raw }));
    } catch {}
  },
});
