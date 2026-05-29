import { Page } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigasi
  async navigate(path: string = "/") {
    await this.page.goto(path);
  }

  // Get title
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  // wait for URL
  async waitForURL(url: string) {
    await this.page.waitForURL(url);
  }

  // Screenshoot helper
  async takeScreenShot(name: string) {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    });
  }
}
