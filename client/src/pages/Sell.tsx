import { Heading, Text, Card } from "@radix-ui/themes";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
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
import Button from "@/components/Button";
import CustomSelect from "@/components/Select";
import ContentPage from "../components/ContentPage";
import { useState, useRef } from "react";
import axios from "axios";
import config from "../config";

interface LeaseDetails {
  downPayment: number;
  monthlyPayment: number;
  duration: number;
  residualValue: number;
}

interface FormValues {
  title: string;
  listingType: string;
  brand: string;
  model: string;
  year: string;
  price: number | null;
  withVAT: boolean;
  withRegistrationFee: boolean;
  fuelType: string;
  version: string;
  isAutomatic: boolean;
  images: File[];
  description: string;
  transmission: string;
  leaseDetails: LeaseDetails;
}

interface ImagePreview {
  id: string;
  file: File;
  preview: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 6;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Indtast titel"),
  listingType: Yup.string().required("Vælg salgs type"),
  brand: Yup.string().required("Vælg bil mærke"),
  model: Yup.string().required("Vælg bil model"),
  year: Yup.string().required("Vælg årgang"),
  price: Yup.number().nullable(),
  withVAT: Yup.boolean(),
  withRegistrationFee: Yup.boolean(),
  fuelType: Yup.string().required("Vælg brændstof"),
  version: Yup.string().required("Vælg version"),
  isAutomatic: Yup.boolean(),
  transmission: Yup.string().required("Vælg transmission"),
  description: Yup.string().required("Indtast beskrivelse"),
  leaseDetails: Yup.object().when("listingType", {
    is: "lease",
    then: () =>
      Yup.object().shape({
        downPayment: Yup.number().required("Indtast udbetaling").min(0),
        monthlyPayment: Yup.number()
          .required("Indtast månedlig betaling")
          .min(0),
        duration: Yup.number().required("Vælg varighed").min(1),
        residualValue: Yup.number().required("Indtast restværdi").min(0),
      }),
  }),
});

const initialValues: FormValues = {
  title: "",
  listingType: "direct-sale",
  brand: "",
  model: "",
  year: "",
  price: null,
  withVAT: true,
  withRegistrationFee: true,
  fuelType: "",
  version: "",
  isAutomatic: true,
  transmission: "automatic",
  images: [],
  description: "",
  leaseDetails: {
    downPayment: 0,
    monthlyPayment: 0,
    duration: 12,
    residualValue: 0,
  },
};

const brands = [
  { value: "lamborghini", label: "Lamborghini" },
  { value: "ferrari", label: "Ferrari" },
  { value: "porsche", label: "Porsche" },
  { value: "mclaren", label: "Mclaren" },
  { value: "bmw", label: "BMW" },
  { value: "mercedes", label: "Mercedes" },
];

const models = {
  lamborghini: [
    { value: "huracan", label: "Huracan" },
    { value: "aventador", label: "Aventador" },
    { value: "urus", label: "Urus" },
  ],
  ferrari: [
    { value: "488", label: "488" },
    { value: "812", label: "812" },
    { value: "sf90", label: "SF90" },
  ],
  porsche: [
    { value: "911", label: "911" },
    { value: "718", label: "718" },
    { value: "taycan", label: "Taycan" },
  ],
  mclaren: [
    { value: "720s", label: "720s" },
    { value: "600lt", label: "600lt" },
    { value: "570s", label: "570s" },
  ],
  bmw: [
    { value: "3series", label: "3 Series" },
    { value: "5series", label: "5 Series" },
    { value: "x5", label: "X5" },
  ],
  mercedes: [
    { value: "cclass", label: "C-Class" },
    { value: "eclass", label: "E-Class" },
    { value: "sclass", label: "S-Class" },
  ],
};

const fuelTypes = [
  { value: "diesel", label: "Diesel" },
  { value: "benzin", label: "Benzin" },
  { value: "el", label: "El" },
  { value: "plug-in-diesel", label: "Plug-in Diesel" },
  { value: "plug-in-benzin", label: "Plug-in Benzin" },
];

