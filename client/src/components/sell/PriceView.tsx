import { Heading, Text } from "@radix-ui/themes";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import FormInput from "../FormInput";
import { FormValues, FormErrors, FormTouched } from "../../types/sell";
import { formatNumber } from "../../lib/utils";

interface PriceViewProps {
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  setFieldValue: (field: string, value: string | number | boolean) => void;
  handleNumberInput: (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: number) => void,
    field: string
  ) => void;
}

const PriceView = ({
  values,
  errors,
  touched,
  setFieldValue,
  handleNumberInput,
}: PriceViewProps) => {
  return (
    <div className="space-y-6">
      <Heading size="4">Pris og Salgs Type</Heading>

      <div>
        <Heading size="4" className="mb-4">
          Salgs Type
        </Heading>
        <RadioGroup.Root
          value={values.listingType}
          onValueChange={(value) => setFieldValue("listingType", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <RadioGroup.Item
            value="direct-sale"
            className="flex items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer data-[state=checked]:border-red-500 data-[state=checked]:bg-red-50"
          >
            <Text>Ren handel</Text>
          </RadioGroup.Item>
          <RadioGroup.Item
            value="lease"
            className="flex items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer data-[state=checked]:border-red-500 data-[state=checked]:bg-red-50"
          >
            <Text>Leasingaftale</Text>
          </RadioGroup.Item>
        </RadioGroup.Root>
      </div>

      {values.listingType === "direct-sale" && (
        <div className="space-y-4">
          <FormInput
            label="Pris"
            value={formatNumber(values.price || 0)}
            onChange={(e) => handleNumberInput(e, setFieldValue, "price")}
            suffix="kr"
            error={errors.price}
            touched={touched.price}
            required
          />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox.Root
                checked={values.withVAT}
                onCheckedChange={(checked) => setFieldValue("withVAT", checked)}
                className="h-4 w-4 rounded border border-gray-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              >
                <Checkbox.Indicator className="flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <Text size="2" className="font-medium">
                Med moms
              </Text>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox.Root
                checked={values.withRegistrationFee}
                onCheckedChange={(checked) =>
                  setFieldValue("withRegistrationFee", checked)
                }
                className="h-4 w-4 rounded border border-gray-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              >
                <Checkbox.Indicator className="flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <Text size="2" className="font-medium">
                Med registreringsafgift
              </Text>
            </label>
          </div>
        </div>
      )}

      {values.listingType === "lease" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Udbetaling (kr)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formatNumber(values.leaseDetails.downPayment)}
                  onChange={(e) =>
                    handleNumberInput(
                      e,
                      (field: string, value: number) =>
                        setFieldValue(field, value),
                      "leaseDetails.downPayment"
                    )
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  kr
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Månedlig ydelse (kr)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formatNumber(values.leaseDetails.monthlyPayment)}
                  onChange={(e) =>
                    handleNumberInput(
                      e,
                      (field: string, value: number) =>
                        setFieldValue(field, value),
                      "leaseDetails.monthlyPayment"
                    )
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  kr
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leasing varighed (måneder)
              </label>
              <input
                type="number"
                value={values.leaseDetails.duration}
                onChange={(e) =>
                  setFieldValue("leaseDetails.duration", Number(e.target.value))
                }
                min="1"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restværdi (kr)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formatNumber(values.leaseDetails.residualValue)}
                  onChange={(e) =>
                    handleNumberInput(
                      e,
                      (field: string, value: number) =>
                        setFieldValue(field, value),
                      "leaseDetails.residualValue"
                    )
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  kr
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pris med ren handel (valgfrit)
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatNumber(values.price || 0)}
                onChange={(e) => handleNumberInput(e, setFieldValue, "price")}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                kr
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceView;
