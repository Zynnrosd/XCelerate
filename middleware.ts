// This file is temporarily disabled to prevent redirection loops
// We'll handle authentication checks directly in the components

export function middleware() {
  // Do nothing - middleware is disabled
  return
}

export const config = {
  matcher: [], // Empty matcher means this middleware won't run
}
