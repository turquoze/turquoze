/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h, Helmet } from "../deps.ts";
import ShopSelector from "./shopselector.tsx";

const App = (shops: Array<{ id: string; title: string }>) => (
  <div>
    <Helmet>
      <title>Test page</title>
      <meta
        name="description"
        content="Test page"
      />
    </Helmet>

    <ShopSelector shops={shops} />
  </div>
);

export default App;
