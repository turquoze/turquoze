/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { Component, h, Helmet } from "../deps.ts";

export default class ShopSelector extends Component {
  constructor(props: { shops: Array<{ id: string; title: string }> }) {
    super(props);
  }

  render(): void | HTMLElement {
    return (
      <div>
        <Helmet>
          <title>Login page</title>
          <meta
            name="description"
            content="shop selector page"
          />
        </Helmet>

        <section>
          <header class="bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
            <div class="flex items-center justify-between">
              <h2 class="font-semibold text-slate-900">Shops</h2>
              <a
                href="/new"
                class="hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="mr-2"
                  aria-hidden="true"
                >
                  <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                </svg>
                New
              </a>
              <form
                class="group relative"
                action="/ui/auth/logout"
                method="POST"
              >
                <button>Logout</button>
              </form>
            </div>
            <form class="group relative">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                class="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                />
              </svg>
              <input
                class="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                type="text"
                aria-label="Filter shops"
                placeholder="Filter shops..."
              />
            </form>
          </header>
          <ul class="bg-slate-50 p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm leading-6">
            {this.props.shops.map((shop: { id: string; title: string }) => {
              return (
                <a
                  href={"/ui/dashboard/" + shop.id}
                  class="group cursor-pointer rounded-md p-3 bg-white ring-1 ring-slate-200 shadow-sm hover:bg-blue-500 hover:ring-blue-500 hover:shadow-md dark:bg-slate-700 dark:ring-0 dark:highlight-white/10 dark:hover:bg-blue-500"
                >
                  <li class="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
                    <div>
                      <dt class="sr-only">Title</dt>
                      <dd class="font-semibold text-slate-900 group-hover:text-white dark:text-slate-100">
                        {shop.title}
                      </dd>
                    </div>
                  </li>
                </a>
              );
            })}
            <li class="flex">
              <a
                href="/new"
                class="hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3"
              >
                <svg
                  class="group-hover:text-blue-500 mb-1 text-slate-400"
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                </svg>
                New shop
              </a>
            </li>
          </ul>
        </section>
      </div>
    );
  }
}
