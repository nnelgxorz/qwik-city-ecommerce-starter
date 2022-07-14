import { component$, Host, Slot } from '@builder.io/qwik';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';

export default component$(() => {
  return (
    <Host id="inner-body">
      <Header />
      <main class="container">
        <Slot />
      </main>
      <Footer />
    </Host>
  );
});
