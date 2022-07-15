import { component$, Host, useStyles$ } from "@builder.io/qwik";

export default component$(
  () => {
    return (
      <Host class="flex justify-center bg-black">
        <a class="text-white" href="https://qwik.builder.io">
          Built with Qwik
        </a>
      </Host>
    );
  },
  {
    tagName: "footer",
  }
);
