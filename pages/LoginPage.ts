import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage.ts";

export class LoginPage extends BasePage {
  // login Section
  private readonly LoginToYourAccountTitle = this.page.getByRole("heading", {
    name: "Login to your account",
  });
  private readonly EmailLoginInput = this.page
    .locator("form")
    .filter({ hasText: "Login" })
    .getByPlaceholder("Email Address");
  private readonly PasswordInput = this.page.getByPlaceholder("Password");
  private readonly LoginButton = this.page.getByRole("button", {
    name: "Login",
  });
  private readonly ErrorLoginMessage = this.page.locator("p", {
    hasText: "Your email or password is incorrect!",
  });
  private readonly ErrorSignupMessage = this.page.locator("p", {
    hasText: "Email Address already exist!",
  });
  private readonly LoggedInText = this.page.getByText("Logged in as");

  // Regester section
  private readonly NewUserSignupTitle = this.page.getByRole("heading", {
    name: "New User Signup!",
  });
  private readonly signupNameInput = this.page.getByRole("textbox", {
    name: "Name",
  });
  private readonly signupEmailInput = this.page
    .locator("form")
    .filter({ hasText: "Signup" })
    .getByPlaceholder("Email Address");
  private readonly SingupButton = this.page.getByRole("button", {
    name: "Signup",
  });

  //
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await super.navigate("/login");
  }

  async login(email: string, password: string) {
    await this.LoginToYourAccountTitle.isVisible();
    await this.EmailLoginInput.fill(email);
    await this.PasswordInput.fill(password);
    await this.LoginButton.click();
  }

  async signup(name: string, email: string) {
    await this.NewUserSignupTitle.isVisible();
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
  }

  async clickSignupButton() {
    await this.SingupButton.click();
  }

  async expectLoginSuccess() {
    await expect(this.LoggedInText).toBeVisible();
  }

  async expectServerError() {
    await expect(this.ErrorLoginMessage).toBeVisible();
  }

  async expectBrowserValidation() {
    await expect(this.page).toHaveURL("/login");
    await expect(this.LoginButton).toBeVisible();
  }

  async expectSignupFailed() {
    await expect(this.ErrorSignupMessage).toBeVisible();
  }
}
