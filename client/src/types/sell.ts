import { FormikErrors, FormikTouched } from "formik";

export interface LeaseDetails {
  downPayment: number;
  monthlyPayment: number;
  duration: number;
  residualValue: number;
}

export interface FormValues {
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
  seller: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
}

export type FormErrors = FormikErrors<FormValues>;
export type FormTouched = FormikTouched<FormValues>;
