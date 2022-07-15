import { Async, component$, Host } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import Menu from "../components/menu";
import { MENU, FullMenu, Category } from "../data/menu";

export default component$(() => {
  const menu = useEndpoint<FullMenu>();
  return (
    <Host>
      <h2>Welcome to Qwik City Soup &amp; Subs</h2>
      <p>The meta-framework for Qwik.</p>
      <article>
        <h2>Our Menu</h2>
        <Async
          resource={menu}
          onResolved={(menu) => (
            <Menu categories={menu.categories} items={menu.items} />
          )}
        />
      </article>
    </Host>
  );
});

export const onGet: EndpointHandler<FullMenu> = () => {
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
