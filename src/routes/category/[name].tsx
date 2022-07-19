import { component$, Host, Resource } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import MenuCard from "../../components/menu-card/menu-card";
import { MENU, MenuItem } from "../../data/menu";

export default component$(() => {
  const contentResource = useEndpoint<{ name: string | undefined, items: MenuItem[] }>();
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

export const onGet: EndpointHandler = (event) => {
  const { name } = event.params;
  const items = MENU.filter(({ categories }) => {
    return categories.findIndex(c => c.toLowerCase() === name) >= 0
  })
  return {
    status: 200,
    body: { name, items }
  }
}