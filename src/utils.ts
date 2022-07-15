export type Cookie = Record<string, string>;

export const parseCookie = (raw: string | null | undefined): Cookie => {
  if (!raw) {
    return {};
  }
  return {};
};
