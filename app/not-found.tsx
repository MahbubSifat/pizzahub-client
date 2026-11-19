import Link from "next/link";
import Logo from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
      <Logo />
      <p className="font-heading text-8xl font-semibold text-primary">404</p>
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold">This slice is missing</h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist or was moved.
        </p>
      </div>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        Back to Home
      </Link>
    </main>
  );
}