const versions = [
  { value: "sedan", label: "Sedan" },
  { value: "coupe", label: "Coupe" },
  { value: "saloon", label: "Saloon" },
  { value: "suv", label: "SUV" },
  { value: "cuv", label: "CUV" },
];

const years = Array.from({ length: 46 }, (_, i) => ({
  value: (2025 - i).toString(),
  label: (2025 - i).toString(),
}));

const insertMarkdown = (
  type: string,
  setFieldValue: (field: string, value: string) => void,
  description: string
) => {
  const textarea = document.querySelector("textarea");
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = description.substring(start, end);
  let newText = description;

  switch (type) {
    case "bold":
      newText =
        description.substring(0, start) +
        "**" +
        selectedText +
        "**" +
        description.substring(end);
      break;
    case "italic":
      newText =
        description.substring(0, start) +
        "*" +
        selectedText +
        "*" +
        description.substring(end);
      break;
    case "link":
      newText =
        description.substring(0, start) +
        "[" +
        selectedText +
        "](url)" +
        description.substring(end);
      break;
    case "list":
      newText =
        description.substring(0, start) +
        "\n- " +
        selectedText +
        description.substring(end);
      break;
  }

  setFieldValue("description", newText);

  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start + 2, end + 2);
  }, 0);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("da-DK").format(value);
};

const handleNumberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: number) => void,
  field: string
) => {
  const value = e.target.value.replace(/\D/g, "");
  setFieldValue(field, Number(value));
};

