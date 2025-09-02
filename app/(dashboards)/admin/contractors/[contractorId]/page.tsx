import { getaccessToken } from "@/app/lib/actions";
import { getContractorDetails } from "@/app/lib/services/contractorService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  params: Promise<{ contractorId: string }>;
};

function Stars({ avg }: { avg: string | null }) {
  if (!avg) return <span className="text-muted-foreground">-</span>;
  const n = Math.round(parseFloat(avg));
  const stars = Array.from({ length: 5 }).map((_, i) => (i < n ? "★" : "☆"));
  return <span className="text-yellow-500">{stars.join("")}</span>;
}

function ApprovalBadge({ status }: { status: string | null }) {
  if (!status) return <Badge variant="secondary">Unknown</Badge>;
  const variant =
    status === "approved" ? "default" : status === "pending" ? "secondary" : "destructive";
  return <Badge variant={variant}>{status}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "done"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
      : status === "pending" || status === "waitingForPayment"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
      : status === "accepted"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
      : status === "declined" || status === "expired"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
      : "bg-muted text-foreground";
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>{status}</span>;
}

export default async function ContractorDetailsPage({ params }: Props) {
  const { contractorId } = await params;
  const accessToken = await getaccessToken();
  const contractor = await getContractorDetails(accessToken, contractorId);


  console.log("contractor response", contractor);
  const categoryNameById =
    contractor.categories?.reduce<Record<string, string>>((acc, c) => {
      acc[c.id] = c.name;
      return acc;
    }, {}) ?? {};

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="relative rounded-xl border overflow-hidden">
        <div
          className="h-40 md:h-56 w-full bg-center bg-cover"
          style={{
            backgroundImage: `url(${contractor.headerImageUrl || ""})`,
            backgroundColor: "hsl(var(--muted))",
          }}
        />
        <div className="p-4 md:p-6">
          <div className="-mt-12 md:-mt-16 flex items-end gap-4">
            <Avatar className="h-24 w-24 ring-4 ring-background">
              <AvatarImage src={contractor.imageUrl ?? undefined} alt={contractor.name} />
              <AvatarFallback>
                {contractor.name?.slice(0, 2).toUpperCase() || "CO"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{contractor.name}</h1>
              <div className="text-sm text-muted-foreground">
                {contractor.email} • {contractor.phone}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <ApprovalBadge status={contractor.approvalStatus} />
                <Badge variant={contractor.stripeConnected ? "default" : "secondary"}>
                  {contractor.stripeConnected ? "Stripe Connected" : "Stripe Not Connected"}
                </Badge>
                <Badge variant="secondary">
                  Reviews: {contractor.reviewAverage ?? "-"} ({Math.round(contractor.reviewCount ?? 0)})
                </Badge>
                <Badge variant="secondary">
                  Notifications: {contractor.notificationsCount ?? 0}
                </Badge>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-3 text-sm">
            {contractor.website ? (
              <a
                className="underline underline-offset-4"
                href={contractor.website.startsWith("http") ? contractor.website : `https://${contractor.website}`}
                target="_blank"
                rel="noreferrer"
              >
                {contractor.website}
              </a>
            ) : (
              <span className="text-muted-foreground">No website</span>
            )}
            <span className="text-muted-foreground">•</span>
            <span>
              {[contractor.addressStreet, contractor.addressZip, contractor.addressCountry]
                .filter(Boolean)
                .join(", ") || "No address"}
            </span>
          </div>
        </div>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Company</h2>
          <div className="space-y-1 text-sm">
            <div>Business ID: {contractor.businessId ?? "-"}</div>
            <div>Type: {contractor.businessType ?? "-"}</div>
            <div>Approval: {contractor.approvalStatus ?? "-"}</div>
            <div>Created: {new Date(contractor.createdAt).toLocaleDateString()}</div>
            <div>Updated: {new Date(contractor.updatedAt).toLocaleDateString()}</div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-2">Banking & Stripe</h2>
          <div className="space-y-1 text-sm">
            <div>IBAN: {contractor.iban ?? "-"}</div>
            <div>BIC: {contractor.bic ?? "-"}</div>
            <div>Stripe Account ID: {contractor.stripeAccountId ?? "-"}</div>
            <div>Connect ID: {contractor.stripeConnectAccountId ?? "-"}</div>
            <div>
              Status:{" "}
              <span className="align-middle">
                <Badge variant={contractor.stripeConnected ? "default" : "secondary"}>
                  {contractor.stripeConnected ? "Connected" : "Not Connected"}
                </Badge>
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-2">Stats</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Stars avg={contractor.reviewAverage} />
              <span>
                {contractor.reviewAverage ?? "-"} ({Math.round(contractor.reviewCount ?? 0)})
              </span>
            </div>
            <div>Total orders: {contractor.orders?.length ?? 0}</div>
            <div>Express orders: {contractor.expressOrders?.length ?? 0}</div>
            <div>Offers: {contractor.offers?.length ?? 0}</div>
            <div>Notifications: {contractor.notificationsCount ?? 0}</div>
          </div>
        </Card>
      </div>

      {/* Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {contractor.categories?.length ? (
              contractor.categories.map((cat) => (
                <Badge key={cat.id} variant="secondary">{cat.name}</Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No categories</span>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-3">Cities</h2>
          <div className="flex flex-wrap gap-2">
            {contractor.cities?.length ? (
              contractor.cities.map((city) => (
                <Badge key={city.id} variant="secondary">{city.cityName}</Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No cities</span>
            )}
          </div>
        </Card>
      </div>

      {/* Reviews */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Reviews ({contractor.reviews?.length ?? 0})</h2>
        {contractor.reviews?.length ? (
          <div className="space-y-4">
            {contractor.reviews.map((r) => (
              <div key={r.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.reviewTitle || "Review"}</div>
                  <div className="text-sm">
                    <StatusBadge status="done" />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>Rating:</span>
                  <span className="text-yellow-500">
                    {"★".repeat(r.starRating) + "☆".repeat(Math.max(0, 5 - r.starRating))}
                  </span>
                </div>
                <div className="mt-2 text-sm">{r.review}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No reviews</div>
        )}
      </Card>

      {/* Orders */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Orders ({contractor.orders?.length ?? 0})</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(contractor.orders ?? []).map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}…</TableCell>
                <TableCell><StatusBadge status={o.status} /></TableCell>
                <TableCell>{o.categoryId ? categoryNameById[o.categoryId] ?? o.categoryId : "-"}</TableCell>
                <TableCell>{o.budget ?? "-"}</TableCell>
                <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Express Orders */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Express Orders ({contractor.expressOrders?.length ?? 0})</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Day/Time</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(contractor.expressOrders ?? []).map((eo) => (
              <TableRow key={eo.id}>
                <TableCell className="font-mono text-xs">{eo.id.slice(0, 8)}…</TableCell>
                <TableCell><StatusBadge status={eo.status} /></TableCell>
                <TableCell>{categoryNameById[eo.categoryId] ?? eo.categoryId}</TableCell>
                <TableCell className="text-xs">
                  {eo.chosenDay ?? "-"} {eo.chosenStartTime ? `• ${eo.chosenStartTime}` : ""}
                </TableCell>
                <TableCell>{new Date(eo.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Offers */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Offers ({contractor.offers?.length ?? 0})</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(contractor.offers ?? []).map((of) => (
              <TableRow key={of.id}>
                <TableCell className="font-mono text-xs">{of.id.slice(0, 8)}…</TableCell>
                <TableCell>
                  <span className="uppercase text-xs tracking-wide">
                    {of.status}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs">{of.orderId.slice(0, 8)}…</TableCell>
                <TableCell>{categoryNameById[of.categoryId] ?? of.categoryId}</TableCell>
                <TableCell>
                  {of.offerPrice ?? "-"}
                  {of.materialCost ? ` (materials: ${of.materialCost})` : ""}
                </TableCell>
                <TableCell>{new Date(of.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}