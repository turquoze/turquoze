import { Router } from "../../deps.ts";
import testPage from "../../pages/test.tsx";
import Render from "../../utils/render.ts";

const api = new Router({
  prefix: "/ui",
});

api.all("/", (ctx) => {
  const html = Render(testPage);

  ctx.response.body = html;
});

export default api;
