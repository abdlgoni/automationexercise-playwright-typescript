import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DetailProductPage extends BasePage {
  // Locators
  // container yang membungkus semua infomasi
  private readonly container = this.page.locator(".product-information");

  // nama produk
  private readonly productName = this.container.locator("h2");

  // kategori produk
  private readonly productCategory = this.container.locator("p", {
    hasText: "Category:",
  });

  //harga
  private readonly productPrice = this.container.locator("span> span");

  //availability
  private readonly productAvaibility = this.container.locator("p", {
    hasText: "Availability:",
  });

  //kondisi product
  private readonly productCondition = this.container.locator("p", {
    hasText: "Condition:",
  });

  //brand product
  private readonly productBrand = this.container.locator("p", {
    hasText: "Brand:",
  });

  constructor(page: Page) {
    super(page);
  }
  //Verifikasi semua detail produk terlihat
  async verifyAllProductDetailVisible() {
    await expect(this.productName).toBeVisible();
    await expect(this.productCategory).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productAvaibility).toBeVisible();
    await expect(this.productCondition).toBeVisible();
    await expect(this.productBrand).toBeVisible();
  }
}
