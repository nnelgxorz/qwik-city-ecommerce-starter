export type Category
  = "Soups"
  | "Subs"
  | "Sides"

export interface FullMenu {
  categories: Category[],
  items: MenuItem[]
}

export interface MenuItem {
  id: string
  name: string
  categories: Category[]
}

export const MENU: MenuItem[] = [
  {
    id: "1",
    name: "Steve Stew-ell",
    categories: ["Soups"]
  },
  {
    id: "2",
    name: "Bradley Beef Barley",
    categories: ["Soups"]
  },
  {
    id: "3",
    name: "Misko Meatball Marinara",
    categories: ["Subs"]
  },
  {
    id: "4",
    name: "Manu-roni & Cheese",
    categories: ["Sides"]
  }
]