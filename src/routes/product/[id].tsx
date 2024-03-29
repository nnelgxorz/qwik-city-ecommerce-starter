import { Resource, component$, Host } from "@builder.io/qwik";
import {
  DocumentHead,
  EndpointHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { CurrentLocation } from "../../components/current-location";
import { getRestaurantMenu, getUserLocation } from "../../utils";
import type { MenuItem, RestaurantLocation } from "../../types";

export interface PageContent {
  product: MenuItem;
  order_location: RestaurantLocation;
}

export default component$(() => {
  const contentResource = useEndpoint<typeof onGet>();
  return (
    <Host>
      <Resource
        resource={contentResource}
        onResolved={(content) => (
          <>
            <header>
              <h2>{content.product?.name || "Not Found"}</h2>
              <CurrentLocation current={content.order_location} />
            </header>
            <form method="post" class="grid gap-1">
              <label>
                <input
                  type="text"
                  name="id"
                  readOnly
                  hidden
                  aria-hidden="true"
                  value={content.product?.id}
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
                {content.product?.categories.map((category) => (
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

export const onGet: EndpointHandler<PageContent> = async ({
  params,
  url,
  request,
  response,
}) => {
  const order_location = await getUserLocation(request.url, request.headers);
  if (!order_location) {
    return response.redirect("/find-a-restaurant", 307);
  }
  const { id } = params;
  const origin = url.origin;
  const product = await getRestaurantMenu(origin).then((restaurant_menu) =>
    restaurant_menu.find((item) => item.id === id)
  );
  if (!product) {
    return (response.status = 404);
  }
  return { product, order_location };
};

export const onPost = () => {
  return { status: 301, redirect: "/checkout" };
};

export const head: DocumentHead<PageContent> = ({ data }) => {
  if (!data?.product) {
    return { title: "Product Not Found" };
  }
  return { title: data.product.name };
};
