import { JsonForm } from "@/components/forms/json-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentProfile } from "@/lib/auth/session";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-4xl">Profile</h1>
      <div className="mt-8">
        <JsonForm action="/api/profile" success="Profile saved.">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" defaultValue={profile?.full_name ?? ""} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" defaultValue={profile?.country ?? ""} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" defaultValue={profile?.bio ?? ""} className="mt-2" />
          </div>
        </JsonForm>
      </div>
    </div>
  );
}
