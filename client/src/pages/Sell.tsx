import { Heading, Text, Card } from "@radix-ui/themes";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState, useRef } from "react";
import axios from "axios";
import config from "../config";
import { useAuth } from "../context/AuthContext";
import Button from "@/components/Button";
import ContentPage from "../components/ContentPage";
import Stepper from "../components/Stepper";
import BasicInfoView from "../components/sell/BasicInfoView";
import PriceView from "../components/sell/PriceView";
import CarInfoView from "../components/sell/CarInfoView";
import ContactView from "../components/sell/ContactView";
import { FormValues } from "../types/sell";

interface ImagePreview {
  id: string;
  file: File;
  preview: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Indtast titel"),
  listingType: Yup.string().required("Vælg salgs type"),
  brand: Yup.string().required("Vælg bil mærke"),
  model: Yup.string().required("Vælg bil model"),
  year: Yup.string().required("Vælg årgang"),
  price: Yup.number()
    .required("Indtast pris")
    .min(1, "Prisen skal være større end 0"),
  withVAT: Yup.boolean(),
  withRegistrationFee: Yup.boolean(),
  fuelType: Yup.string().required("Vælg brændstof"),
  version: Yup.string().required("Vælg version"),
  isAutomatic: Yup.boolean(),
  transmission: Yup.string().required("Vælg transmission"),
  description: Yup.string().required("Indtast beskrivelse"),
  seller: Yup.object().shape({
    phone: Yup.string().required("Indtast telefonnummer"),
    location: Yup.string().required("Indtast lokation"),
  }),
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
  seller: {
    name: "",
    email: "",
    phone: "",
    location: "",
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

const steps = [
  {
    title: "Grundlæggende",
    description: "Titel og bil",
  },
  {
    title: "Pris",
    description: "Pris og salgs type",
  },
  {
    title: "Detaljer",
    description: "Bil information",
  },
  {
    title: "Kontakt",
    description: "Kontakt information",
  },
];

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

const handleNumberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: number) => void,
  field: string
) => {
  const value = e.target.value.replace(/\D/g, "");
  setFieldValue(field, Number(value));
};

const Sell = () => {
  const { user } = useAuth();
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <ContentPage>
        <div className="max-w-4xl mx-auto px-4 text-center py-12">
          <Heading size="8" className="mb-4">
            Log ind for at sælge din bil
          </Heading>
          <Text size="4" className="text-gray-600">
            Du skal være logget ind for at oprette en annonce.
          </Text>
        </div>
      </ContentPage>
    );
  }

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

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const validateStep = (values: FormValues, step: number): boolean => {
    switch (step) {
      case 0:
        return !!(values.title && values.brand && values.model && values.year);
      case 1:
        if (values.listingType === "direct-sale") {
          return !!values.price;
        } else {
          return !!(
            values.leaseDetails.downPayment &&
            values.leaseDetails.monthlyPayment &&
            values.leaseDetails.duration &&
            values.leaseDetails.residualValue
          );
        }
      case 2:
        return !!(
          values.fuelType &&
          values.version &&
          values.description &&
          values.images.length > 0
        );
      case 3:
        return !!(values.seller.phone && values.seller.location);
      default:
        return false;
    }
  };

  const handleNext = (values: FormValues) => {
    if (validateStep(values, currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <ContentPage>
      <div className="max-w-4xl mx-auto px-4">
        <Heading size="8" className="mb-6">
          Sælg din bil
        </Heading>

        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

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
                seller: {
                  phone: values.seller.phone,
                  location: values.seller.location,
                },
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
                    Authorization: `Bearer ${user.token}`,
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
          {({ values, errors, touched, setFieldValue, handleSubmit }) => (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Card className="p-6">
                <div className="space-y-6">
                  {currentStep === 0 && (
                    <BasicInfoView
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      brands={brands}
                      models={models}
                      years={years}
                    />
                  )}

                  {currentStep === 1 && (
                    <PriceView
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      handleNumberInput={handleNumberInput}
                    />
                  )}

                  {currentStep === 2 && (
                    <CarInfoView
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      fuelTypes={fuelTypes}
                      versions={versions}
                      imagePreviews={imagePreviews}
                      error={error}
                      fileInputRef={
                        fileInputRef as React.RefObject<HTMLInputElement>
                      }
                      handleImageSelect={handleImageSelect}
                      removeImage={removeImage}
                      insertMarkdown={insertMarkdown}
                    />
                  )}

                  {currentStep === 3 && (
                    <ContactView
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                    />
                  )}

                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                    >
                      Tilbage
                    </Button>
                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={() => handleNext(values)}
                        disabled={!validateStep(values, currentStep)}
                      >
                        Næste
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Opretter annonce..." : "Opret annonce"}
                      </Button>
                    )}
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
