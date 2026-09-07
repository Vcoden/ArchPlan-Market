import { EmptyState } from "@/components/marketplace/empty-state";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth/session";
import { buyerOrders, findPlan, readStore } from "@/lib/data/store";

export default async function DownloadsPage() {
  const profile = await getCurrentProfile();
  const store = await readStore();
  const paid = profile
    ? buyerOrders(store, profile.id).filter((order) => order.payment_status === "succeeded")
    : [];
  const files = paid.flatMap((order) =>
    order.items.flatMap((item) => {
      const plan = findPlan(store, item.plan_id);
      return (plan?.files ?? []).map((file) => ({ file, plan, orderId: order.id }));
    }),
  );

  return (
    <div>
      <h1 className="font-display text-4xl">Downloads</h1>
      <p className="mt-2 text-muted-foreground">
        Original files are only available after a successful purchase.
      </p>
      <div className="mt-8 space-y-4">
        {files.length ? (
          files.map(({ file, plan }) => (
            <div key={file.id} className="flex items-center justify-between rounded-xl border bg-card p-4">
              <div>
                <p className="font-medium">{plan?.title}</p>
                <p className="text-sm text-muted-foreground">{file.file_name}</p>
              </div>
              <Button asChild>
                <a href={`/api/downloads/${file.id}`}>Download Files</a>
              </Button>
            </div>
          ))
        ) : (
          <EmptyState title="No downloads yet." description="Buy a plan to unlock CAD and PDF files." />
        )}
      </div>
    </div>
  );
}
