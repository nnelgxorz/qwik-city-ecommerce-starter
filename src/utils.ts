export type Cookie = Record<string, string>;

export const parseCookie = (raw: string | null | undefined): Cookie => {
  if (!raw) {
    return {};
  }
  return raw
    .split(';')
    .map(v => v.split('='))
    .reduce((acc: Cookie, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
};

export const getCookie = (request: Request) => {
  return parseCookie(request.headers.get("cookie"))
}

export const getCookieValue = (request: Request, key: string): string | null | undefined => {
  const cookie = getCookie(request)
  return cookie[key]
}

interface CookieOpts {
  key: string
  value: string
  expires?: Date | number
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: "Strict" | "Lax" | "Secure"
}

const stringifyCookieOpts = (opts: CookieOpts) => {
  let attributes: string[] = []
  if (opts.expires) {
    attributes.push(
      typeof opts.expires === 'number'
        ? `Max-Age=${opts.expires}`
        : `Expires=${opts.expires.toUTCString()}`
    )
  }
  if (opts.domain) {
    attributes.push(`Domain=${opts.domain}`)
  }
  if (opts.secure) {
    attributes.push(`Secure`)
  }
  if (opts.httpOnly) {
    attributes.push("HttpOnly")
  }
  return attributes
}

export const setCookie = (opts: CookieOpts) => {
  const attributes = stringifyCookieOpts(opts);
  return { 'Set-Cookie': [`${opts.key}=${opts.value}`, ...attributes].join("; ") }
}