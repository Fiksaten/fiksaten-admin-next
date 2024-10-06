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
import { buildApiUrl } from "../lib/utils";

export default function DeleteMyData() {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const url = buildApiUrl("request-account-deletion");
    const body = {
      email,
      firstName,
      lastName,
      reason,
    };
    console.log(body);

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    setIsSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Delete My Data</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>App Information</CardTitle>
          <CardDescription>
            Details about our apps and developer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Apps:</strong> Fiksaten, Fiksaten Pro, and other Fiksaten
            branded apps and services.
          </p>
          <p>
            <strong>Developer:</strong> Fiksaten Group oy, Fiksaten
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Deletion Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p>When you request to delete your account:</p>
          <ul className="list-disc list-inside mt-2">
            <li>
              All of your personal data will be permanently deleted from our
              systems.
            </li>
            <li>We do not retain any user data after account deletion.</li>
            <li>
              The deletion process may take up to 14 days to complete across all
              our systems.
            </li>
          </ul>
        </CardContent>
      </Card>

      {!isSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle>Request Account Deletion</CardTitle>
            <CardDescription>
              Please fill out this form to request the deletion of your account
              and associated data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Your first name"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Your last name"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason for Deletion (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Please tell us why you're deleting your account"
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
                  <span>
                    I understand that this action is irreversible and all my
                    data will be permanently deleted.
                  </span>
                </Label>
              </div>
              <Button type="submit" className="w-full">
                Request Account Deletion
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertTitle>Deletion Request Submitted</AlertTitle>
          <AlertDescription>
            Your account deletion request has been received. We will process
            your request within 14 days. You will receive a confirmation email
            once the deletion is complete.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
