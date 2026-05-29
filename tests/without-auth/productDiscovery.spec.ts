import { test } from "../../utils/fixtures";

test.describe("Product Discover & Navigation Test", () => {
  test("Should display product catalog correctly", async ({ productpage }) => {
    await productpage.navigate();
    await productpage.expectProductsLoaded();
  });

  test("Should return relevant products on valid search keyword", async ({
    productpage,
  }) => {
    await productpage.navigate();
    await productpage.expectProductsLoaded();
    const keyword = "Blue Top";
    await productpage.searchProduct(keyword);
    await productpage.expectSearchResultContains(keyword);
  });

  test("Should handle empty result on invalid search keyword", async ({
    productpage,
  }) => {
    await productpage.navigate();
    await productpage.expectProductsLoaded();
    const keyword = "Asus Laptop";
    await productpage.searchProduct(keyword);
    await productpage.expectNoProductsFound();
  });

  test("Should display complete item details on product detail page", async ({
    productpage,
    detailproductpage,
  }) => {
    await productpage.navigate();
    await productpage.expectProductsLoaded();
    await productpage.clickViewProduct(0);
    await detailproductpage.verifyAllProductDetailVisible();
  });

  test("Should filter products correctly when category selected", async ({
    homepage,
    productpage,
  }) => {
    await homepage.sidebar.selectSubCategory("Women", "Tops");
    await productpage.expectCategoryFilterApplied("Women", "Tops");
  });

  test("Should filter products correctly when brand selected", async ({
    homepage,
    productpage,
  }) => {
    await homepage.sidebar.selectBrand("Polo");
    await productpage.expectBrandFilterApplied("Polo");
  });
});
