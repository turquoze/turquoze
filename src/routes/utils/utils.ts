import { Hono } from "hono";
import ping from "./ping.ts";
import Container from "../../services/mod.ts";

function utils(container: Container) {
  const _utils = new Hono({ strict: false });

  _utils.route("/ping", new ping(container).routes());

  return _utils;
}

export default utils;
