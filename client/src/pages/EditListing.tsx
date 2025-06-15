import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heading, Text, Card } from "@radix-ui/themes";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
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
import { toast } from "sonner";

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

const handleNumberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: number) => void,
  field: string
) => {
  const value = e.target.value.replace(/\D/g, "");
  setFieldValue(field, Number(value));
};

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/listings/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const listing = response.data;

        if (listing.user._id !== user?._id) {
          navigate("/my-listings");
          toast.error("Du har ikke adgang til at redigere denne annonce");
          return;
        }

        setInitialValues({
          title: listing.title,
          listingType: listing.listingType,
          brand: listing.brand,
          model: listing.model,
          year: listing.year.toString(),
          price: listing.price,
          withVAT: listing.withVAT,
          withRegistrationFee: listing.withRegistrationFee,
          fuelType: listing.fuelType,
          version: listing.version,
          isAutomatic: listing.transmission === "automatic",
          transmission: listing.transmission,
          description: listing.description,
          images: [],
          leaseDetails: listing.leaseDetails || {
            downPayment: 0,
            monthlyPayment: 0,
            duration: 12,
            residualValue: 0,
          },
          seller: {
            name: user?.name || "",
            email: user?.email || "",
            phone: listing.seller.phone,
            location: listing.seller.location,
          },
        });
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("Kunne ikke hente annoncen");
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchListing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

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
        return !!(values.fuelType && values.version && values.description);
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

  if (!user) {
    return (
      <ContentPage>
        <div className="max-w-4xl mx-auto px-4 text-center py-12">
          <Heading size="8" className="mb-4">
            Log ind for at redigere din annonce
          </Heading>
          <Text size="4" className="text-gray-600">
            Du skal være logget ind for at redigere din annonce.
          </Text>
        </div>
      </ContentPage>
    );
  }

  if (loading) {
    return (
      <ContentPage>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Text>Loading...</Text>
        </div>
      </ContentPage>
    );
  }

  if (error || !initialValues) {
    return (
      <ContentPage>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Text className="text-red-500">
            {error || "Kunne ikke hente annoncen"}
          </Text>
        </div>
      </ContentPage>
    );
  }

  return (
    <ContentPage>
      <div className="max-w-4xl mx-auto px-4">
        <Heading size="8" className="mb-6">
          Rediger annonce
        </Heading>

        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step < currentStep) {
              setCurrentStep(step);
            }
          }}
        />

        <Formik<FormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (
            values: FormValues,
            { setSubmitting }: FormikHelpers<FormValues>
          ) => {
            try {
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
                  name: user?.name || "",
                  email: user?.email || "",
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

              await axios.put(`${config.apiUrl}/listings/${id}`, listingData, {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              });

              toast.success("Annonce opdateret");
              navigate("/my-listings");
            } catch (err) {
              console.error("Error updating listing:", err);
              toast.error("Kunne ikke opdatere annoncen");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (currentStep === steps.length - 1) {
                  handleSubmit(e);
                }
              }}
              noValidate
            >
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
                      imagePreviews={[]}
                      error={null}
                      fileInputRef={
                        fileInputRef as React.RefObject<HTMLInputElement>
                      }
                      handleImageSelect={() => {}}
                      removeImage={() => {}}
                      insertMarkdown={() => {}}
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleNext(values);
                        }}
                        disabled={!validateStep(values, currentStep)}
                      >
                        Næste
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Gemmer ændringer..." : "Gem ændringer"}
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

export default EditListing;