const Sell = () => {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews: ImagePreview[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File ${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`File ${file.name} is not a supported image type`);
        return;
      }

      const preview = URL.createObjectURL(file);
      newPreviews.push({
        id: `${file.name}-${Date.now()}`,
        file,
        preview,
      });
    });

    if (newPreviews.length > 0) {
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setError(null);
    }
  };

  const removeImage = (id: string) => {
    setImagePreviews((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <ContentPage>
      <div className="max-w-4xl mx-auto px-4">
        <Heading size="8" className="mb-6">
          Sælg din bil
        </Heading>

        <Formik<FormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (
            values: FormValues,
            { setSubmitting }: FormikHelpers<FormValues>
          ) => {
            try {
              setIsSubmitting(true);
              setError(null);

              const formData = new FormData();

              const listingData = {
                listingType: values.listingType,
                brand: values.brand,
                model: values.model,
                year: parseInt(values.year, 10),
                price: values.price,
                fuelType: values.fuelType,
                version: values.version,
                transmission: values.isAutomatic ? "automatic" : "manual",
                title: values.title,
                description: values.description,
                withVAT: values.withVAT,
                withRegistrationFee: values.withRegistrationFee,
                ...(values.listingType === "lease" && {
                  leaseDetails: {
                    downPayment: parseInt(
                      values.leaseDetails.downPayment.toString(),
                      10
                    ),
                    monthlyPayment: parseInt(
                      values.leaseDetails.monthlyPayment.toString(),
                      10
                    ),
                    duration: parseInt(
                      values.leaseDetails.duration.toString(),
                      10
                    ),
                    residualValue: parseInt(
                      values.leaseDetails.residualValue.toString(),
                      10
                    ),
                  },
                }),
              };

              formData.append("listingData", JSON.stringify(listingData));

              values.images.forEach((file) => {
                formData.append("images", file);
              });

              const response = await axios.post(
                config.apiUrl + "/listings",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              if (response.status === 201) {
                window.location.href = "/";
              }
            } catch (err: unknown) {
              console.error("Error submitting form:", err);
              if (axios.isAxiosError(err)) {
                const errorMessage =
                  err.response?.data?.message ||
                  "An error occurred while creating the listing";
                console.error("Error details:", errorMessage);
                setError(errorMessage);
              } else {
                setError("An unexpected error occurred");
              }
            } finally {
              setIsSubmitting(false);
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            setFieldValue,
            handleSubmit,
          }: {
            values: FormValues;
            setFieldValue: (
              field: string,
              value: number | string | boolean | File[]
            ) => void;
            handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
          }) => (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titel
                    </label>
                    <input
                      type="text"
                      value={values.title}
                      onChange={(e) => setFieldValue("title", e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      placeholder="Indtast titel på annoncen"
                    />
                  </div>

                  <div>
                    <Heading size="4" className="mb-4">
                      Salgs Type
                    </Heading>
                    <RadioGroup.Root
                      value={values.listingType}
                      onValueChange={(value) =>
                        setFieldValue("listingType", value)
                      }
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pris (kr)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formatNumber(values.price || 0)}
                            onChange={(e) =>
                              handleNumberInput(e, setFieldValue, "price")
                            }
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            kr
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox.Root
                            checked={values.withVAT}
                            onCheckedChange={(checked) =>
                              setFieldValue("withVAT", checked)
                            }
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
                              value={formatNumber(
                                values.leaseDetails.downPayment
                              )}
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
                              value={formatNumber(
                                values.leaseDetails.monthlyPayment
                              )}
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
                              setFieldValue(
                                "leaseDetails.duration",
                                Number(e.target.value)
                              )
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
                              value={formatNumber(
                                values.leaseDetails.residualValue
                              )}
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
                            onChange={(e) =>
                              handleNumberInput(e, setFieldValue, "price")
                            }
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            kr
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
                      options={
                        values.brand
                          ? models[values.brand as keyof typeof models]
                          : []
                      }
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

                    <CustomSelect
                      label="Brændstof"
                      value={values.fuelType}
                      onValueChange={(value) =>
                        setFieldValue("fuelType", value)
                      }
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
                              className="flex items-center justify-center"
                            >
                              <span className="flex items-center text-gray-600">
                                <Upload className="w-4 h-4 mr-2" />
                                Add More
                              </span>
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {imagePreviews.map((preview) => (
                              <div
                                key={preview.id}
                                className="relative aspect-square"
                              >
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
                          <p className="text-sm font-medium mb-2">
                            Drop your images here
                          </p>
                          <p className="text-xs text-gray-500 mb-4">
                            SVG, PNG, JPG or GIF (max. 5MB)
                          </p>
                          <div className="flex justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center justify-center"
                            >
                              <span className="flex items-center text-gray-600">
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
                    <div className="space-y-2">
                      <div className="flex gap-2 p-2 border rounded-t-md bg-gray-50">
                        <button
                          type="button"
                          onClick={() =>
                            insertMarkdown(
                              "bold",
                              setFieldValue,
                              values.description
                            )
                          }
                          className="p-2 hover:bg-gray-200 rounded-md"
                          title="Fed tekst"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertMarkdown(
                              "italic",
                              setFieldValue,
                              values.description
                            )
                          }
                          className="p-2 hover:bg-gray-200 rounded-md"
                          title="Kursiv"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertMarkdown(
                              "link",
                              setFieldValue,
                              values.description
                            )
                          }
                          className="p-2 hover:bg-gray-200 rounded-md"
                          title="Link"
                        >
                          <Link className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertMarkdown(
                              "list",
                              setFieldValue,
                              values.description
                            )
                          }
                          className="p-2 hover:bg-gray-200 rounded-md"
                          title="Liste"
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={values.description}
                        onChange={(e) =>
                          setFieldValue("description", e.target.value)
                        }
                        className="w-full h-48 px-4 py-2 border rounded-b-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        style={{ direction: "ltr", textAlign: "left" }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button size="lg" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Opretter annonce..." : "Opret annonce"}
                    </Button>
                  </div>
                </div>
              </Card>
            </form>
          )}
        </Formik>
      </div>
    </ContentPage>
  );
};

export default Sell;
