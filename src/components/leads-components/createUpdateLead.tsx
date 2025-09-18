"use client";

import { useState, useEffect } from "react";
import { useLeadStore, Lead } from "@/stores/useLeadStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { validateEmail, validateMobile } from "@/lib/validation";
import ContactInformation, { ContactFormErrors } from "./contactInformation";
import ApplicationPreferences from "./applicationPreferences";

const initialState: Omit<Lead, "id" | "createdat" | "updatedat"> = {
  name: "",
  mobile: "",
  email: "",
  qualifications: "",
  address: "",
  doneexam: false,
  examscores: {},
  preferredcountry: "",
  status: "new",
  type: "student",
  utmsource: "walkin",
  utmmedium: "",
  utmcampaign: "",
  assignedto: null,
};

interface LeadFormSheetProps {
  lead?: Lead | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function LeadFormSheet({ lead, isOpen, onOpenChange }: LeadFormSheetProps) {
  const isEditMode = !!lead;
  const { addLead, updateLead } = useLeadStore();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [applicationPreferences, setApplicationPreferences] = useState<string>("");
  const [visaCountry, setVisaCountry] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && lead) {
      setFormData({ ...lead });
    } else {
      setFormData(initialState);
    }
  }, [lead, isEditMode, isOpen]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const newErrors: { [key: string]: string } = {};
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.mobile) newErrors.mobile = "Mobile is required";
      if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
      if (!validateMobile(formData.mobile)) newErrors.mobile = "Invalid mobile number";

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setLoading(false);
        return;
      }

      const leadData = {
        ...formData,
        applicationPreferences,
        visaCountry,
      };

      if (isEditMode && lead?.id) {
        await updateLead(lead.id, leadData);
        toast.success("Lead updated successfully!");
      } else {
        await addLead(leadData);
        toast.success("Lead created successfully!");
      }

      onOpenChange(false);
    } catch {
      toast.error(`Failed to ${isEditMode ? "update" : "create"} lead.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-2xl">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Lead Details" : "Create a New Lead"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode ? `Update the details for ${lead?.name}.` : "Enter details below to add a new lead."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto px-6 py-6 space-y-8">
          <ContactInformation
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />

          <ApplicationPreferences
            applicationPreference={applicationPreferences}
            setApplicationPreference={setApplicationPreferences}
            visaCountry={visaCountry}
            setVisaCountry={setVisaCountry}
          />
        </div>

        <SheetFooter className="p-6 border-t bg-background mt-auto">
          <div className="flex w-full items-center gap-3">
            <SheetClose asChild>
              <Button variant="outline" disabled={loading}>Cancel</Button>
            </SheetClose>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? (isEditMode ? "Saving..." : "Creating...") : (isEditMode ? "Save Changes" : "Create Lead")}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
