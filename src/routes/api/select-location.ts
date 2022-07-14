import { EndpointHandler } from "@builder.io/qwik-city";

export const onPost: EndpointHandler = (ev) => {
  return {
    status: 200,
    headers: {
      location: '/order-online',
      'Set-Cookie': 'qwik-city-location=123'
    }
  }
}