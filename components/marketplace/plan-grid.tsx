import { PlanCard } from "@/components/marketplace/plan-card";
import type { Plan } from "@/types";

export function PlanGrid({ plans }: { plans: Plan[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
