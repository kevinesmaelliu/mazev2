interface UrlTransformOptions {
  useProxy?: boolean
  proxyEndpoint?: string
}

export function transformUrlForIframe(
  url: string,
  options: UrlTransformOptions = {}
): string {
  const { useProxy = false, proxyEndpoint = '/api/proxy' } = options

  // Phase 1: Pass-through (direct iframe load)
  if (!useProxy) {
    return url
  }

  // Phase 2: Proxy transformation (route through API endpoint)
  return `${proxyEndpoint}?url=${encodeURIComponent(url)}`
}

export function validateUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url)

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Only HTTP/HTTPS URLs are supported' }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}
