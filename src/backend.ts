import { rpc } from "@lumiverse/spindle";

rpc.handle("read_creator_notes", async ({ character_id }) => {
  const card = await rpc("characters.read", { character_id });
  return { creator_notes: card.creator_notes ?? "" };
});
