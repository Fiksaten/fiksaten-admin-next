"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { buildApiUrl } from "@/app/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { ContractorData } from "@/app/lib/types";
import Image from "next/image";

type CompanyInfoFields = {
  contractorName: string;
  businessId: string;
  companyPhone: string;
  companyEmail: string;
  companyDescription: string;
  contractorIban: string;
  contractorBic: string;
};

type UserInfoFields = {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
};

export default function UserSettings({
  accessToken,
  contractorData,
}: {
  accessToken: string;
  contractorData: ContractorData;
}) {
  const { user } = useAuth();

  const [userInfo, setUserInfo] = useState<UserInfoFields>({
    firstname: user ? user.firstname : "",
    lastname: user ? user.lastname : "",
    email: user ? user.email : "",
    phoneNumber: user ? user.phoneNumber : "",
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfoFields>({
    contractorName: contractorData ? contractorData.contractorName : "",
    businessId: contractorData ? contractorData.contractorBusinessId! : "",
    companyPhone: contractorData ? contractorData.contractorPhone : "",
    companyEmail: contractorData ? contractorData.contractorEmail : "",
    companyDescription: contractorData
      ? contractorData.contractorDescription
      : "",
    contractorIban: contractorData ? contractorData.contractorIban : "",
    contractorBic: contractorData ? contractorData.contractorBic : "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchSignedUrl = async (
    fileType: string,
    fileName: string
  ): Promise<string> => {
    console.log("File type:", fileType);

    try {
      const url = buildApiUrl(
        `/images/signed-url?fileType=${fileType}&fileName=${fileName}`
      );
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Signed URL:", data.url);
      return data.url;
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      throw new Error("Failed to get signed URL");
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const signedUrl = await fetchSignedUrl(file.type, file.name);
      const response = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleCompanyInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value });
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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

  const handleCompanyInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Company Info Submitted:", companyInfo);
    const url = buildApiUrl("/contractors/me");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(companyInfo),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Company Info Updated:", data);
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileImage) {
      await uploadImage(profileImage);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-black">User Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Profile Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleImageDrop}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile"
                className="mx-auto h-32 w-32 rounded-full object-cover"
              />
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop your profile image here, or click to select
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              id="profile-image-upload"
            />
            <Label htmlFor="profile-image-upload" className="mt-4 inline-block">
              <Button type="button">Select Image</Button>
            </Label>
          </div>
          <Button
            type="button"
            onClick={handleImageSubmit}
            className="mt-4"
            disabled={!profileImage}
          >
            Upload Image
          </Button>
        </CardContent>
      </Card>

      <Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCompanyInfoSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractorName">Contractor Name</Label>
                <Input
                  id="contractorName"
                  name="contractorName"
                  value={companyInfo.contractorName}
                  onChange={handleCompanyInfoChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessId">Business ID</Label>
                <Input
                  id="businessId"
                  name="businessId"
                  value={companyInfo.businessId}
                  onChange={handleCompanyInfoChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input
                  id="companyPhone"
                  name="companyPhone"
                  value={companyInfo.companyPhone}
                  onChange={handleCompanyInfoChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  value={companyInfo.companyEmail}
                  onChange={handleCompanyInfoChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  name="companyDescription"
                  value={companyInfo.companyDescription}
                  onChange={handleCompanyInfoChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractorIban">IBAN</Label>
                <Input
                  id="contractorIban"
                  name="contractorIban"
                  value={companyInfo.contractorIban}
                  onChange={handleCompanyInfoChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractorBic">BIC</Label>
                <Input
                  id="contractorBic"
                  name="contractorBic"
                  value={companyInfo.contractorBic}
                  onChange={handleCompanyInfoChange}
                  required
                />
              </div>
            </div>
            <Button type="submit">Update Company Info</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
