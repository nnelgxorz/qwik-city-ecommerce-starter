import { EndpointHandler } from "@builder.io/qwik-city";
import { MenuItem } from "../../types";

export const onGet: EndpointHandler<MenuItem[]> = async () => {
  return {
    status: 200,
    body: RESTARAUNT_MENU
  };
}

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