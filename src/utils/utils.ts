import Container from "../services/mod.ts";

export function jsonResponse(data: string, status: number): Response {
  return new Response(data, {
    headers: {
      "content-type": "application/json",
    },
    status: status,
  });
}

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
        container.CacheService.get<T>(container.Shop.publicId!, params.id),
        params.promise,
      ]);
    } catch (_error) {
      data = await params.promise;
    }

    container.CacheService.set({
      key: params.id,
      data: data,
      expire: (60 * 10),
      shop: container.Shop.publicId!,
    }).then().catch((error) => {
      console.error(error);
      console.error(`CacheService set error: ${JSON.stringify(error)}`);
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

    container.CacheService.set({
      key: params.id,
      data: data,
      expire: (60 * 10),
      shop: container.Shop.publicId!,
    }).then().catch((error) => {
      console.error(`CacheService set error: ${JSON.stringify(error)}`);
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

    container.CacheService.delete(container.Shop.publicId!, params.id).then()
      .catch((error) => {
        console.error(`CacheService delete error: ${JSON.stringify(error)}`);
      });
  } catch (error) {
    throw new Error("Could not get any data", {
      cause: error,
    });
  }
}
