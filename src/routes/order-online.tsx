import { Resource, component$, Host } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import { CurrentLocation } from "../components/current-location";
import RestaurantMenu from "../components/menu";
import { getCategoriesList, getRestaurantMenu, getUserLocation } from "../utils";
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

export const onGet: EndpointHandler<PageContent> = async (event) => {
  const order_location = await getUserLocation(event.request);
  if (!order_location) {
    return { status: 307, redirect: "/find-a-restaurant" };
  }
  const origin = event.url.origin;
  const restaurant_menu = await getRestaurantMenu(origin);
  const categories = getCategoriesList(restaurant_menu);
  return {
    status: 200,
    body: {
      categories,
      items: restaurant_menu,
      order_location: order_location
    },
  };
};
