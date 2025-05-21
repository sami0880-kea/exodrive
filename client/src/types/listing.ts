export interface LeaseDetails {
  downPayment: number;
  monthlyPayment: number;
  duration: number;
  residualValue: number;
}

export interface Listing {
  _id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number | null;
  fuelType: string;
  version: string;
  transmission: string;
  images: string[];
  description: string;
  listingType: string;
  withVAT: boolean;
  withRegistrationFee: boolean;
  leaseDetails?: LeaseDetails;
  seller?: {
    name: string;
    phone: string;
    email: string;
    location: string;
  };
  createdAt: string;
  updatedAt: string;
}
