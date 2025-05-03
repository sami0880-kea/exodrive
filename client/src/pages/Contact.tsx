import { Mail, Send, User } from "lucide-react";
import * as Form from "@radix-ui/react-form";
import { Button, Heading, Text, TextField, TextArea } from "@radix-ui/themes";
import ContentPage from "../components/ContentPage";

const Contact = () => {
  return (
    <ContentPage>
      <Heading size="7" align="center" mb="6">
        Kontakt os
      </Heading>
      <div className="flex flex-col gap-6 max-w-xl mx-auto">
        <Form.Root>
          <Form.Field name="name" className="grid mb-4">
            <Form.Label>
              <Text size="2" weight="medium">
                Navn
              </Text>
            </Form.Label>
            <div className="relative w-full">
              <Form.Control asChild>
                <TextField.Root placeholder="Navn" size="3">
                  <TextField.Slot>
                    <User size={16} />
                  </TextField.Slot>
                </TextField.Root>
              </Form.Control>
            </div>
          </Form.Field>

          <Form.Field name="email" className="grid mb-4">
            <Form.Label>
              <Text size="2" weight="medium">
                Email
              </Text>
            </Form.Label>
            <div className="relative w-full">
              <Form.Control asChild>
                <TextField.Root placeholder="Email" size="3" type="email">
                  <TextField.Slot>
                    <Mail size={16} />
                  </TextField.Slot>
                </TextField.Root>
              </Form.Control>
            </div>
          </Form.Field>

          <Form.Field name="message" className="grid mb-4">
            <Form.Label>
              <Text size="2" weight="medium">
                Besked
              </Text>
            </Form.Label>
            <Form.Control asChild>
              <TextArea rows={6} placeholder="Din besked" size="3" />
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <Button type="submit" size="3" className="w-full">
              <Send size={16} className="mr-2" />
              <span>Send besked</span>
            </Button>
          </Form.Submit>
        </Form.Root>
      </div>
    </ContentPage>
  );
};

export default Contact;
