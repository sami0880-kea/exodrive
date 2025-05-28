import { Card, Heading, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../lib/utils";
import ImageWithFallback from "./ImageWithFallback";
import { Listing } from "../types/listing";
import { Fuel, Gauge, Tag } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
}

const Badge = ({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded text-sm">
    <Icon size={14} className="text-gray-600" />
    <span className="text-gray-700 capitalize">{text}</span>
  </div>
);

const ListingCard = ({ listing }: ListingCardProps) => {
  const navigate = useNavigate();

  const calculateTotalLeasePrice = () => {
    if (!listing.leaseDetails) return 0;
    return (
      listing.leaseDetails.downPayment +
      listing.leaseDetails.monthlyPayment * listing.leaseDetails.duration
    );
  };

  return (
    <div
      onClick={() => navigate(`/listings/${listing._id}`)}
      className="cursor-pointer group h-full"
    >
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg h-full flex flex-col">
        <div className="h-[230px] relative">
          <ImageWithFallback
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover rounded-md"
          />
          {listing.listingType === "lease" && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              Leasing
            </div>
          )}
        </div>
        <div className="px-2 py-4 flex flex-col flex-1">
          <div className="mb-2">
            <Heading size="4" className="transition-colors line-clamp-2 mb-1">
              {listing.title}
            </Heading>
            <Text size="2" className="text-gray-600 capitalize">
              {listing.brand} {listing.model}
            </Text>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge icon={Tag} text={listing.version} />
            <Badge icon={Gauge} text={listing.transmission} />
            <Badge icon={Fuel} text={listing.fuelType} />
          </div>

          <div className="mt-auto">
            {listing.listingType === "lease" && listing.leaseDetails ? (
              <div className="border rounded-lg p-3 bg-gray-50 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Text size="1" className="text-gray-500 block">
                      Udbetaling
                    </Text>
                    <div className="font-medium">
                      {formatNumber(listing.leaseDetails.downPayment)}{" "}
                      <span className="text-gray-500">kr</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Text size="1" className="text-gray-500 block">
                      Pr. måned
                    </Text>
                    <div className="font-medium">
                      {formatNumber(listing.leaseDetails.monthlyPayment)}{" "}
                      <span className="text-gray-500">kr</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t space-y-1.5">
                  <Text size="1" className="text-gray-500 block">
                    Total for {listing.leaseDetails.duration} mdr
                  </Text>
                  <div className="font-semibold text-xl text-gray-700">
                    {formatNumber(calculateTotalLeasePrice())}{" "}
                    <span className="text-gray-500 text-[16px]">kr</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-3 bg-gray-50 space-y-1.5">
                <Text size="1" className="text-gray-500 block">
                  Pris
                </Text>
                <div className="font-semibold text-xl text-gray-700">
                  {formatNumber(listing.price || 0)}{" "}
                  <span className="text-gray-500 text-[16px]">kr</span>
                </div>
                {listing.withVAT && (
                  <span className="text-gray-500 font-normal text-sm">
                    inkl. moms
                    {listing.withRegistrationFee && (
                      <span className="text-gray-500 font-normal text-sm">
                        {" "}
                        & registreringsafgift
                      </span>
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ListingCard;
