import { test } from "../../utils/fixtures";

import { newUser } from "../../utils/testData";

test.describe("Registration", () => {
  test("Register new user", async ({ homepage, loginpage, registerpage }) => {
    await homepage.clickSignupLoginButton();
    await loginpage.signup("udin", "udinsedunia@gmail.com");
    await loginpage.clickSignupButton();
    await registerpage.fillCompleteRegistration(newUser);
    await registerpage.submitRegistration();
    await registerpage.expectRegistrationSuccess();
    await registerpage.clickContinueButton();
    await homepage.expectLoginSuccess();
    await homepage.clickDeleteAccountButton();
    await registerpage.expectSuccesDeleteAccount();
    await registerpage.clickContinueButton();
  });
});
