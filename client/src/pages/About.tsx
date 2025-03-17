import { Container, Heading, Text, VStack } from "@chakra-ui/react";

const About = () => {
  return (
    <Container maxW="container.xl" py={10}>
      <Heading className="mb-8 text-center font-bold text-4xl">Om os</Heading>{" "}
      <VStack gap={6} align="center">
        <Text className="text-lg">Bla bla bla...</Text>
        <Text className="text-lg">Bla bla bla...</Text>
      </VStack>
    </Container>
  );
};

export default About;
