import { component$ } from "@builder.io/qwik";
import { RestaurantLocation } from "../types";

export const CurrentLocation = component$((props: { current: RestaurantLocation }) => {
  const { name, address } = props.current;
  const { street, city } = address
  return <aside>
    <p>Ordering for {name}</p>
    <address>
      <p>{street}, {city}</p>
    </address>
    <a href="/locations">Change Your Location</a>
  </aside>
})