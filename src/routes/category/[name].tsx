import { component$, Host, Resource } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import MenuCard from "../../components/menu-card/menu-card";
import { RESTARAUNT_MENU } from "../../data/restaurant_menu";
import { MenuItem } from "../../types";

export interface PageContent {
  name: string
  items: MenuItem[]
}

export default component$(() => {
  const contentResource = useEndpoint<PageContent>();
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

export const onGet: EndpointHandler<PageContent> = (event) => {
  const { name } = event.params;
  const items = RESTARAUNT_MENU.filter(({ categories }) => {
    return categories.findIndex(c => c.toLowerCase() === name) >= 0
  })
  return {
    status: 200,
    body: { name, items }
  }
}