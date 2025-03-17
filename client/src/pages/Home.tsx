import { Container, Heading, Text, Box } from "@chakra-ui/react";

const Home = () => {
  return (
    <Container maxW="container.xl" py={10}>
      <Heading className="mb-8 text-center font-bold text-4xl">Hjem</Heading>
      <Box className="flex flex-col items-center justify-center">
        <Heading
          as="h1"
          className="text-4xl md:text-5xl font-bold mb-6"
          color="white"
          bgGradient="linear(to-r, red.500, red.700)"
          bgClip="text"
          display="inline-block"
        >
          Velkommen til ExoDrive
        </Heading>
        <Text className="text-lg mb-8 text-gray-200">Text...</Text>
      </Box>
    </Container>
  );
};

export default Home;
