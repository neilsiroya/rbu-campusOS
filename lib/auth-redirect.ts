const defaultReturnPath = "/dashboard";

/** Accept only local destinations, and keep auth pages out of the return flow. */
export function getSafeReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(value)) {
    return defaultReturnPath;
  }

  try {
    const base = "https://campus.invalid";
    const url = new URL(value, base);
    const pathname = decodeURIComponent(url.pathname);
    if (
      url.origin !== base ||
      pathname.startsWith("//") ||
      /[\\\u0000-\u001f\u007f]/.test(pathname) ||
      pathname === "/auth" ||
      pathname.startsWith("/auth/")
    ) {
      return defaultReturnPath;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return defaultReturnPath;
  }
}
