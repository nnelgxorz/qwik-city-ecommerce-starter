import { component$ } from "@builder.io/qwik";
import { Category, MenuItem } from "../data/menu";
import MenuCard from "./menu-card/menu-card";

export default component$(
  (props: { categories: Category[]; items: MenuItem[] }) => {
    return (
      <ul class="grid gap-1" role="list">
        {props.categories.map((category) => (
          <article>
            <h3>{category}</h3>
            <ul role="list">
              {props.items
                .filter((item) => item.categories.includes(category))
                .map((item) => (
                  <li>
                    <MenuCard item={item} />
                  </li>
                ))}
            </ul>
          </article>
        ))}
      </ul>
    );
  }
);
