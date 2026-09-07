import { z } from "zod";

export const planFormSchema = z.object({
  title: z.string().min(4, "Enter a plan name."),
  description: z.string().min(40, "Describe the house in more detail."),
  overview: z.string().optional(),
  categoryId: z.string().optional(),
  architecturalStyle: z.string().min(1),
  propertyType: z.string().min(1),
  price: z.coerce.number().min(1, "Set a price."),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  floors: z.coerce.number().int().min(1),
  floorArea: z.coerce.number().min(200),
  lotWidth: z.coerce.number().optional(),
  lotDepth: z.coerce.number().optional(),
  garageSpaces: z.coerce.number().int().min(0),
  includedItems: z.string().optional(),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;
