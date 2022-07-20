import { Resource, component$, Host, useStore } from "@builder.io/qwik";
import {
  DocumentHead,
  EndpointHandler,
  useEndpoint,
  useLocation,
} from "@builder.io/qwik-city";
import { CurrentLocation } from "../../components/current-location";
import { getRestaurantMenu, getUserLocation } from "../../utils";
import { MenuItem, OrderLineItem, RestaurantLocation } from "../../types";

export interface PageContent {
  product: MenuItem | null,
  order_location: RestaurantLocation
}

export type PageState = 'idle' | 'loading' | 'success' | 'error'

export interface Store {
  state: PageState
  made_for: string
  quantity: number
  error?: string
}

export default component$(() => {
  const origin = new URL(useLocation().href).origin;
  const contentResource = useEndpoint<PageContent>();
  const store: Store = useStore({
    state: 'idle',
    made_for: '',
    quantity: 1
  });
  return (
    <Host>
      <Resource
        resource={contentResource}
        onResolved={content => (
          <>
            <header>
              <h2>{content.product?.name || "Not Found"}</h2>
              <CurrentLocation current={content.order_location} />
            </header>
            <form class="grid gap-1" preventdefault:submit onSubmit$={async (event) => {
              const formData = new FormData();
              formData.set('id', content.product?.id || '')
              formData.set('madeFor', store.made_for)
              formData.set('quantity', store.quantity.toString())
              store.state = 'loading'
              // const response = await fetch(new URL('api/validate-order-line', origin), {
              //   method: 'POST',
              //   body: formData
              // });
              // if (response.status === 200) {
              //   const order_line_item = await response.json() as OrderLineItem;
              //   const order = JSON.parse(localStorage.getItem('qwik-city-order') || '[]')
              //   localStorage.setItem('qwik-city-order', JSON.stringify([order_line_item, ...order]))
              //   store.state = 'success'
              // } else {
              //   store.state = 'error'
              // }
            }}>
              <fieldset disabled={!content.product ? true : false}>
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
                  <input type="text" name="madeFor" value={store.made_for} onChange$={(event) => {
                    store.made_for = (event.target as HTMLInputElement).value
                  }} />
                </label>
                <label class="grid">
                  Quantity
                  <input type="number" name="quantity" min={1} value={store.made_for} onChange$={(event) => {
                    store.quantity = (event.target as HTMLInputElement).valueAsNumber
                  }} />
                </label>
              </fieldset>
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

export const onGet: EndpointHandler = async (event) => {
  const order_location = await getUserLocation(event.request);
  if (!order_location) {
    return { status: 307, headers: { location: "/find-a-restaurant" } };
  }
  const { id } = event.params;
  const origin = event.url.origin;
  const product = await getRestaurantMenu(origin)
    .then(restaurant_menu => restaurant_menu.find((item) => item.id === id));
  if (!product) {
    return {
      status: 404,
      body: { product: null, order_location },
    };
  }
  return {
    status: 200,
    body: { product, order_location },
  };
};

export const head: DocumentHead<PageContent> = ({ data }) => {
  if (!data || !data?.product) {
    return { title: "Product Not Found" };
  }
  return { title: data.product.name };
};