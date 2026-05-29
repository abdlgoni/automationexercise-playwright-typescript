import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { SidebarComponent } from "./components/SidebarComponent";

export class HomePage extends BasePage {
  private readonly SignupLoginButton = this.page.getByRole("link", {
    name: "Signup / Login",
  });

  private readonly CartButton = this.page.getByRole("link", { name: "Cart" });

  private readonly DeleteAccountButton = this.page.getByRole("link", {
    name: "Delete Account",
  });

  private readonly loggedInText = this.page.getByText("Logged in as");

  readonly sidebar: SidebarComponent;

  constructor(page: Page) {
    super(page);
    this.sidebar = new SidebarComponent(page);
  }

  async clickSignupLoginButton() {
    await this.SignupLoginButton.click();
  }

  async clickDeleteAccountButton() {
    await this.DeleteAccountButton.click();
  }

  async clickCartButton() {
    await this.CartButton.click();
  }

  async expectLoginSuccess() {
    await expect(this.loggedInText).toBeVisible();
  }
}
