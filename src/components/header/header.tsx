import { component$, Host } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export const NAVIGATION = {
  "Order Online": "/order-online",
  Locations: "/locations",
  "About Us": "/about-us",
};

export default component$(
  (props: { fullWidth?: boolean }) => {
    const pathname = useLocation().pathname;

    return (
      <Host class="bg-black">
        <div class="container flex justify-between align-center">
          <h1>
            <a class="text-white" href="/">
              Qwik City Soup & Subs 🍴
            </a>
          </h1>
          <nav aria-label="primary navigation">
            <ul role="list" class="flex">
              {Object.entries(NAVIGATION).map(([label, href]) => (
                <li>
                  <a
                    class="nav-link"
                    href={href}
                    aria-current={pathname === href ? "page" : undefined}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Host>
    );
  },
  {
    tagName: "header",
  }
);
