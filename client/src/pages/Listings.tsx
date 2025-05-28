import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, Text, Select } from "@radix-ui/themes";
import axios from "axios";
import config from "../config";
import ContentPage from "../components/ContentPage";
import ListingCard from "../components/ListingCard";
import Button from "../components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Listing } from "../types/listing";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const sortOptions = [
  { value: "date-desc", label: "Nyeste først" },
  { value: "date-asc", label: "Ældste først" },
  { value: "price-desc", label: "Højeste pris først" },
  { value: "price-asc", label: "Laveste pris først" },
];

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const brand = searchParams.get("brand") || "";
  const model = searchParams.get("model") || "";
  const yearFrom = searchParams.get("yearFrom") || "";
  const yearTo = searchParams.get("yearTo") || "";
  const priceFrom = searchParams.get("priceFrom") || "";
  const priceTo = searchParams.get("priceTo") || "";
  const page = searchParams.get("page") || "1";
  const sort = searchParams.get("sort") || "date-desc";

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
            page,
            sort,
          },
        });
        setListings(response.data.listings);
        setPagination(response.data.pagination);
      } catch (err) {
        setError("Failed to fetch listings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [brand, model, yearFrom, yearTo, priceFrom, priceTo, page, sort]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const handleSortChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set("sort", value);
      prev.set("page", "1");
      return prev;
    });
  };

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
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Text size="3" className="text-gray-600">
              {pagination.total}{" "}
              {pagination.total === 1 ? "bil fundet" : "biler fundet"}
            </Text>
            <Select.Root value={sort} onValueChange={handleSortChange}>
              <Select.Trigger className="min-w-[200px]" />
              <Select.Content>
                {sortOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <Text>Ingen biler fundet med de valgte filtre</Text>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="!border-gray-300 !text-gray-900 hover:!bg-gray-100 hover:!border-gray-400 hover:!text-gray-900"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronLeft size={16} className="flex-shrink-0" />
                  <span>Forrige</span>
                </div>
              </Button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={
                      pageNum === pagination.page ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={
                      pageNum === pagination.page
                        ? ""
                        : "!border-gray-300 !text-gray-900 hover:!bg-gray-100 hover:!border-gray-400 hover:!text-gray-900"
                    }
                  >
                    {pageNum}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="!border-gray-300 !text-gray-900 hover:!bg-gray-100 hover:!border-gray-400 hover:!text-gray-900"
              >
                <div className="flex items-center gap-1.5">
                  <span>Næste</span>
                  <ChevronRight size={16} className="flex-shrink-0" />
                </div>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </ContentPage>
  );
};

export default Listings;
