import { EndpointHandler } from "@builder.io/qwik-city";
import { RestaurantLocation } from "../../types";

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


export const onGet: EndpointHandler<RestaurantLocation[]> = async () => {
  return RESTAURANT_LOCATIONS
}