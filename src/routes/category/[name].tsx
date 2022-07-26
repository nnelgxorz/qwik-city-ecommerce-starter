import { component$, Host, Resource } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import MenuCard from "../../components/menu-card/menu-card";
import { MenuItem } from "../../types";
import { getRestaurantMenu } from "../../utils";

export interface PageContent {
  name: string
  items: MenuItem[]
}

export default component$(() => {
  const contentResource = useEndpoint<typeof onGet>();
  return <Host>
    <Resource
      resource={contentResource}
      onResolved={({ name, items }) =>
        <>
          <header>
            <h2>{name?.toUpperCase() || "Category Not Found"}</h2>
          </header>
          <ul role="list">
            {items.map(item => <MenuCard item={item} />)}
          </ul>
        </>
      } />
  </Host>
})

export const onGet: EndpointHandler<PageContent> = async (event) => {
  const { name } = event.params;
  const origin = event.url.origin;
  const items = await getRestaurantMenu(origin)
    .then(restaurant_menu => restaurant_menu.filter(({ categories }) => {
      return categories.findIndex(c => c.toLowerCase() === name) >= 0
    }));
  return { name, items }
}