import { useState, useEffect } from "react";
import { Heading, Text, Card, Button, Dialog } from "@radix-ui/themes";
import axios from "axios";
import config from "../config";
import { useAuth } from "../context/AuthContext";
import ContentPage from "../components/ContentPage";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import ListingCard from "../components/ListingCard";
import { Listing } from "../types/listing";
import { toast } from "sonner";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const MyListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.apiUrl}/listings/user/listings?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setListings(response.data.listings);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError("Failed to fetch listings");
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user, pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleEdit = (listingId: string) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const handleDeleteClick = (listingId: string) => {
    setListingToDelete(listingId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return;

    try {
      await axios.delete(`${config.apiUrl}/listings/${listingToDelete}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      toast.success("Annonce slettet");
      fetchListings();
    } catch (err) {
      console.error("Error deleting listing:", err);
      toast.error("Kunne ikke slette annoncen");
    } finally {
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  if (!user) {
    return (
      <ContentPage>
        <div className="max-w-4xl mx-auto px-4 text-center py-12">
          <Heading size="8" className="mb-4">
            Log ind for at se dine annoncer
          </Heading>
          <Text size="4" className="text-gray-600">
            Du skal være logget ind for at se dine annoncer.
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
            <div className="flex items-center gap-4">
              <Text size="3" className="text-gray-600">
                {pagination.total}{" "}
                {pagination.total === 1 ? "annonce" : "annoncer"}
              </Text>
              <Link to="/sell">
                <Button>Opret ny annonce</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="relative group">
                <ListingCard listing={listing} />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="solid"
                    size="2"
                    onClick={() => handleEdit(listing._id)}
                    className="!bg-white !text-gray-900 hover:!bg-gray-100"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="solid"
                    size="2"
                    onClick={() => handleDeleteClick(listing._id)}
                    className="!bg-red-500 !text-white hover:!bg-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <Text>Du har ikke oprettet nogen annoncer endnu</Text>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="2"
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
                    variant={pageNum === pagination.page ? "solid" : "outline"}
                    size="2"
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
                size="2"
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

      <Dialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Bekræft sletning</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Er du sikker på, at du vil slette denne annonce? Denne handling kan
            ikke fortrydes.
          </Dialog.Description>

          <div className="flex justify-end gap-3 mt-4">
            <Dialog.Close>
              <Button variant="outline">Annuller</Button>
            </Dialog.Close>
            <Button variant="solid" color="red" onClick={handleDeleteConfirm}>
              Slet annonce
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </ContentPage>
  );
};

export default MyListings;
