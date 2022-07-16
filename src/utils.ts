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

export interface CookieLifetime {
  date?: Date
  seconds?: number
}
export interface CookieMaxAge extends CookieLifetime {
  seconds: number
}
export interface CookieExpiration extends CookieLifetime {
  date: Date
}

interface CookieOpts {
  expires?: CookieExpiration | CookieMaxAge
  domain?: URL | string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: "Strict" | "Lax" | "Secure"
}

const stringifyCookieOpts = (opts: CookieOpts) => {
  let attributes: string[] = []
  if (opts.expires && opts.expires.date) {
    attributes.push(`Expires=${opts.expires.date.toUTCString()}`)
  }
  if (opts.expires && opts.expires.seconds) {
    attributes.push(`Max-Age=${opts.expires}`)
  }
  if (opts.domain) {
    attributes.push(`Domain=${typeof opts.domain === 'string' ? opts.domain : opts.domain.href}`)
  }
  if (opts.secure) {
    attributes.push(`Secure`)
  }
  if (opts.httpOnly) {
    attributes.push("HttpOnly")
  }
  if (opts.sameSite) {
    attributes.push(`SameSite=${opts.sameSite}`)
  }

  return attributes
}

export const setCookie = (key: string, value: string, opts: CookieOpts = {}): { 'Set-Cookie': string } => {
  const attributes = stringifyCookieOpts(opts);
  return { 'Set-Cookie': [`${key}=${value}`, ...attributes].join("; ") }
}