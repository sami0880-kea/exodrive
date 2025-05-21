import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Heading, Text } from "@radix-ui/themes";
import { Fuel, Gauge, Tag, MapPin, Phone, Mail, Calendar } from "lucide-react";
import axios from "axios";
import config from "../config";
import { Listing } from "../types/listing";
import ContentPage from "../components/ContentPage";
import ImageWithFallback from "../components/ImageWithFallback";
import { formatNumber } from "../lib/utils";

const Badge = ({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
    <Icon size={16} className="text-gray-600" />
    <span className="text-gray-700">{text}</span>
  </div>
);

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.apiUrl}/listings/${id}`);
        setListing(response.data);
      } catch (err) {
        setError("Failed to fetch listing details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  if (loading) {
    return (
      <ContentPage>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Text>Loading...</Text>
        </div>
      </ContentPage>
    );
  }

  if (error || !listing) {
    return (
      <ContentPage>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Text className="text-red-500">{error || "Listing not found"}</Text>
        </div>
      </ContentPage>
    );
  }

  const calculateTotalLeasePrice = () => {
    if (!listing.leaseDetails) return 0;
    return (
      listing.leaseDetails.downPayment +
      listing.leaseDetails.monthlyPayment * listing.leaseDetails.duration
    );
  };

  return (
    <ContentPage>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.listingType === "lease" && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    Leasing
                  </div>
                )}
              </div>

              <div className="mt-8">
                <Heading size="8" className="mb-2">
                  {listing.title}
                </Heading>
                <Text size="3" className="text-gray-600 capitalize mb-6">
                  {listing.brand} {listing.model}
                </Text>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge icon={Tag} text={listing.version} />
                  <Badge icon={Gauge} text={listing.transmission} />
                  <Badge icon={Fuel} text={listing.fuelType} />
                </div>

                <div className="prose max-w-none whitespace-pre-wrap">
                  {listing.description}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="p-4">
                {listing.listingType === "lease" && listing.leaseDetails ? (
                  <div className="space-y-4">
                    <Heading size="4">Leasing Detaljer</Heading>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Text size="2" className="text-gray-500 block">
                            Udbetaling
                          </Text>
                          <div className="font-medium text-lg">
                            {formatNumber(listing.leaseDetails.downPayment)} kr
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Text size="2" className="text-gray-500 block">
                            Pr. måned
                          </Text>
                          <div className="font-medium text-lg">
                            {formatNumber(listing.leaseDetails.monthlyPayment)}{" "}
                            kr
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Text size="2" className="text-gray-500 block">
                            Løbetid
                          </Text>
                          <div className="font-medium text-lg">
                            {listing.leaseDetails.duration} mdr
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Text size="2" className="text-gray-500 block">
                            Restværdi
                          </Text>
                          <div className="font-medium text-lg">
                            {formatNumber(listing.leaseDetails.residualValue)}{" "}
                            kr
                          </div>
                        </div>
                      </div>
                      <div className="pt-3 border-t space-y-1.5">
                        <Text size="2" className="text-gray-500 block">
                          Total for {listing.leaseDetails.duration} mdr
                        </Text>
                        <div className="font-medium text-xl text-red-600">
                          {formatNumber(calculateTotalLeasePrice())} kr
                        </div>
                      </div>
                      {listing.price && (
                        <div className="pt-3 border-t space-y-1.5">
                          <Text size="2" className="text-gray-500 block">
                            Pris ved køb
                          </Text>
                          <div className="font-medium text-lg">
                            {formatNumber(listing.price)} kr
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Heading size="4" className="mb-3">
                      Pris
                    </Heading>
                    <div className="font-semibold text-2xl">
                      {formatNumber(listing.price || 0)} kr
                      {listing.withVAT && " inkl. moms"}
                    </div>
                  </div>
                )}
              </Card>

              {listing.seller && (
                <Card className="p-4">
                  <Heading size="4" className="mb-4">
                    Sælger Information
                  </Heading>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Text className="font-medium text-gray-700">
                          {listing.seller.name.charAt(0).toUpperCase()}
                        </Text>
                      </div>
                      <Text className="font-medium">{listing.seller.name}</Text>
                    </div>
                    {listing.seller.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={18} />
                        <Text>{listing.seller.location}</Text>
                      </div>
                    )}
                    {listing.seller.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={18} />
                        <Text>{listing.seller.phone}</Text>
                      </div>
                    )}
                    {listing.seller.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={18} />
                        <Text>{listing.seller.email}</Text>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600 pt-2 border-t">
                      <Calendar size={18} />
                      <Text>
                        Oprettet{" "}
                        {new Date(listing.createdAt).toLocaleDateString(
                          "da-DK"
                        )}
                      </Text>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Card>
      </div>
    </ContentPage>
  );
};

export default ListingDetails;
