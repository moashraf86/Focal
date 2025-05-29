import { z } from "zod";
import { egyptStates } from "./constants";

// create form schema
export const checkoutSchema = z.object({
  contact: z
    .string()
    .trim()
    .refine(
      (value) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ||
        /^(\+2)?01[0-2,5][0-9]{8}$/.test(value),
      {
        message: "Please enter a valid email or Egyptian phone number",
      }
    ),
  firstName: z
    .string()
    .min(1, {
      message: "First name is required",
    })
    .max(50, {
      message: "First name must be less than 50 characters",
    }),
  lastName: z
    .string()
    .min(1, {
      message: "Last name is required",
    })
    .max(50, {
      message: "Last name must be less than 50 characters",
    }),
  address: z
    .string()
    .min(1, {
      message: "Address is required",
    })
    .max(100, {
      message: "Address must be less than 100 characters",
    }),
  apartment: z
    .string()
    .max(50, {
      message: "Apartment, suite, etc. must be less than 50 characters",
    })
    .or(z.literal("")),
  city: z
    .string()
    .min(1, {
      message: "City is required",
    })
    .max(50, {
      message: "City must be less than 50 characters",
    }),
  state: z.enum([...egyptStates] as [string, ...string[]], {
    required_error: "State is required",
  }),
  postal_code: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{5}$/.test(val), {
      message: "postal_code code must be exactly 5 digits",
    }),
});
