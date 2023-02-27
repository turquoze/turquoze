import { Helmet, inline, renderSSR } from "../deps.ts";

export default function Render(page: unknown): string {
  const ssr = renderSSR(page);
  const { body, head, footer } = Helmet.SSR(ssr);

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${head.join("\n")}
    </head>
    <body>
      ${body}
      ${footer.join("\n")}
    </body>
  </html>`;

  const response = inline(html);

  return response;
}
