"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  name: string;
  email: string;
  image?: string | null;
  role: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function UserMenu({ name, email, image, role }: Props) {
  const router = useRouter();

  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-full border bg-card py-1 pr-2.5 pl-1 transition-colors outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="size-8">
          {image ? <AvatarImage src={image} alt={name} /> : null}
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {initials(name) || "U"}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-28 truncate text-sm font-medium sm:block">{name}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-2">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
          <p className="mt-1 text-xs font-medium text-primary capitalize">{role}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")} className="gap-2">
          <LayoutDashboard className="size-4" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/${role}/profile`)}
          className="gap-2"
        >
          <Settings className="size-4" /> Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="gap-2 text-destructive">
          <LogOut className="size-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}