import { Heading } from "@radix-ui/themes";
import FormInput from "../FormInput";
import CustomSelect from "../Select";
import { FormValues, FormErrors, FormTouched } from "../../types/sell";

interface BasicInfoViewProps {
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  setFieldValue: (field: string, value: any) => void;
  brands: { value: string; label: string }[];
  models: { [key: string]: { value: string; label: string }[] };
  years: { value: string; label: string }[];
}

const BasicInfoView = ({
  values,
  errors,
  touched,
  setFieldValue,
  brands,
  models,
  years,
}: BasicInfoViewProps) => {
  return (
    <div className="space-y-6">
      <Heading size="4">Grundlæggende Information</Heading>

      <FormInput
        label="Titel"
        value={values.title}
        onChange={(e) => setFieldValue("title", e.target.value)}
        placeholder="Indtast titel på annoncen"
        error={errors.title}
        touched={touched.title}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomSelect
          label="Bil Mærke"
          value={values.brand}
          onValueChange={(value) => {
            setFieldValue("brand", value);
            setFieldValue("model", "");
          }}
          options={brands}
          placeholder="Vælg mærke"
        />

        <CustomSelect
          label="Bil Model"
          value={values.model}
          onValueChange={(value) => setFieldValue("model", value)}
          options={values.brand ? models[values.brand] : []}
          placeholder="Vælg model"
          disabled={!values.brand}
        />

        <CustomSelect
          label="Årgang"
          value={values.year}
          onValueChange={(value) => setFieldValue("year", value)}
          options={years}
          placeholder="Vælg årgang"
        />
      </div>
    </div>
  );
};

export default BasicInfoView;
