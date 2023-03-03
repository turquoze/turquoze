/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h, Helmet } from "../deps.ts";
import ShopSelector from "./shopselector.tsx";

const App = () => (
  <div>
    <Helmet>
      <title>Test page</title>
      <meta
        name="description"
        content="Test page"
      />
    </Helmet>

    <h1 class="text(3xl blue-500)">Hello from Deno</h1>

    <ShopSelector shops={[{ id: "test", title: "shop test" }]} />
  </div>
);

export default App;
