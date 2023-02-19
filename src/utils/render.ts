import {
  getStyleTag,
  Helmet,
  renderSSR,
  setup,
  virtualSheet,
} from "../deps.ts";

const sheet = virtualSheet();

setup({
  sheet,
});

export default function Render(page: unknown): string {
  const ssr = renderSSR(page);
  const { body, head, footer } = Helmet.SSR(ssr);

  sheet.reset();
  const styleTag = getStyleTag(sheet);

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${head.join("\n")}
      ${styleTag}
    </head>
    <body>
      ${body}
      ${footer.join("\n")}
    </body>
  </html>`;

  return html;
}
