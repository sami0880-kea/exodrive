import {
  Container,
  SimpleGrid,
  Box,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";

const Cars = () => {
  const cars = [
    {
      id: 1,
      name: "McLaren 720S",
      image:
        "https://pictures.dealer.com/a/astonmartinchicago/0821/abbc56f8660bcc626f9a0fb34e2e89a5x.jpg",
      year: 2022,
      price: "8.500.000 kr",
    },
    {
      id: 2,
      name: "Ferrari SF90 Spider",
      image:
        "https://www.cauleyferrari.com/imagetag/499/61/l/Used-2023-Ferrari-SF90-Spider.jpg",
      year: 2023,
      price: "16.500.000 kr",
    },
    {
      id: 3,
      name: "Lamborghini Urus S",
      image:
        "https://cfwww.hgreg.com/photos/by-size/910607/3648x2048/content.homenetiol.com_2001243_2130496_0x0_17e69c63f1514e40a4fba445431a387a.jpg",
      year: 2025,
      price: "12.800.000 kr",
    },
  ];

  return (
    <Container maxW="container.xl" py={10}>
      <Heading className="mb-8 text-center font-bold text-4xl">
        Biler til salg
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
        {cars.map((car) => (
          <Box
            key={car.id}
            className="rounded-lg border border-neutral-700 hover:border-red-500 transition-all"
          >
            <Image
              src={car.image}
              alt={car.name}
              width="100%"
              height="250px"
              objectFit="cover"
              borderTopLeftRadius={4}
              borderTopRightRadius={4}
            />
            <Box className="p-4">
              <Text className="font-bold text-xl">{car.name}</Text>
              <Text>{car.year}</Text>
              <Text className="text-red-500 font-bold">{car.price}</Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Cars;
