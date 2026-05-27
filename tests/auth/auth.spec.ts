import { test } from "../../utils/fixtures";
import {
  validUser,
  serverValidationUsers,
  browserValidationUsers,
} from "../../utils/testData";

test.describe("Authentication", () => {
  test("Login with valid credentials", async ({ homepage, loginpage }) => {
    await homepage.clickSignupLoginButton();
    await loginpage.login(validUser.email, validUser.password);
    await homepage.expectLoginSuccess();
  });
  test.describe("Server validation", () => {
    for (const [key, user] of Object.entries(serverValidationUsers)) {
      test(`Login negative case - ${key}`, async ({ homepage, loginpage }) => {
        await homepage.clickSignupLoginButton();
        await loginpage.login(user.email, user.password);
        await loginpage.expectServerError();
      });
    }
  });
  test.describe("Browser validation", () => {
    for (const [key, user] of Object.entries(browserValidationUsers)) {
      test(`Login negative case - ${key}`, async ({ homepage, loginpage }) => {
        await homepage.clickSignupLoginButton();
        await loginpage.login(user.email, user.password);
        await loginpage.expectBrowserValidation();
      });
    }
  });
});
