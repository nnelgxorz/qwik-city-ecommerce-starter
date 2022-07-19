import { component$, Host, Resource } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import { CurrentLocation } from "../components/current-location";
import { LOCATIONS, RestaurantLocation } from "../data/locations";
import { getCookieValue } from "../utils";

export default component$(() => {
  const contentResource = useEndpoint<{ order_location: RestaurantLocation }>();
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

export const onGet: EndpointHandler = (event) => {
  const location_id = getCookieValue(event.request, 'qwik-city-location');
  const order_location = LOCATIONS.find(({ id }) => id === location_id);
  if (!location_id || !order_location) {
    return { status: 301, redirect: '/locations' }
  }
  return {
    status: 200,
    body: {
      order_location
    }
  }
}