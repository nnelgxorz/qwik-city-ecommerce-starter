import { Resource, component$, Host } from "@builder.io/qwik";
import {
  DocumentHead,
  EndpointHandler,
  useEndpoint,
  useLocation,
} from "@builder.io/qwik-city";
import { MENU, MenuItem } from "../../data/menu";
import { getCookieValue, parseCookie } from "../../utils";

export default component$(() => {
  const product = useEndpoint<MenuItem | null>();
  return (
    <Host>
      <Resource
        resource={product}
        onPending={() => <p>Loading...</p>}
        onResolved={(data: MenuItem | null) => (
          <>
            <h2>{data?.name || "Not Found"}</h2>
            <form method="post" class="grid gap-1">
              <label>
                <input
                  type="text"
                  name="id"
                  readOnly
                  hidden
                  aria-hidden="true"
                  value={data?.id}
                />
              </label>
              <label class="grid">
                Made For
                <input type="text" name="madeFor" />
              </label>
              <label class="grid">
                Quantity
                <input type="number" name="quantity" min={1} value={1} />
              </label>
              <button>Add To Order</button>
            </form>
            <footer>
              Categories
              <ul role="list">
                {data?.categories.map((category) => (
                  <li>
                    <a href={`/category/${category.toLowerCase()}`}>
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </footer>
          </>
        )}
      />
    </Host>
  );
});

export const onGet: EndpointHandler = (ev) => {
  const location = getCookieValue(ev.request, "qwik-city-location");
  if (!location) {
    return { status: 307, headers: { location: "/locations" } };
  }
  const { id } = ev.params;
  const product = MENU.find((item) => item.id === id);
  if (!product) {
    return {
      status: 404,
      body: null,
    };
  }
  return {
    status: 200,
    body: product,
  };
};

export const head: DocumentHead<MenuItem | null> = ({ data }) => {
  if (!data) {
    return { title: "Product Not Found" };
  }
  return { title: data.name };
};
