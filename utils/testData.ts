import { RegisterDetails } from "../pages/RegisterPage";

export interface LoginCredentials {
  email: string;
  password: string;
}
// Positive case
export const validUser: LoginCredentials = {
  email: process.env.VALID_EMAIL ?? "azis@example.com",
  password: process.env.VALID_PASSWORD ?? "azis123",
};

// Negative cases - server validation
export const invalidUser: LoginCredentials = {
  email: "wrong@example.com",
  password: "Wrongpassword",
};

// Negative cases - browser validation
export const whitespaceUser: LoginCredentials = {
  email: " ",
  password: " ",
};

export const emptyUser: LoginCredentials = {
  email: "",
  password: "",
};

export const emailOnlyUser: LoginCredentials = {
  email: "azis@example.com",
  password: "",
};

export const passwordOnlyUser: LoginCredentials = {
  email: "",
  password: "azis123",
};

export const invalidEmailFormatUser: LoginCredentials = {
  email: "user.com",
  password: "azis123",
};

export const serverValidationUsers: Record<string, LoginCredentials> = {
  invalidCredentials: invalidUser,
};

export const browserValidationUsers: Record<string, LoginCredentials> = {
  whitespaceInput: whitespaceUser,
  emptyFields: emptyUser,
  emailOnly: emailOnlyUser,
  passwordOnly: passwordOnlyUser,
  invalidEmailFormat: invalidEmailFormatUser,
};

export const allInvalidUsers: Record<string, LoginCredentials> = {
  ...serverValidationUsers,
  ...browserValidationUsers,
};

export const newUser: RegisterDetails = {
  title: "Mr.",
  password: "Test1234",
  day: "20",
  month: "10",
  year: "2000",
  newsletter: true,
  specialoffer: true,
  firstname: "udin",
  lastname: "sedunia",
  address1: "Jl kebon",
  country: "Australia",
  state: "Mumbai",
  city: "Mumbai",
  zipcode: "1010",
  mobilenumber: "034839852374",
};

export interface CartItem {
  name: string;
  price: string;
  quantity: string;
}

export const cartItems: CartItem[] = [
  { name: "Blue Top", price: "500", quantity: "1" },
  { name: "Men T-shirt", price: "400", quantity: "1" },
];
