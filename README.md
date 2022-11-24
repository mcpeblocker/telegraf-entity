# telegraf-entity

A library that converts telegram message entities into html and markdown formats. (Intented to use alongside with TelegrafJS)

## Getting started

### Prerequisites

This library is intented to use alongside with telegraf.
But you still can test it with other frameworks or your own codebase - all you need are text and array of [entity objects](https://core.telegram.org/bots/api#messageentity) in that text.

To use the example below you can have telegraf installed in your project.

```shellscript
$ npm install telegraf
```

or

```shellscript
$ yarn add telegraf
```

See [offical guide](https://github.com/telegraf/telegraf/#readme) for more info.
Once you have installed telegraf in your project, you can use telegraf-pagination.

### Installing

Run one of these commands depending on what package manager you're using:

```shellscript
$ npm install telegraf-entity
```

or

```shellscript
$ yarn add telegraf-entity
```

### Quick start

Here is an example:

```js
const { EntityMessage } = require("telegraf-entity");

bot.on("message", (ctx) => {
  if (!ctx.message.text || !ctx.message.entities) return;
  const formatter = new EntityMessage(ctx.message.text, ctx.message.entities);
  let htmlContent = formatter.html;
  let markdownContent = formatter.markdown;
  console.log("HTML: ", htlmContent);
  console.log("Markdown: ", markdownContent);
});
```

### TODO features:

- [ ] Default formatters:
  - [ ] mention
  - [ ] hashtag
  - [ ] cashtag
  - [ ] bot_command
  - [ ] url
  - [ ] email
  - [ ] phone_number
  - [x] bold
  - [x] italic
  - [x] underline
  - [x] strikethrough
  - [ ] spoiler
  - [x] code
  - [x] pre
  - [x] text_link
  - [ ] text_mention
  - [ ] custom_emoji
- [ ] Options for custom formatters for specific entities like spoiler, custom_emoji... (maybe for all)

## Contributing

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on our code of conduct. Feel free to submit any pull request.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/mcpeblocker/telegraf-entity/tags).

## Authors

- **Alisher Ortiqov** - _Initial work_ - [mcpebloker](https://github.com/mcpeblocker)

See also the list of [contributors](https://github.com/mcpeblocker/telegraf-entity/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
