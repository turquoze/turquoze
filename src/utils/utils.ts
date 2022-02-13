/**
 * Returns a string.
 * @param {Record<string, unknown} data
 * @returns {String} Returns a string.
 */
export function stringifyJSON(
  data: Record<string, unknown>,
): string {
  return JSON.stringify(
    data,
    (_, v) => typeof v === "bigint" ? v.toString() : v,
    2,
  );
}
