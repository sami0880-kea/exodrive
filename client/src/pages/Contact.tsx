import {
  Container,
  Heading,
  Field,
  Input,
  Textarea,
  Button,
  VStack,
  InputGroup,
} from "@chakra-ui/react";
import { Mail, Send, User } from "lucide-react";

const Contact = () => {
  return (
    <Container maxW="container.xl" py={10}>
      <Heading className="mb-8 text-center font-bold text-4xl">
        Kontakt os
      </Heading>
      <VStack gap={6} className="max-w-xl mx-auto">
        <Field.Root>
          <Field.Label className="text-white">Navn</Field.Label>
          <InputGroup startElement={<User size={16} />}>
            <Input
              type="text"
              border="1px solid"
              variant="outline"
              px={4}
              borderColor="whiteAlpha.300"
              _hover={{ borderColor: "red.500" }}
              _focus={{
                borderColor: "red.500",
                boxShadow: "0 0 0 1px #ef4444",
                outline: "none",
              }}
            />
          </InputGroup>
        </Field.Root>
        <Field.Root>
          <Field.Label className="text-white">Email</Field.Label>
          <InputGroup startElement={<Mail size={16} />}>
            <Input
              type="email"
              border="1px solid"
              borderColor="whiteAlpha.300"
              _hover={{ borderColor: "red.500" }}
              _focus={{
                borderColor: "red.500",
                boxShadow: "0 0 0 1px #ef4444",
                outline: "none",
              }}
            />
          </InputGroup>
        </Field.Root>
        <Field.Root>
          <Field.Label className="text-white">Besked</Field.Label>
          <Textarea
            rows={6}
            border="1px solid"
            variant="outline"
            borderColor="whiteAlpha.300"
            p={2}
            _hover={{ borderColor: "red.500" }}
            _focus={{
              borderColor: "red.500",
              boxShadow: "0 0 0 1px #ef4444",
              outline: "none",
            }}
          />
        </Field.Root>
        <Button
          className="w-full"
          bgGradient="to-r"
          gradientFrom="red.500"
          gradientTo="red.700"
          color="white"
          _hover={{
            opacity: 0.9,
            transform: "translateY(-1px)",
          }}
          transition="all 0.2s"
        >
          <Send size={16} />
          Send besked
        </Button>
      </VStack>
    </Container>
  );
};

export default Contact;
