import { MeiliSearch } from "../deps.ts";
import { MEILIAPIKEY, MEILIHOST } from "../utils/secrets.ts";

const client = new MeiliSearch({ host: MEILIHOST!, apiKey: MEILIAPIKEY });

export default client;
