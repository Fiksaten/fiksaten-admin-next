"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  getAllCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "@/app/lib/services/campaignService";
import {
  CreateCampaignData,
  GetAllCampaignsResponses,
} from "@/app/lib/openapi-client";

interface CampaignFormData {
  name: string;
  description: string;
  code: string;
  public: boolean;
}

interface Props {
  campaigns: GetAllCampaignsResponses[200];
  accessToken: string;
}

export default function CampaignAdminTable({
  campaigns: initialCampaigns,
  accessToken,
}: Props) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [open, setOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<
    GetAllCampaignsResponses[200][number] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CampaignFormData>({
    name: "",
    description: "",
    code: "",
    public: false,
  });

  const openCreate = () => {
    setEditCampaign(null);
    setForm({
      name: "",
      description: "",
      code: "",
      public: false,
    });
    setOpen(true);
  };

  const openEdit = (campaign: GetAllCampaignsResponses[200][number]) => {
    setEditCampaign(campaign);
    setForm({
      name: campaign.name,
      description: campaign.description || "",
      code: campaign.code,
      public: campaign.public,
    });
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditCampaign(null);
    setForm({
      name: "",
      description: "",
      code: "",
      public: false,
    });
  };

  const handleInputChange = (
    field: keyof CampaignFormData,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!form.name.trim()) return "Campaign name is required";
    if (!form.code.trim()) return "Campaign code is required";

    // Check for duplicate codes
    const duplicateCode = campaigns.find(
      (campaign) =>
        campaign.code.toLowerCase() === form.code.toLowerCase() &&
        campaign.id !== editCampaign?.id
    );
    if (duplicateCode) return "Campaign code must be unique";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const campaignData: CreateCampaignData["body"] = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        code: form.code.trim(),
        public: form.public,
      };

      if (editCampaign) {
        await updateCampaign(accessToken, editCampaign.id, campaignData);
        // Refresh the campaigns list
        const refreshedCampaigns = await getAllCampaigns(accessToken);
        setCampaigns(refreshedCampaigns);
        toast({ title: "Campaign updated successfully" });
      } else {
        await createCampaign(accessToken, campaignData);
        // Refresh the campaigns list
        const refreshedCampaigns = await getAllCampaigns(accessToken);
        setCampaigns(refreshedCampaigns);
        toast({ title: "Campaign created successfully" });
      }
      closeDialog();
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this campaign? This action cannot be undone."
      )
    )
      return;
    setLoading(true);
    try {
      await deleteCampaign(accessToken, id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Campaign deleted successfully" });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Campaign Management</h2>
          <p className="text-muted-foreground">
            Manage campaign codes and their visibility
          </p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {campaign.code}
                    </code>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {campaign.description || "No description"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={campaign.public ? "default" : "secondary"}>
                      {campaign.public ? "Public" : "Private"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(campaign)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(campaign.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editCampaign ? "Edit Campaign" : "Create New Campaign"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter campaign name"
                required
              />
            </div>

            <div>
              <Label htmlFor="code">Campaign Code *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="Enter unique campaign code"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                This code will be used by customers to apply the campaign
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter campaign description"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={form.public}
                onCheckedChange={(checked) =>
                  handleInputChange("public", checked)
                }
              />
              <Label htmlFor="public">Make campaign publicly visible</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editCampaign
                  ? "Update Campaign"
                  : "Create Campaign"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
