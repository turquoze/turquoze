import { Router } from "../../deps.ts";
import ping from "./ping.ts";
import app from "../../app.ts";

const utils = new Router({
  prefix: "/utils",
});

utils.use(new ping(app.state.container).routes());

export default utils;
