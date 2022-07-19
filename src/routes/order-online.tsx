import { Resource, component$, Host } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import Menu from "../components/menu";
import { MENU, Category, FullMenu } from "../data/menu";
import { getCookieValue, parseCookie } from "../utils";

export default component$(() => {
  const menu = useEndpoint<FullMenu>();
  return (
    <Host>
      <h2>Our Menu</h2>
      <Resource
        resource={menu}
        onRejected={(data: any) => <p>{data}</p>}
        onResolved={(menu: FullMenu) => (
          <Menu categories={menu?.categories || []} items={menu?.items || []} />
        )}
      />
    </Host>
  );
});

export const onGet: EndpointHandler<FullMenu> = (ev) => {
  const location = getCookieValue(ev.request, "qwik-city-location");
  if (!location) {
    return { status: 307, headers: { location: "/locations" } };
  }
  const categories = MENU.reduce((prev: Category[], { categories }) => {
    return [...prev, ...categories];
  }, []);
  return {
    status: 200,
    body: {
      categories: [...new Set(categories)],
      items: MENU,
    },
  };
};
