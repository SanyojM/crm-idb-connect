import { isValidPhoneNumber } from "react-phone-number-input";

export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateMobile = (mobile: string) =>
  mobile ? isValidPhoneNumber(mobile) : false;
