import PageHeader from "@/components/dashboard/page-header";
import ProfileForm from "@/components/dashboard/profile-form";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile Settings"
        subtitle="Update your name and photo. Your role and plan are managed by the platform."
      />
      <ProfileForm />
    </>
  );
}