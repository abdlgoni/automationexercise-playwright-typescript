import { Page, expect } from "@playwright/test";
import { BasePage } from "../BasePage";

export type MainCategory = "Women" | "Men" | "Kids";
export type BrandName =
  | "Polo"
  | "H&M"
  | "Madame"
  | "Mast & Harbour"
  | "Babyhug"
  | "Allen Solly Junior"
  | "Kookie Kids"
  | "Biba";

export class SidebarComponent extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  // Static — dipakai di lebih dari satu method
  private readonly categoryContainer = this.page.locator(".category-products");
  private readonly brandsContainer = this.page.locator(".brands_products");
  private readonly brandList = this.page.locator(".brands-name .nav-pills");

  // Dynamic — bergantung parameter, inline di method yang memakainya
  private categoryToggle = (category: MainCategory) =>
    this.categoryContainer.locator(`a[href="#${category}"]`);

  private categoryPanel = (category: MainCategory) =>
    this.page.locator(`#${category}`);

  private subCategoryLink = (category: MainCategory, subName: string) =>
    this.categoryPanel(category).locator(`a:has-text("${subName}")`);

  private brandLink = (brandName: BrandName) =>
    this.brandsContainer.locator(`a[href="/brand_products/${brandName}"]`);

  constructor(page: Page) {
    super(page);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /** Verifikasi semua brand tampil di sidebar */
  async expectAllBrandsVisible() {
    const brands: BrandName[] = [
      "Polo",
      "H&M",
      "Madame",
      "Mast & Harbour",
      "Babyhug",
      "Allen Solly Junior",
      "Kookie Kids",
      "Biba",
    ];

    for (const brand of brands) {
      await expect(this.brandLink(brand)).toBeVisible();
    }
  }

  /** Verifikasi panel sub-kategori terbuka setelah diklik */
  async expectCategoryExpanded(category: MainCategory) {
    await expect(this.categoryPanel(category)).toBeVisible();
  }

  /** Verifikasi jumlah produk pada badge brand sesuai ekspektasi */
  async expectBrandProductCount(brandName: BrandName, expectedCount: number) {
    const count = await this.getBrandProductCount(brandName);
    expect(count).toBe(expectedCount);
  }

  // ── Data Capture ──────────────────────────────────────────────────────────

  /** Ambil angka jumlah produk dari badge brand, misal "(6)" => 6 */
  async getBrandProductCount(brandName: BrandName): Promise<number> {
    const countText = await this.brandLink(brandName)
      .locator(".pull-right")
      .innerText();

    return parseInt(countText.replace(/[()]/g, "").trim(), 10);
  }

  /** Ambil semua nama brand yang tampil di sidebar */
  async getAllBrandNames(): Promise<string[]> {
    const links = this.brandList.locator("li a");
    const count = await links.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const fullText = (await links.nth(i).innerText()).trim();
      // Hapus bagian count "(6)" dari teks, ambil nama brand saja
      const name = fullText.replace(/\(\d+\)/, "").trim();
      names.push(name);
    }

    return names;
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Expand accordion kategori utama (Women / Men / Kids) */
  private async expandCategory(category: MainCategory) {
    const toggle = this.categoryToggle(category);
    await expect(toggle).toBeVisible();
    await toggle.click();
  }

  /** Klik sub-kategori di dalam panel kategori utama */
  async selectSubCategory(category: MainCategory, subName: string) {
    await this.expandCategory(category);

    const link = this.subCategoryLink(category, subName);
    await expect(link).toBeVisible();
    await link.click();
  }

  /** Klik brand berdasarkan nama */
  async selectBrand(brandName: BrandName) {
    const link = this.brandLink(brandName);
    await expect(link).toBeVisible();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await this.page.waitForLoadState("networkidle");
  }
}
