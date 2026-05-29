import { test } from "../../utils/fixtures";

test.describe("Cart", () => {
  test("Add one product to cart", async ({ productpage, cartpage }) => {
    await productpage.navigate();
    await productpage.expectProductsLoaded();
    const productDetail = await productpage.getProductDetail(0);
    await productpage.addToCartAndViewCart(0);
    await cartpage.expectCartPageVisible();
    await cartpage.verifyCartCount(1);
    await cartpage.verifyPriceConsistency(
      productDetail.name,
      productDetail.price,
    );
  });
  test("Add multiple product to cart", async ({ productpage, cartpage }) => {
    await productpage.navigate();
    await productpage.expectProductsLoaded();
    const productDetails = await productpage.getProductDetails([1, 2]);
    await productpage.addMultipleToCart([1, 2]);
    await cartpage.expectCartPageVisible();
    await cartpage.verifyCartCount(2);
    await cartpage.verifyAllPriceConsistensy(productDetails);
  });
  test("Search and add product to cart", async ({ productpage, cartpage }) => {
    await productpage.navigate();
    await productpage.expectProductsLoaded();
    const keyword = "Winter Top";
    await productpage.searchProduct(keyword);
    await productpage.expectSearchResultContains(keyword);
    await productpage.getProductDetail(0);
    await productpage.addToCartAndViewCart(0);
    await cartpage.expectCartPageVisible();
    await cartpage.verifyCartCount(1);
  });
});
