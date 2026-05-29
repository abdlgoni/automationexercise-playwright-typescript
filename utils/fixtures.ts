import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { DetailProductPage } from "../pages/DetailProductPage";

type PageFixtures = {
  homepage: HomePage;
  loginpage: LoginPage;
  registerpage: RegisterPage;
  productpage: ProductPage;
  detailproductpage: DetailProductPage;
  cartpage: CartPage;
};

export const test = base.extend<PageFixtures>({
  page: async ({ page }, use) => {
    await page.route(
      "**/*{googleads,doubleclick,adservice,analytics,pagead}**",
      (route) => {
        route.abort();
      },
    );
    await use(page);
  },

  homepage: async ({ page }, use) => {
    const homepage = new HomePage(page);
    await homepage.navigate();
    await use(homepage);
  },

  loginpage: async ({ page }, use) => {
    const loginpage = new LoginPage(page);
    await use(loginpage);
  },
  registerpage: async ({ page }, use) => {
    const registerpage = new RegisterPage(page);
    await use(registerpage);
  },
  productpage: async ({ page }, use) => {
    const productpage = new ProductPage(page);
    await use(productpage);
  },

  detailproductpage: async ({ page }, use) => {
    const detailproductpage = new DetailProductPage(page);
    await use(detailproductpage);
  },

  cartpage: [
    async ({ page }, use) => {
      const cartpage = new CartPage(page);
      await cartpage.clearCart();
      await use(cartpage);
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
