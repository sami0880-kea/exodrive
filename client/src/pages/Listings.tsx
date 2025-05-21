import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Heading, Card, Text } from "@radix-ui/themes";
import axios from "axios";
import config from "../config";
import ContentPage from "../components/ContentPage";
import ListingCard from "../components/ListingCard";
import { Listing } from "../types/listing";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const brand = searchParams.get("brand") || "";
  const model = searchParams.get("model") || "";
  const yearFrom = searchParams.get("yearFrom") || "";
  const yearTo = searchParams.get("yearTo") || "";
  const priceFrom = searchParams.get("priceFrom") || "";
  const priceTo = searchParams.get("priceTo") || "";

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.apiUrl}/listings`, {
          params: {
            brand,
            model,
            yearFrom,
            yearTo,
            priceFrom,
            priceTo,
          },
        });
        setListings(response.data);
      } catch (err) {
        setError("Failed to fetch listings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [brand, model, yearFrom, yearTo, priceFrom, priceTo]);

  if (loading) {
    return (
      <ContentPage>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Text>Loading...</Text>
        </div>
      </ContentPage>
    );
  }

  if (error) {
    return (
      <ContentPage>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Text className="text-red-500">{error}</Text>
        </div>
      </ContentPage>
    );
  }

  return (
    <ContentPage>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Heading size="8" className="mb-8">
          {listings.length} biler fundet
        </Heading>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>

          {listings.length === 0 && (
            <div className="text-center py-12">
              <Text>Ingen biler fundet med de valgte filtre</Text>
            </div>
          )}
        </Card>
      </div>
    </ContentPage>
  );
};

export default Listings;
