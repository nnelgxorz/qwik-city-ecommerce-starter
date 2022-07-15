import { Async, component$, Host } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import { LOCATIONS, RestaurantLocation } from "../data/locations";
import { setCookie } from "../utils";

export const Location = component$(
  (props: { location: RestaurantLocation }) => {
    return (
      <li>
        <article>
          <h3>{props.location.name}</h3>
          <p>
            {props.location.address.street} {props.location.address.city}
          </p>
          <form method="post">
            <input
              type="text"
              name="location"
              hidden
              aria-hidden="true"
              readOnly
              value={props.location.id}
            />
            <button
              aria-label={`Begin online order for ${props.location.name}`}
            >
              Order Online
            </button>
          </form>
        </article>
      </li>
    );
  }
);

export default component$(() => {
  const resource = useEndpoint<RestaurantLocation[]>();
  return (
    <Host>
      <h2>Select A Location</h2>
      <Async
        resource={resource}
        onPending={() => <p>Loading...</p>}
        onResolved={(locations) => (
          <ul class="grid gap-1" role="list">
            {locations.map((location) => (
              <Location location={location} />
            ))}
          </ul>
        )}
      />
    </Host>
  );
});

export const onGet: EndpointHandler<RestaurantLocation[]> = () => {
  return { status: 200, body: LOCATIONS };
};

export const onPost: EndpointHandler = () => {
  console.log("posting");
  return {
    status: 301,
    headers: {
      location: '/order-online',
      ...setCookie({ key: 'qwik-city-location', value: '123' })
    }
  }
}
