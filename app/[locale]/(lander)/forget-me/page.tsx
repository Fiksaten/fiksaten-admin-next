"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requestAccountDeletion } from "@/app/lib/services/userService";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export default function DeleteMyData() {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    redirect("/login");
  }
  const t = useTranslations();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [reason, setReason] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    switch (id) {
      case "email":
        setEmail(value);
        break;
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "reason":
        setReason(value);
        break;
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await requestAccountDeletion(accessToken!, {
      email,
      firstName,
      lastName,
      reason,
    });
    if (res.message) {
      setIsSubmitted(true);
    } else {
      toast({
        title: "Error",
        description: "Failed to request account deletion",
      });
      setIsSubmitted(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">{t("deleteMyData")}</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("appInformation")}</CardTitle>
          <CardDescription>{t("appInformationDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>{t("apps")}:</strong> {t("appsDescription")}
          </p>
          <p>
            <strong>{t("developer")}:</strong> {t("developerDescription")}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("dataDeletionPolicy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("dataDeletionPolicyDescription")}</p>
          <ul className="list-disc list-inside mt-2">
            <li>{t("dataDeletionPolicyDescription1")}</li>
            <li>{t("dataDeletionPolicyDescription2")}</li>
            <li>{t("dataDeletionPolicyDescription3")}</li>
          </ul>
        </CardContent>
      </Card>

      {!isSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("requestAccountDeletion")}</CardTitle>
            <CardDescription>
              {t("requestAccountDeletionDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{t("emailAddress")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="firstName">{t("firstName")}</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder={t("firstNamePlaceholder")}
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t("lastName")}</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder={t("lastNamePlaceholder")}
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="reason">{t("reasonForDeletion")}</Label>
                <Textarea
                  id="reason"
                  placeholder={t("reasonForDeletionPlaceholder")}
                />
              </div>
              <div>
                <Label
                  htmlFor="confirm"
                  className="flex items-center space-x-2"
                >
                  <Input
                    id="confirm"
                    type="checkbox"
                    required
                    className="w-4 h-4"
                  />
                  <span>{t("deletionRequestConfirmation")}</span>
                </Label>
              </div>
              <Button type="submit" className="w-full">
                {t("requestAccountDeletion")}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertTitle>{t("deletionRequestSubmitted")}</AlertTitle>
          <AlertDescription>
            {t("deletionRequestSubmittedDescription")}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
