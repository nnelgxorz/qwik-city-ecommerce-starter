export interface RestaurantLocation {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
  };
}

export type Category = "Soups" | "Subs" | "Sides";

export interface RestaurantMenu {
  categories: Category[];
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  categories: Category[];
}
