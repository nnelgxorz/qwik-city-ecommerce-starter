import { Resource, component$, Host } from "@builder.io/qwik";
import { EndpointHandler, useEndpoint } from "@builder.io/qwik-city";
import { getAllLocations, RESTAURANT_LOCATION_COOKIE } from "../utils";
import { RestaurantLocation } from "../types";
import { setCookie } from "../utils";

export interface PageContent {
  restaurant_locations: RestaurantLocation[];
}

export const RESTAURANT_ID_FIELD = "restaurant-location";

export const RestaurantLocationCard = component$(
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
              name={RESTAURANT_ID_FIELD}
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
  const resource = useEndpoint<typeof onGet>();
  return (
    <Host>
      <h2>Select A Location</h2>
      <Resource
        resource={resource}
        onPending={() => <p>Loading...</p>}
        onResolved={({ restaurant_locations }) => (
          <ul class="grid gap-1" role="list">
            {restaurant_locations.map((location) => (
              <RestaurantLocationCard location={location} />
            ))}
          </ul>
        )}
      />
    </Host>
  );
});

export const onGet: EndpointHandler<PageContent> = async (event) => {
  const origin = event.url.origin;
  const restaurant_locations = await getAllLocations(origin);
  return { restaurant_locations };
};

export const onPost: EndpointHandler<void> = async ({
  request,
  url,
  response,
}) => {
  const formData = await request.formData();
  const restaurant_id = formData.get(RESTAURANT_ID_FIELD)?.toString();
  const origin = url.origin;
  const restaurant = await getAllLocations(origin).then((restaurants) =>
    restaurants.find(({ id }) => id === restaurant_id)
  );
  if (!restaurant_id || !restaurant) {
    response.status = 404;
    return;
  }
  const cookie = setCookie(RESTAURANT_LOCATION_COOKIE, restaurant_id, {
    httpOnly: true,
    secure: true,
  });
  response.headers.set("Set-Cookie", cookie["Set-Cookie"]);
  return response.redirect("/order-online", 301);
};
