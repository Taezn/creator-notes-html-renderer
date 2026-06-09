spindle.onFrontendMessage(async (msg, userId) => {
  if (msg.type !== "fetch_creator_notes") return;

  try {
    var characterId = msg.character_id;
    var card = await spindle.characters.get(characterId, userId);
    spindle.sendToFrontend({
      type: "creator_notes_response",
      character_id: characterId,
      creator_notes: card.creator_notes ?? ""
    }, userId);
  } catch (err) {
    spindle.sendToFrontend({
      type: "creator_notes_response",
      character_id: msg.character_id,
      creator_notes: "",
      error: String(err)
    }, userId);
  }
});
