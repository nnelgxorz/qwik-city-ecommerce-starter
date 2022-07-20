import { Resource, component$, Host } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import { CurrentLocation } from "../components/current-location";
import Menu from "../components/menu";
import { MENU } from "../data/menu";
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
          <Menu categories={categories || []} items={items || []} />
        </>
        } />
    </Host>
  );
});

export const onGet: EndpointHandler<PageContent> = (event) => {
  const order_location = getUserLocation(event.request);
  if (!order_location) {
    return { status: 307, redirect: "/locations" };
  }
  const categories = getCategoriesList(MENU);
  return {
    status: 200,
    body: {
      categories: [...new Set(categories)],
      items: MENU,
      order_location: order_location
    },
  };
};
