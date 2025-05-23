import { useState, useEffect } from "react";
import { Heading, Button } from "@radix-ui/themes";
import * as Select from "@radix-ui/react-select";
import * as Slider from "@radix-ui/react-slider";
import { Search, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

const Home = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [yearRange, setYearRange] = useState<number[]>([2000, currentYear + 1]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
  const [listingCount, setListingCount] = useState<number>(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("da-DK").format(price);
  };

  const resetYearRange = () => setYearRange([2000, currentYear + 1]);
  const resetPriceRange = () => setPriceRange([0, 10000000]);

  useEffect(() => {
    const fetchListingCount = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedBrand) params.set("brand", selectedBrand);
        if (selectedModel) params.set("model", selectedModel);
        if (yearRange[0] !== 2000)
          params.set("yearFrom", yearRange[0].toString());
        if (yearRange[1] !== currentYear + 1)
          params.set("yearTo", yearRange[1].toString());
        if (priceRange[0] !== 0)
          params.set("priceFrom", priceRange[0].toString());
        if (priceRange[1] !== 10000000)
          params.set("priceTo", priceRange[1].toString());

        const response = await axios.get(`${config.apiUrl}/listings/count`, {
          params,
        });
        setListingCount(response.data.count);
      } catch (error) {
        console.error("Error fetching listing count:", error);
        setListingCount(0);
      }
    };

    fetchListingCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand, selectedModel, yearRange, priceRange]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedModel) params.set("model", selectedModel);
    if (yearRange[0] !== 2000) params.set("yearFrom", yearRange[0].toString());
    if (yearRange[1] !== currentYear + 1)
      params.set("yearTo", yearRange[1].toString());
    if (priceRange[0] !== 0) params.set("priceFrom", priceRange[0].toString());
    if (priceRange[1] !== 10000000)
      params.set("priceTo", priceRange[1].toString());

    navigate(`/listings?${params.toString()}`);
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

  return (
    <div className="relative min-h-screen w-full">
      <div className="h-[100vh] relative overflow-hidden">
        <img
          src="https://images5.alphacoders.com/119/1190539.jpg"
          alt="Luxury car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-4 relative">
          <div className="flex flex-col items-center justify-center gap-16 -translate-y-20">
            <div className="flex flex-col items-center">
              <Heading
                align="center"
                size="9"
                weight="bold"
                className="text-white"
              >
                #1 markedsplads for sportsbiler
              </Heading>
              <p className="text-gray-200 mt-3 text-lg">
                Din destination for luksus- og high-performance biler. Fra
                Porsche til Ferrari - find eller sælg din næste drømmebil her
              </p>
            </div>

            <div className="bg-white rounded-2xl md:rounded-full border md:pl-2 border-white/20 overflow-hidden w-full max-w-4xl shadow-xl">
              <div className="flex flex-col">
                <div className="flex flex-col md:flex-row">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200 flex-1">
                    <div className="relative">
                      <Select.Root
                        value={selectedBrand}
                        onValueChange={(value) => {
                          setSelectedBrand(value);
                          setSelectedModel("");
                        }}
                      >
                        <Select.Trigger className="inline-flex flex-col items-start justify-center px-4 py-4 md:py-3 text-base w-full bg-white hover:bg-gray-50 focus:outline-none">
                          <span className="font-semibold text-sm">Mærke</span>
                          <div className="text-[inherit] text-gray-500 mt-1 pr-6">
                            {selectedBrand
                              ? brands.find((b) => b.value === selectedBrand)
                                  ?.label
                              : "Vælg mærke"}
                          </div>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content
                            className="overflow-hidden bg-white/95 backdrop-blur-sm rounded-md shadow-lg border border-white/20 z-50"
                            position="popper"
                            sideOffset={5}
                            style={{
                              minWidth: "var(--radix-select-trigger-width)",
                            }}
                          >
                            <Select.Viewport className="p-1">
                              {brands.map((brand) => (
                                <Select.Item
                                  key={brand.value}
                                  value={brand.value}
                                  className="relative flex items-center px-4 py-3 text-base rounded-md cursor-pointer select-none outline-none data-[highlighted]:bg-black/5"
                                >
                                  <Select.ItemText>
                                    {brand.label}
                                  </Select.ItemText>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                      {selectedBrand && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBrand("");
                            setSelectedModel("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedBrand("");
                              setSelectedModel("");
                            }
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full cursor-pointer z-10"
                          aria-label="Clear brand selection"
                        >
                          <X size={14} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <Select.Root
                        value={selectedModel}
                        onValueChange={setSelectedModel}
                        disabled={!selectedBrand}
                      >
                        <Select.Trigger className="inline-flex flex-col items-start justify-center px-4 py-4 md:py-3 text-base w-full bg-white hover:bg-gray-50 focus:outline-none">
                          <span className="font-semibold text-sm">Model</span>
                          <div
                            className={cn(
                              "text-[inherit] mt-1 pr-6",
                              !selectedModel || !selectedBrand
                                ? "text-gray-500"
                                : "text-gray-500",
                              !selectedBrand && "opacity-50"
                            )}
                          >
                            {selectedModel
                              ? models[
                                  selectedBrand as keyof typeof models
                                ].find((m) => m.value === selectedModel)?.label
                              : "Vælg model"}
                          </div>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content
                            className="overflow-hidden bg-white/95 backdrop-blur-sm rounded-md shadow-lg border border-white/20 z-50"
                            position="popper"
                            sideOffset={5}
                            style={{
                              minWidth: "var(--radix-select-trigger-width)",
                            }}
                          >
                            <Select.Viewport className="p-1">
                              {selectedBrand &&
                                models[
                                  selectedBrand as keyof typeof models
                                ].map((model) => (
                                  <Select.Item
                                    key={model.value}
                                    value={model.value}
                                    className="relative flex items-center px-4 py-3 text-base rounded-md cursor-pointer select-none outline-none data-[highlighted]:bg-black/5"
                                  >
                                    <Select.ItemText>
                                      {model.label}
                                    </Select.ItemText>
                                  </Select.Item>
                                ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                      {selectedModel && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModel("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedModel("");
                            }
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full cursor-pointer z-10"
                          aria-label="Clear model selection"
                        >
                          <X size={14} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    <Select.Root>
                      <Select.Trigger className="inline-flex flex-col items-start justify-center px-4 py-4 md:py-3 text-base w-full bg-white hover:bg-gray-50 focus:outline-none">
                        <span className="font-semibold text-sm">Årgang</span>
                        <div className="text-[inherit] text-gray-500 mt-1">
                          {yearRange[0] === 2000 &&
                          yearRange[1] === currentYear + 1
                            ? "Alle årgange"
                            : `${yearRange[0]} - ${yearRange[1]}`}
                        </div>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          className="overflow-hidden bg-white/95 backdrop-blur-sm rounded-md shadow-lg border border-white/20 z-50"
                          position="popper"
                          sideOffset={5}
                          style={{
                            minWidth: "var(--radix-select-trigger-width)",
                          }}
                        >
                          <Select.Viewport className="p-4">
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">Årgang</span>
                                {(yearRange[0] !== 2000 ||
                                  yearRange[1] !== currentYear + 1) && (
                                  <button
                                    onClick={resetYearRange}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                  >
                                    Nulstil
                                  </button>
                                )}
                              </div>
                              <div className="flex gap-6">
                                <div className="flex flex-col gap-1.5 flex-1">
                                  <span className="text-sm text-gray-500">
                                    Fra
                                  </span>
                                  <input
                                    type="number"
                                    value={yearRange[0]}
                                    onChange={(e) =>
                                      setYearRange([
                                        Number(e.target.value),
                                        yearRange[1],
                                      ])
                                    }
                                    min={2000}
                                    max={yearRange[1]}
                                    className="w-full px-4 py-3 text-base border border-gray-200 rounded focus:outline-none"
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1">
                                  <span className="text-sm text-gray-500">
                                    Til
                                  </span>
                                  <input
                                    type="number"
                                    value={yearRange[1]}
                                    onChange={(e) =>
                                      setYearRange([
                                        yearRange[0],
                                        Number(e.target.value),
                                      ])
                                    }
                                    min={yearRange[0]}
                                    max={currentYear + 1}
                                    className="w-full px-4 py-3 text-base border border-gray-200 rounded focus:outline-none"
                                  />
                                </div>
                              </div>
                              <Slider.Root
                                className="relative flex items-center select-none touch-none w-full h-5 mt-6"
                                value={yearRange}
                                min={2000}
                                max={currentYear + 1}
                                step={1}
                                onValueChange={setYearRange}
                              >
                                <Slider.Track className="bg-gray-200 relative grow rounded-full h-1.5">
                                  <Slider.Range className="absolute bg-gray-800 rounded-full h-full" />
                                </Slider.Track>
                                <Slider.Thumb
                                  className="block w-4 h-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                  aria-label="Year minimum"
                                />
                                <Slider.Thumb
                                  className="block w-4 h-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                  aria-label="Year maximum"
                                />
                              </Slider.Root>
                            </div>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>

                    <Select.Root>
                      <Select.Trigger className="inline-flex flex-col items-start justify-center px-4 py-4 md:py-3 text-base w-full bg-white hover:bg-gray-50 focus:outline-none">
                        <span className="font-semibold text-sm">Pris</span>
                        <div className="text-[inherit] text-gray-500 mt-1">
                          {priceRange[0] === 0 && priceRange[1] === 10000000
                            ? "Alle priser"
                            : `${formatPrice(priceRange[0])} - ${formatPrice(
                                priceRange[1]
                              )}`}
                        </div>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          className="overflow-hidden bg-white/95 backdrop-blur-sm rounded-md shadow-lg border border-white/20 z-50"
                          position="popper"
                          sideOffset={5}
                          style={{
                            minWidth: "var(--radix-select-trigger-width)",
                          }}
                        >
                          <Select.Viewport className="p-4 w-[350px]">
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">Pris</span>
                                {(priceRange[0] !== 0 ||
                                  priceRange[1] !== 10000000) && (
                                  <button
                                    onClick={resetPriceRange}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                  >
                                    Nulstil
                                  </button>
                                )}
                              </div>
                              <div className="flex gap-6">
                                <div className="flex flex-col gap-1.5 flex-1">
                                  <span className="text-sm text-gray-500">
                                    Fra
                                  </span>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={new Intl.NumberFormat(
                                        "da-DK"
                                      ).format(priceRange[0])}
                                      onChange={(e) => {
                                        const value = Number(
                                          e.target.value.replace(/\D/g, "")
                                        );
                                        setPriceRange([value, priceRange[1]]);
                                      }}
                                      className="w-full px-4 py-3 text-base border border-gray-200 rounded focus:outline-none"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                      kr
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1">
                                  <span className="text-sm text-gray-500">
                                    Til
                                  </span>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={new Intl.NumberFormat(
                                        "da-DK"
                                      ).format(priceRange[1])}
                                      onChange={(e) => {
                                        const value = Number(
                                          e.target.value.replace(/\D/g, "")
                                        );
                                        setPriceRange([priceRange[0], value]);
                                      }}
                                      className="w-full px-4 py-3 text-base border border-gray-200 rounded focus:outline-none"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                      kr
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Slider.Root
                                className="relative flex items-center select-none touch-none w-full h-5 mt-6"
                                value={priceRange}
                                min={0}
                                max={10000000}
                                step={10000}
                                onValueChange={setPriceRange}
                              >
                                <Slider.Track className="bg-gray-200 relative grow rounded-full h-1.5">
                                  <Slider.Range className="absolute bg-gray-800 rounded-full h-full" />
                                </Slider.Track>
                                <Slider.Thumb
                                  className="block w-4 h-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                  aria-label="Price minimum"
                                />
                                <Slider.Thumb
                                  className="block w-4 h-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                  aria-label="Price maximum"
                                />
                              </Slider.Root>
                            </div>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 md:p-2 border-t md:border-t-0 md:border-l border-gray-200">
                    <Button
                      className="w-full md:w-auto px-8 py-3 md:py-2 rounded-xl md:rounded-full flex items-center justify-center gap-2 h-full"
                      size="3"
                      onClick={handleSearch}
                      disabled={listingCount === 0}
                    >
                      <Search size={16} /> <span>Søg {listingCount} biler</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
