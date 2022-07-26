import { Category, MenuItem, RestaurantLocation } from "./types";

// MIDDLEWARE

export const RESTAURANT_LOCATION_COOKIE = 'qwik-city-location';

export const getUserLocation = async (url: string, headers: Headers): Promise<RestaurantLocation | undefined> => {
  const origin = new URL(url).origin;
  const restaurant_id = getCookieValue(headers, RESTAURANT_LOCATION_COOKIE);
  const order_location = await getAllLocations(origin).then(locations => locations.find(({ id }) => id === restaurant_id));
  return order_location
}

export const getRestaurantMenu = async (origin: string): Promise<MenuItem[]> => {
  return await fetch(new URL('api/restaurant-menu', origin).href)
    .then(response => (response.json() as unknown) as MenuItem[]);
}

export const getAllLocations = async (origin: string): Promise<RestaurantLocation[]> => {
  return await fetch(new URL('api/restaurant-locations', origin).href)
    .then(response => (response.json() as unknown) as RestaurantLocation[]);
}

export const getCategoriesList = (menu_items: MenuItem[]) => {
  const categories = menu_items.reduce((prev: Category[], { categories }) => {
    return [...prev, ...categories];
  }, [])
  return [...new Set(categories)]
};

// COOKIES
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

export const getCookie = (headers: Headers) => {
  return parseCookie(headers.get("cookie"))
}

export const getCookieValue = (headers: Headers, key: string): string | null | undefined => {
  const cookie = getCookie(headers)
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