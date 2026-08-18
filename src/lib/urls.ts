const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!basePath) return normalizedPath;
  if (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`)) {
    return normalizedPath;
  }

  return normalizedPath === "/" ? `${basePath}/` : `${basePath}${normalizedPath}`;
}
