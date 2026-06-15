import slugify from "slugify";

const slugifyOptions = {
  lower: true,
  strict: true,
  trim: true,
} as const;

export function slugifySegment(name: string): string {
  const slug = slugify(name, slugifyOptions);
  return slug || "untitled";
}

export function slugifyFilename(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0) {
    return slugifySegment(filename);
  }

  const base = filename.slice(0, lastDot);
  const ext = filename.slice(lastDot).toLowerCase();
  return `${slugifySegment(base)}${ext}`;
}

export function resolveUniqueSlugPath(
  desiredRelativePath: string,
  usedPaths: Set<string>,
): string {
  if (!usedPaths.has(desiredRelativePath)) {
    usedPaths.add(desiredRelativePath);
    return desiredRelativePath;
  }

  const lastSlash = desiredRelativePath.lastIndexOf("/");
  const dir =
    lastSlash >= 0 ? desiredRelativePath.slice(0, lastSlash + 1) : "";
  const filename =
    lastSlash >= 0
      ? desiredRelativePath.slice(lastSlash + 1)
      : desiredRelativePath;

  const lastDot = filename.lastIndexOf(".");
  const base = lastDot >= 0 ? filename.slice(0, lastDot) : filename;
  const ext = lastDot >= 0 ? filename.slice(lastDot) : "";

  let counter = 2;
  while (true) {
    const candidate = `${dir}${base}-${counter}${ext}`;
    if (!usedPaths.has(candidate)) {
      usedPaths.add(candidate);
      return candidate;
    }
    counter += 1;
  }
}
