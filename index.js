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
    return applyEntity(this.text, this.entities, "html");
  }

  /**
   * Get the Markdown format.
   * @return {string} Markdown formatted text
   */
  get markdown() {
    return applyEntity(this.text, this.entities, "markdown");
  }
}

// Helper functions
function applyEntity(mainText = "", entities, markupType = "html") {
  if (markupType !== "html" || markupType !== "markdown") return mainText;
  if (!entities.length) return mainText;
  if (!mainText.length) return mainText;

  let content = mainText;
  const addedTags = [];
  for (let entity of entities) {
    const {
      type,
      offset,
      length,
      url,
      user,
      language,
      custom_emoji_id
    } = entity;
    const text = mainText.slice(offset, offset + length);
    const [opening, closing] = (entityTypes(text, {
      url,
      userId: user?.id,
      custom_emoji_id,
      language
    })[type][markupType] || ["", ""]);

    if (opening !== "" || closing !== "") {
      const {start: beforeStart, end: beforeEnd} = addedTags.reduce((t, {startAt, tag}) => {
        let {start, end} = t;
        if (startAt <= offset) {
          start += tag.length;
        }
        if (startAt < (offset + length)) {
          end += tag.length
        }
        return {start, end};
      }, {
        start: 0, end: 0
      })

      const start = offset + beforeStart;
      const end = offset + length + beforeEnd;
      addedTags.push({startAt: offset, tag: opening});
      addedTags.push({startAt: offset + length, tag: closing});
      content = content.slice(0, start) + opening + content.slice(start, end) + closing + content.slice(end);
    }
  }
  return content;
}

const entityTypes = (text, {url, userId, custom_emoji_id}) => {

  /**
   * [markUpType]: {
   *   [markUpName]: [openingTag, closingTag],
   * },
   * */

  return {
    mention: {
      html: [`<a href="https://t.me/${text.slice(1)}">`, `</a>`],
      markdown: [`[`, `](https://t.me/${text.slice(1)})`],
    },
    hashtag: {
      html: [``, ``],
      markdown: [``, ``],
    },
    cashtag: {
      html: [``, ``],
      markdown: [``, ``],
    },
    bot_command: {
      html: [``, ``],
      markdown: [``, ``],
    },
    url: {
      html: [`<a href="${text}">`, `</a>`],
      markdown: [`[`, `](${text})`],
    },
    email: {
      html: [`<a href="mailto:${text}">`, `</a>`],
      markdown: [`[`, `](mailto:${text})`],
    },
    phone_number: {
      html: [`<a href="tel:${text}">`, `</a>`],
      markdown: [`[`, `](tel:${text})`],
    },
    bold: {
      html: [`<b>`, `</b>`],
      markdown: [`**`, `**`],
    },
    italic: {
      html: [`<i>`, `</i>`],
      markdown: [`*`, `*`],
    },
    underline: {
      html: [`<u>`, `</u>`],
      markdown: [``, ``],
    },
    strikethrough: {
      html: [`<s>`, `</s>`],
      markdown: [``, ``],
    },
    spoiler: {
      html: [`<span class="tg-spoiler">`, `</span>`],
      markdown: [``, ``],
    },
    code: {
      html: [`<code>`, `</code>`],
      markdown: [``, ``],
    },
    pre: {
      html: [`<pre>`, `</pre>`],
      markdown: [`\`\`\``, `\`\`\``],
    },
    text_link: {
      html: [`<a href="${url}">`, `</a>`],
      markdown: [`[`, `](${url})`],
    },
    text_mention: {
      html: [`<a href="tg://user?id=${userId}">`, `</a>`],
      markdown: [`[`, `](tg://user?id=${userId})`],
    },
    custom_emoji: {
      html: [``, ``],
      markdown: [``, ``],
    },
  }
}

module.exports = {EntityMessage};
