import { component$, Host } from "@builder.io/qwik";

export default component$(() => {
  return (
    <Host>
      <h2>Your Order</h2>
      <ul>
        TODO: Order line items go here.
      </ul>
      <form class="grid gap-1">
        <fieldset>
          <legend>Delivery Options</legend>
          <label>
            <input type="radio" name="delivery" />
            <span>Pick Up</span>
          </label>
          <label>
            <input type="radio" name="delivery" />
            <span>Delivery</span>
          </label>
        </fieldset>
        <label class="grid">
          Your Name
          <input type="text" name="name" autoComplete="full-name" />
        </label>
        <label class="grid">
          Your Email
          <input type="email" name="email" autoComplete="email" />
        </label>
        <label class="grid">
          Your Phone
          <input type="tel" name="phone" autoComplete="phone" />
        </label>
        <p>TODO: Show address fields if delivery option is chosen</p>
        <p>TODO: Payment information</p>
        <button>Checkout</button>
      </form>
    </Host>
  );
});
