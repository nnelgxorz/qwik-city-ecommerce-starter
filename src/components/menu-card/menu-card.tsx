import { component$, Host } from "@builder.io/qwik";
import { MenuItem } from "../../types";

export default component$(
  (props: { item: MenuItem }) => {
    return (
      <Host>
        <h4>{props.item.name}</h4>
        <a class="button" href={`/product/${props.item.id}`}>
          Order
        </a>
      </Host>
    );
  },
  { tagName: "article" }
);
