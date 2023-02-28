import { install, Router } from "../../deps.ts";
import app from "../../app.ts";
import CookieGuard from "../../middleware/cookieGuard.ts";
import testPage from "../../pages/test.tsx";
import Render from "../../utils/render.ts";
import config from "../../utils/twind.config.ts";
import auth from "./auth.ts";

install(config);

const ui = new Router({
  prefix: "/ui",
});

ui.all("/", (ctx) => {
  const html = Render(testPage);

  ctx.response.body = html;
});

ui.use(new auth(app.state.container).routes());

ui.use(CookieGuard(app.state.container));

ui.get("/guard", (ctx) => {
  ctx.response.body = "test";
});

export default ui;
