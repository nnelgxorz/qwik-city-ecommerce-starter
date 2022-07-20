import { EndpointHandler } from "@builder.io/qwik-city";
import { OrderLineItem } from "../../types";
import { getRestaurantMenu } from "../../utils";

export const onPost: EndpointHandler<OrderLineItem | undefined> = async (event) => {
  const formData = validateFormData(await event.request.formData());
  if (!formData) { return { status: 404 } }
  const origin = event.url.origin;
  const product = await getRestaurantMenu(origin)
    .then(items => items.find(({ id }) => id === formData.id));
  if (!product) { return { status: 404 } }
  const line_item: OrderLineItem = {
    id: Math.round(Math.random() * 100).toString(),
    name: product.name,
    price: 0,
    quantity: Number(formData.quantity),
    made_for: formData.made_for,
    url: event.url.href
  }
  return {
    status: 200,
    body: line_item
  }
}

export const validateFormData = (formData: FormData) => {
  const [id, quantity, made_for] = [
    formData.get('id')?.toString(),
    Number(formData.get('quantity')?.toString()),
    formData.get('madeFor')?.toString()
  ]
  if (!id || id === '' || isNaN(quantity)) return;
  return {
    id, quantity, made_for
  }
}