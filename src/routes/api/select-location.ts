import { EndpointHandler } from "@builder.io/qwik-city";

export const onPost: EndpointHandler = (ev) => {
  return {
    status: 301,
    headers: {
      "Set-Cookie": "qwik-city-location=123; Secure; HttpOnly;",
      location: "/order-online",
    },
  };
};
