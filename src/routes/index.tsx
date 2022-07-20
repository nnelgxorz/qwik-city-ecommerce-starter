import { Resource, component$, Host } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import RestaurantMenu from "../components/menu";
import { Category, MenuItem } from "../types";
import { getCategoriesList, getRestaurantMenu } from "../utils";

export interface PageContent {
  categories: Category[]
  items: MenuItem[]
}

export default component$(() => {
  const menu = useEndpoint<PageContent>();
  return (
    <Host>
      <h2>Welcome to Qwik City Soup &amp; Subs</h2>
      <p>The meta-framework for Qwik.</p>
      <article>
        <h2>Our Menu</h2>
        <Resource
          resource={menu}
          onResolved={(menu) => (
            <RestaurantMenu categories={menu.categories} items={menu.items} />
          )}
        />
      </article>
    </Host>
  );
});

export const onGet: EndpointHandler<PageContent> = async (event) => {
  const origin = event.url.origin;
  const restaurant_menu: MenuItem[] = await getRestaurantMenu(origin);
  const categories = getCategoriesList(restaurant_menu);
  return {
    status: 200,
    body: {
      categories: [...new Set(categories)],
      items: restaurant_menu,
    },
  };
};
