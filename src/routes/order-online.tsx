import { Resource, component$, Host } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import { CurrentLocation } from "../components/current-location";
import RestaurantMenu from "../components/menu";
import { RESTARAUNT_MENU } from "../data/restaurant_menu";
import { getCategoriesList, getUserLocation } from "../utils";
import { Category, MenuItem, RestaurantLocation } from "../types";

export interface PageContent {
  categories: Category[]
  items: MenuItem[]
  order_location: RestaurantLocation
}

export default component$(() => {
  const contentResource = useEndpoint<PageContent>();
  return (
    <Host>
      <Resource
        resource={contentResource}
        onResolved={({ items, categories, order_location }) => <>
          <header>
            <h2>Our Menu</h2>
            <CurrentLocation current={order_location} />
          </header>
          <RestaurantMenu categories={categories || []} items={items || []} />
        </>
        } />
    </Host>
  );
});

export const onGet: EndpointHandler<PageContent> = (event) => {
  const order_location = getUserLocation(event.request);
  if (!order_location) {
    return { status: 307, redirect: "/find-a-restaurant" };
  }
  const categories = getCategoriesList(RESTARAUNT_MENU);
  return {
    status: 200,
    body: {
      categories: [...new Set(categories)],
      items: RESTARAUNT_MENU,
      order_location: order_location
    },
  };
};
