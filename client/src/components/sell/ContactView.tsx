import { Heading } from "@radix-ui/themes";
import FormInput from "../FormInput";
import { FormValues, FormErrors, FormTouched } from "../../types/sell";

interface ContactViewProps {
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  setFieldValue: (field: string, value: any) => void;
}

const ContactView = ({
  values,
  errors,
  touched,
  setFieldValue,
}: ContactViewProps) => {
  return (
    <div className="space-y-6">
      <Heading size="4">Kontakt Information</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Telefonnummer"
          type="tel"
          value={values.seller.phone}
          onChange={(e) => setFieldValue("seller.phone", e.target.value)}
          placeholder="Indtast telefonnummer"
          error={errors.seller?.phone}
          touched={touched.seller?.phone}
          required
        />
        <FormInput
          label="Lokation"
          value={values.seller.location}
          onChange={(e) => setFieldValue("seller.location", e.target.value)}
          placeholder="Indtast by eller område"
          error={errors.seller?.location}
          touched={touched.seller?.location}
          required
        />
      </div>
    </div>
  );
};

export default ContactView;
