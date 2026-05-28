export async function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}) {
  if (!path) return "/";

  const lower = path.toLowerCase();

  if (
    lower.includes("dataurl") ||
    lower.includes("sewfoliosharekey") ||
    lower.includes("share")
  ) {
    return "/share-import";
  }

  return path;
}
