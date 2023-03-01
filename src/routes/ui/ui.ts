import { install, Router } from "../../deps.ts";
import app from "../../app.ts";
import notFoundPage from "../../pages/404.tsx";
import Render from "../../utils/render.ts";
import config from "../../utils/twind.config.ts";
import auth from "./auth.ts";
import dashboard from "./dashboard.ts";

install(config);

const ui = new Router({
  prefix: "/ui",
});

ui.use(new auth(app.state.container).routes());
ui.use(new dashboard(app.state.container).routes());

ui.all("/:notfound?", (ctx) => {
  const html = Render(notFoundPage);

  ctx.response.status = 404;
  ctx.response.body = html;
});

export default ui;
