/**
 * Creates new EntityMessage to convert the text and entities into html or other formats.
 * @class
 */
class EntityMessage {
  /**
   * Create a EntityMessage.
   * @param {string} text - Text to be converted
   * @param {Object[]} entities - Array of [entity objects](https://core.telegram.org/bots/api#messageentity) in the text
   */
  constructor(text, entities) {
    // validate params
    if (!text || typeof text !== "string" || !entities || !entities.length) {
      throw new Error(
        `Expected string in field text - got ${typeof text}, array/object in field entities - got ${typeof entities}`
      );
    }
    this.text = text;
    this.entities = entities;
  }

  /**
   * Get the HTML format.
   * @return {string} HTML formatted text
   */
  get html() {
    let content = this.text;
    let totalOffset = 0;
    for (let entity of this.entities) {
      let replacement = formatEntity(this.text, entity, "html");
      content = spliceString(
        content,
        totalOffset + entity.offset,
        entity.length,
        replacement
      );
      totalOffset += replacement.length - entity.length;
    }
    return content;
  }

  /**
   * Get the Markdown format.
   * @return {string} Markdown formatted text
   */
  get markdown() {
    let content = this.text;
    let totalOffset = 0;
    for (let entity of this.entities) {
      let replacement = formatEntity(this.text, entity, "markdown");
      content = spliceString(
        content,
        entity.offset,
        entity.length,
        replacement
      );
      totalOffset += replacement.length - entity.length;
    }
    return content;
  }
}

// Helper functions
function formatEntity(text, entity, format) {
  let entityText = text.substring(entity.offset, entity.offset + entity.length);
  let options = {};
  switch (entity.type) {
    case "text_link":
      options.url = entity.url;
      break;
    case "text_mention":
      options.user = entity.user;
      break;
    case "pre":
      options.language = entity.language;
      break;
    case "custom_emoji":
      options.custom_emoji_id = entity.custom_emoji_id;
      break;
  }
  return entityTypes[entity.type][format](entityText, options);
}

const entityTypes = {
  mention: { html: (text) => text, markdown: (text) => text },

  hashtag: { html: (text) => text, markdown: (text) => text },

  cashtag: { html: (text) => text, markdown: (text) => text },

  bot_command: { html: (text) => text, markdown: (text) => text },

  url: { html: (text) => text, markdown: (text) => text },

  email: { html: (text) => text, markdown: (text) => text },

  phone_number: { html: (text) => text, markdown: (text) => text },

  bold: { html: (text) => `<b>${text}</b>`, markdown: (text) => `**${text}**` },

  italic: { html: (text) => `<i>${text}</i>`, markdown: (text) => `*${text}*` },

  underline: { html: (text) => `<u>${text}</u>`, markdown: (text) => text },

  strikethrough: {
    html: (text) => `<strike>${text}</strike>`,
    markdown: (text) => text,
  },

  spoiler: { html: (text) => text, markdown: (text) => text },

  code: {
    html: (text) => `<code>${text}</code>`,
    markdown: (text) => `\`${text}\``,
  },

  pre: {
    html: (text, { language }) => `<pre>${text}</pre>`,
    markdown: (text, { language }) => `\`\`\`${text}\`\`\``,
  },

  text_link: {
    html: (text, { url }) => `<a href="${url}">${text}</a>`,
    markdown: (text, { url }) => `[${text}](${url})`,
  },

  text_mention: {
    html: (text, { user }) => text,
    markdown: (text, { user }) => text,
  },

  custom_emoji: {
    html: (text, { custom_emoji_id }) => "",
    markdown: (text, { custom_emoji_id }) => "",
  },
};

// Utility function
function spliceString(str, index, count, add) {
  // We cannot pass negative indexes directly to the 2nd slicing operation.
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + (add || "") + str.slice(index + count);
}

module.exports = { EntityMessage };
