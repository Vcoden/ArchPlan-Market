import { JsonForm } from "@/components/forms/json-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentArchitect } from "@/lib/auth/session";

export default async function ArchitectProfileSettingsPage() {
  const architect = await getCurrentArchitect();

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-4xl">Professional profile</h1>
      <div className="mt-8">
        <JsonForm action="/api/architects/profile" success="Profile saved.">
          <div>
            <Label htmlFor="professionalName">Professional name</Label>
            <Input
              id="professionalName"
              name="professionalName"
              defaultValue={architect?.professional_name ?? ""}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={architect?.title ?? ""} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={architect?.location ?? ""} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="biography">Biography</Label>
            <Textarea id="biography" name="biography" defaultValue={architect?.biography ?? ""} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" defaultValue={architect?.website ?? ""} className="mt-2" />
          </div>
        </JsonForm>
      </div>
    </div>
  );
}
