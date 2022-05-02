import container from "../services/mod.ts";
import { stringifyJSON } from "../utils/utils.ts";

export async function Get<T>(params: {
  id: string;
  promise: Promise<T>;
}): Promise<T> {
  try {
    const data = await Promise.any([
      container.CacheService.get<T>(params.id),
      params.promise,
    ]);

    container.CacheService.set({
      id: params.id,
      data: stringifyJSON(data),
      expire: (60 * 10),
    }).catch();

    return data;
  } catch (_error) {
    throw new Error("Could not get any data");
  }
}

export async function Update<T>(params: {
  id: string;
  promise: Promise<T>;
}): Promise<T> {
  try {
    const data = await params.promise;

    container.CacheService.set({
      id: params.id,
      data: stringifyJSON(data),
      expire: (60 * 10),
    }).catch();

    return data;
  } catch (_error) {
    throw new Error("Could not get any data");
  }
}

export async function Delete(params: {
  id: string;
  promise: Promise<void>;
}): Promise<void> {
  try {
    await params.promise;

    container.CacheService.delete(params.id).catch();
  } catch (_error) {
    throw new Error("Could not get any data");
  }
}
