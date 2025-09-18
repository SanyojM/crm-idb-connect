"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateEmail, validateMobile } from "@/lib/validation";
import PhoneInput, { Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Dispatch, SetStateAction } from "react";
import { Lead } from "@/stores/useLeadStore";

export interface ContactFormErrors {
  name?: string;
  mobile?: string;
  email?: string;
  address?: string;
}

// ✅ Props type
interface ContactInformationProps {
  formData: Omit<Lead, "id" | "createdat" | "updatedat">;
  setFormData: Dispatch<
    SetStateAction<Omit<Lead, "id" | "createdat" | "updatedat">>
  >;
  errors: ContactFormErrors;
  setErrors: Dispatch<SetStateAction<ContactFormErrors>>;
}

export default function ContactInformation({
  formData,
  setFormData,
  errors,
  setErrors,
}: ContactInformationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border p-4 rounded-lg">
        {/* Full Name */}
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name*</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Mobile */}
        <div className="grid gap-2">
          <Label>Mobile Number*</Label>
          <PhoneInput
            international
            defaultCountry="IN"
            value={formData.mobile as Value}
            onChange={(value) => {
              const newValue = value || "";
              setFormData((prev) => ({ ...prev, mobile: newValue }));
              if (!validateMobile(newValue)) {
                setErrors((prev) => ({
                  ...prev,
                  mobile: "Invalid mobile number",
                }));
              } else {
                setErrors((prev) => ({ ...prev, mobile: "" }));
              }
            }}
            className="border rounded-md p-2"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile}</p>
          )}
        </div>

        {/* Email */}
        <div className="col-span-2 grid gap-2">
          <Label>Email Address*</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((prev) => ({ ...prev, email: val }));
              if (!validateEmail(val)) {
                setErrors((prev) => ({
                  ...prev,
                  email: "Invalid email format",
                }));
              } else {
                setErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* City */}
        <div className="sm:col-span-2 grid gap-2">
          <Label>City</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>
      </div>
    </div>
  );
}
