import { EndpointHandler } from "@builder.io/qwik-city";
import type { MenuItem } from "../../types";
import { artificial_delay } from "../../utils";

export const onGet: EndpointHandler<MenuItem[]> = async ({ request }) => {
  await artificial_delay();
  const item_id = new URL(request.url).searchParams.get('item');
  if (item_id) {
    return RESTARAUNT_MENU.filter(({ id }) => id === item_id);
  }
  return RESTARAUNT_MENU;
};

export const RESTARAUNT_MENU: MenuItem[] = [
  {
    id: "1",
    name: "Steve Stew-ell",
    categories: ["Soups"],
  },
  {
    id: "2",
    name: "Bradley Beef Barley",
    categories: ["Soups"],
  },
  {
    id: "3",
    name: "Misko Meatball Marinara",
    categories: ["Subs"],
  },
  {
    id: "4",
    name: "Manu-roni & Cheese",
    categories: ["Sides"],
  },
];
