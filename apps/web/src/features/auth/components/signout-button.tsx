"use client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

type Props = {
  className?: string;
};

export function SignoutButton({ className }: Props) {
  const [loading, setLoading] = useState(false);
  const toastId = useId();
  const router = useRouter();

  const handleSignout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest() {
          setLoading(true);
          toast.loading("User signing out...", { id: toastId });
        },
        onSuccess() {
          toast.success("Signed out successfully !", { id: toastId });
          setLoading(false);
          router.refresh();
        },
        onError(ctx) {
          setLoading(false);
          toast.error(ctx.error.message, { id: toastId });
        }
      }
    });
  };

  return (
    <Button
      icon={<LogOutIcon />}
      loading={loading}
      className={cn("", className)}
      onClick={handleSignout}
    >
      Signout
    </Button>
  );
}
