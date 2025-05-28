import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";
import { X, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import TextInput from "../TextInput";
import Button from "../Button";

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
}

const AuthModals = ({
  isOpen,
  onClose,
  initialView = "login",
}: AuthModalsProps) => {
  const [view, setView] = useState<"login" | "register">(initialView);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { login, register } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (view === "register" && !formData.name.trim()) {
      newErrors.name = "Navn er påkrævet";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email er påkrævet";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Indtast venligst en gyldig email";
    }

    if (!formData.password) {
      newErrors.password = "Adgangskode er påkrævet";
    } else if (formData.password.length < 6 && view === "register") {
      newErrors.password = "Adgangskoden skal være mindst 6 tegn";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (view === "login") {
        await login(formData.email, formData.password);
        toast.success("Du er nu logget ind");
      } else {
        await register(formData.name, formData.email, formData.password);
        toast.success("Din konto er blevet oprettet");
      }
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Der skete en fejl";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-md shadow-2xl"
            aria-describedby={undefined}
          >
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-2xl font-semibold">
                {view === "login" ? "Log ind" : "Opret konto"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon">
                  <X size={20} />
                </Button>
              </Dialog.Close>
            </div>

            <Form.Root onSubmit={handleSubmit} className="space-y-4">
              {view === "register" && (
                <Form.Field name="name" className="space-y-2">
                  <Form.Control asChild>
                    <TextInput
                      placeholder="Navn"
                      value={formData.name}
                      icon={User}
                      error={errors.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </Form.Control>
                </Form.Field>
              )}

              <Form.Field name="email" className="space-y-2">
                <Form.Control asChild>
                  <TextInput
                    placeholder="Email"
                    value={formData.email}
                    icon={Mail}
                    error={errors.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field name="password" className="space-y-2">
                <Form.Control asChild>
                  <TextInput
                    type="password"
                    placeholder="Adgangskode"
                    value={formData.password}
                    icon={Lock}
                    error={errors.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </Form.Control>
              </Form.Field>

              <Button variant="default" type="submit" className="w-full">
                {view === "login" ? "Log ind" : "Opret konto"}
              </Button>
            </Form.Root>

            <div className="text-center text-sm text-gray-600 mt-4">
              {view === "login" ? (
                <>
                  Har du ikke en konto?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setView("register");
                      setErrors({});
                    }}
                    className="text-red-500 hover:text-red-600 hover:underline font-medium"
                  >
                    Opret konto
                  </button>
                </>
              ) : (
                <>
                  Har du allerede en konto?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setView("login");
                      setErrors({});
                    }}
                    className="text-red-500 hover:text-red-600 hover:underline font-medium"
                  >
                    Log ind
                  </button>
                </>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default AuthModals;
