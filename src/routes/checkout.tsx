import { component$, Host, Resource } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import { CurrentLocation } from "../components/current-location";
import { getUserLocation } from "../utils";
import { RestaurantLocation } from "../types";

export interface PageContent {
  order_location: RestaurantLocation
}

export default component$(() => {
  const contentResource = useEndpoint<typeof onGet>();
  return (
    <Host>
      <Resource
        resource={contentResource}
        onResolved={({ order_location }) => <>
          <header>
            <h2>Your Order</h2>
            <CurrentLocation current={order_location} />
          </header>
          <ul>
            TODO: Order line items go here.
          </ul>
          <form class="grid gap-1">
            <fieldset>
              <legend>Delivery Options</legend>
              <label>
                <input type="radio" name="delivery" />
                <span>Pick Up</span>
              </label>
              <label>
                <input type="radio" name="delivery" />
                <span>Delivery</span>
              </label>
            </fieldset>
            <label class="grid">
              Your Name
              <input type="text" name="name" autoComplete="full-name" />
            </label>
            <label class="grid">
              Your Email
              <input type="email" name="email" autoComplete="email" />
            </label>
            <label class="grid">
              Your Phone
              <input type="tel" name="phone" autoComplete="phone" />
            </label>
            <p>TODO: Show address fields if delivery option is chosen</p>
            <p>TODO: Payment information</p>
            <button>Checkout</button>
          </form>
        </>
        }
      />

    </Host>
  );
});

export const onGet: EndpointHandler<PageContent> = async (event) => {
  const order_location = await getUserLocation(event.request.url, event.request.headers);
  if (!order_location) {
    return event.response.redirect('/find-a-restaurant', 301);
  }
  return { order_location }
}