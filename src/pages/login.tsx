/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h, Helmet } from "../deps.ts";

const Login = () => (
  <div>
    <Helmet>
      <title>Login page</title>
      <meta
        name="description"
        content="Login page"
      />
    </Helmet>

    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2">
      <div class="bg-black">01</div>
      <div class="bg-red-500">02</div>
    </div>
  </div>
);

export default Login;
