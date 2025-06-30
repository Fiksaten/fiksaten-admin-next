"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildApiUrl } from "@/app/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Link2Icon } from "lucide-react";

type UserInfoFields = {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
};

export default function UserSettings({ accessToken }: { accessToken: string }) {
  const { user } = useAuth();

  const [userInfo, setUserInfo] = useState<UserInfoFields>({
    firstname: user ? user.firstname : "",
    lastname: user ? user.lastname : "",
    email: user ? user.email : "",
    phoneNumber: user ? user.phoneNumber : "",
  });

  const [passwordChangeInfo, setPasswordChangeInfo] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [showOtpFields, setShowOtpFields] = useState(false);

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User Info Submitted:", userInfo);
    const url = buildApiUrl("/users/me");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userInfo),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("User Info Updated:", data);
  };

  const handlePasswordChangeInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordChangeInfo({
      ...passwordChangeInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendEmail = async () => {
    try {
      const url = buildApiUrl("/auth/change-password/request");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email: passwordChangeInfo.email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowOtpFields(true);
      // Optionally, show a success message to the user
    } catch (error) {
      console.error("Error sending email:", error);
      // Optionally, show an error message to the user
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = buildApiUrl("/auth/change-password/confirm");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: passwordChangeInfo.email,
          otp: passwordChangeInfo.otp,
          newPassword: passwordChangeInfo.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset form and state
      setPasswordChangeInfo({ email: "", otp: "", newPassword: "" });
      setShowOtpFields(false);
      // Optionally, show a success message to the user
    } catch (error) {
      console.error("Error changing password:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-black">User Settings</h1>
      <div className="flex flex-row w-full gap-4">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUserInfoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    name="firstname"
                    value={userInfo.firstname}
                    onChange={handleUserInfoChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    name="lastname"
                    value={userInfo.lastname}
                    onChange={handleUserInfoChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userInfo.email}
                    onChange={handleUserInfoChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={userInfo.phoneNumber}
                    onChange={handleUserInfoChange}
                    required
                  />
                </div>
              </div>
              <Button type="submit">Update User Info</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              {!showOtpFields ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={passwordChangeInfo.email || userInfo.email}
                      onChange={handlePasswordChangeInfoChange}
                      required
                    />
                  </div>
                  <Button type="button" onClick={handleSendEmail}>
                    Send Email
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <Input
                      id="otp"
                      name="otp"
                      value={passwordChangeInfo.otp}
                      onChange={handlePasswordChangeInfoChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordChangeInfo.newPassword}
                      onChange={handlePasswordChangeInfoChange}
                      required
                    />
                  </div>
                  <Button type="submit">Submit New Password</Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-row w-full gap-4">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <Switch id="smsNotifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch id="emailNotifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <Switch id="pushNotifications" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Legal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link
                className="flex items-center justify-between"
                href="/terms-and-conditions"
              >
                <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
                <Link2Icon />
              </Link>
              <Link
                className="flex items-center justify-between"
                href="/privacy-policy"
              >
                <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                <Link2Icon />
              </Link>
              <Link
                href="/cookie-policy"
                className="flex items-center justify-between"
              >
                <Label htmlFor="cookiePolicy">Cookie Policy</Label>
                <Link2Icon />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Button variant="destructive">Delete Account</Button>
    </div>
  );
}
