import { Resource, component$, Host } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import { LOCATIONS } from "../data/locations";
import { RESTAURANT_LOCATION_COOKIE } from "../utils";
import { RestaurantLocation } from "../types";
import { setCookie } from "../utils";

export interface PageContent {
  locations: RestaurantLocation[]
}

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
              name="restaurant-location"
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
  const resource = useEndpoint<PageContent>();
  return (
    <Host>
      <h2>Select A Location</h2>
      <Resource
        resource={resource}
        onPending={() => <p>Loading...</p>}
        onResolved={({ locations }) => (
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

export const onPost: EndpointHandler = async ({ request }) => {
  const formData = await request.formData();
  const locationID = formData.get('restaurant-location')?.toString();
  const location = LOCATIONS.find(({ id }) => id === locationID);
  if (!locationID || !location) {
    return {
      status: 404
    }
  }
  return {
    status: 301,
    redirect: '/order-online',
    headers: {
      ...setCookie(RESTAURANT_LOCATION_COOKIE, locationID, {
        httpOnly: true,
        secure: true
      })
    }
  }
}
