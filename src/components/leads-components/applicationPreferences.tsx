"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// @ts-ignore
import countryList from "react-select-country-list";

interface CountryOption {
  label: string;
  value: string;
}

interface ApplicationPreferencesProps {
  applicationPreference: string;
  setApplicationPreference: (pref: string) => void;
  visaCountry: string;
  setVisaCountry: (country: string) => void;
}

const countryOptions: CountryOption[] = countryList().getData();

export default function ApplicationPreferences({
  applicationPreference,
  setApplicationPreference,
  visaCountry,
  setVisaCountry,
}: ApplicationPreferencesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Application Preferences</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border rounded-xl p-5 shadow-sm bg-card">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Applying for</Label>
          <Select
            value={applicationPreference}
            onValueChange={setApplicationPreference}
          >
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue placeholder="Select IELTS, PTE, or Visa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IELTS">IELTS</SelectItem>
              <SelectItem value="PTE">PTE</SelectItem>
              <SelectItem value="Visa">Visa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {applicationPreference === "Visa" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Preferred Country</Label>
            <Select value={visaCountry} onValueChange={setVisaCountry}>
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {countryOptions.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
