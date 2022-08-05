import { EndpointHandler } from "@builder.io/qwik-city";
import type { RestaurantLocation } from "../../types";
import { artificial_delay } from "../../utils";

const createLocation = (name: string, id: string): RestaurantLocation => {
  return {
    id,
    name,
    address: {
      street: `${id} Fake Street`,
      city: name,
    },
  };
};

export const RESTAURANT_LOCATIONS: RestaurantLocation[] = [
  createLocation("Partytown", "123"),
  createLocation("Qwik City", "456"),
  createLocation("Proxytown", "789"),
];

export const onGet: EndpointHandler<RestaurantLocation[]> = async ({
  request,
}) => {
  await artificial_delay();
  const search_id = new URL(request.url).searchParams.get("id");
  if (search_id) {
    return RESTAURANT_LOCATIONS.filter(({ id }) => id === search_id);
  }
  return RESTAURANT_LOCATIONS;
};
