import { defineConfig } from "../deps.ts";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind@1.1.4";
import presetAutoprefix from "https://esm.sh/@twind/preset-autoprefix@1.0.7";
import presetTailwindForms from "https://esm.sh/@twind/preset-tailwind-forms@1.1.2";

export default defineConfig({
  presets: [presetAutoprefix, presetTailwind(), presetTailwindForms()],
});
