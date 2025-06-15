import { Heading, Text } from "@radix-ui/themes";
import * as Checkbox from "@radix-ui/react-checkbox";
import {
  Check,
  Upload,
  Bold,
  Italic,
  Link,
  List,
  ImageIcon,
  AlertCircleIcon,
  XIcon,
} from "lucide-react";
import Button from "../Button";
import CustomSelect from "../Select";
import { FormValues, FormErrors, FormTouched } from "../../types/sell";

interface CarInfoViewProps {
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  setFieldValue: (field: string, value: any) => void;
  fuelTypes: { value: string; label: string }[];
  versions: { value: string; label: string }[];
  imagePreviews: { id: string; file: File; preview: string }[];
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (id: string) => void;
  insertMarkdown: (
    type: string,
    setFieldValue: (field: string, value: string) => void,
    description: string
  ) => void;
}

const MAX_FILES = 6;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];

const CarInfoView = ({
  values,
  errors,
  touched,
  setFieldValue,
  fuelTypes,
  versions,
  imagePreviews,
  error,
  fileInputRef,
  handleImageSelect,
  removeImage,
  insertMarkdown,
}: CarInfoViewProps) => {
  return (
    <div className="space-y-6">
      <Heading size="4">Bil Information</Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomSelect
          label="Brændstof"
          value={values.fuelType}
          onValueChange={(value) => setFieldValue("fuelType", value)}
          options={fuelTypes}
          placeholder="Vælg brændstof"
        />

        <CustomSelect
          label="Version"
          value={values.version}
          onValueChange={(value) => setFieldValue("version", value)}
          options={versions}
          placeholder="Vælg version"
        />

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox.Root
              checked={values.isAutomatic}
              onCheckedChange={(checked) =>
                setFieldValue("isAutomatic", checked)
              }
              className="h-4 w-4 rounded border border-gray-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
            >
              <Checkbox.Indicator className="flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <Text size="2" className="font-medium">
              Automatisk gearkasse
            </Text>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <Heading size="4">Billeder</Heading>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            multiple
            className="hidden"
            onChange={(e) => {
              handleImageSelect(e);
              if (e.target.files) {
                setFieldValue("images", [
                  ...values.images,
                  ...Array.from(e.target.files),
                ]);
              }
            }}
          />

          {imagePreviews.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Uploaded Images ({imagePreviews.length})
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imagePreviews.length >= MAX_FILES}
                  className="flex items-center justify-center !border-gray-300 !text-gray-900 hover:!bg-gray-100 hover:!border-gray-400 hover:!text-gray-900"
                >
                  <span className="flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Add More
                  </span>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview) => (
                  <div key={preview.id} className="relative aspect-square">
                    <img
                      src={preview.preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        removeImage(preview.id);
                        setFieldValue(
                          "images",
                          values.images.filter(
                            (_: File, index: number) =>
                              index !==
                              imagePreviews.findIndex(
                                (p) => p.id === preview.id
                              )
                          )
                        );
                      }}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium mb-2">Drop your images here</p>
              <p className="text-xs text-gray-500 mb-4">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center !border-gray-300 !text-gray-900 hover:!bg-gray-100 hover:!border-gray-400 hover:!text-gray-900"
                >
                  <span className="flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Select Images
                  </span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircleIcon className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Heading size="4">Beskrivelse</Heading>
        <div>
          <div className="flex gap-2 p-2 border rounded-t-md bg-gray-50">
            <button
              type="button"
              onClick={() =>
                insertMarkdown("bold", setFieldValue, values.description)
              }
              className="p-2 hover:bg-gray-200 rounded-md"
              title="Fed tekst"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                insertMarkdown("italic", setFieldValue, values.description)
              }
              className="p-2 hover:bg-gray-200 rounded-md"
              title="Kursiv"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                insertMarkdown("link", setFieldValue, values.description)
              }
              className="p-2 hover:bg-gray-200 rounded-md"
              title="Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                insertMarkdown("list", setFieldValue, values.description)
              }
              className="p-2 hover:bg-gray-200 rounded-md"
              title="Liste"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <textarea
              value={values.description}
              onChange={(e) => setFieldValue("description", e.target.value)}
              className={`w-full h-48 px-4 py-2 border rounded-b-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 ${
                errors.description && touched.description
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              style={{ direction: "ltr", textAlign: "left" }}
              placeholder="Indtast beskrivelse af bilen..."
            />
            {errors.description && touched.description && (
              <div className="text-red-500 text-sm mt-1">
                {errors.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarInfoView;
