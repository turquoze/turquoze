import Container from "../services/mod.ts";

/**
 * Returns a string.
 * @param {Record<string, unknown} data
 * @returns {String} Returns a string.
 */
export function stringifyJSON(
  // deno-lint-ignore no-explicit-any
  data: any,
): string {
  return JSON.stringify(
    data,
    (_, v) => typeof v === "bigint" ? v.toString() : v,
    2,
  );
}

export async function Get<T>(
  container: Container,
  params: {
    id: string;
    promise: Promise<T>;
  },
): Promise<T> {
  try {
    let data;
    try {
      data = await Promise.any([
        container.CacheService.get<T>(params.id),
        params.promise,
      ]);
    } catch (_error) {
      data = await params.promise;
    }

    await container.CacheService.set({
      id: params.id,
      data: stringifyJSON(data),
      expire: (60 * 10),
    });

    return data;
  } catch (error) {
    throw new Error("Could not get any data", {
      cause: error,
    });
  }
}

export async function Update<T>(
  container: Container,
  params: {
    id: string;
    promise: Promise<T>;
  },
): Promise<T> {
  try {
    const data = await params.promise;

    await container.CacheService.set({
      id: params.id,
      data: stringifyJSON(data),
      expire: (60 * 10),
    });

    return data;
  } catch (_error) {
    throw new Error("Could not get any data");
  }
}

export async function Delete(container: Container, params: {
  id: string;
  promise: Promise<void>;
}): Promise<void> {
  try {
    await params.promise;

    await container.CacheService.delete(params.id);
  } catch (error) {
    throw new Error("Could not get any data", {
      cause: error,
    });
  }
}
