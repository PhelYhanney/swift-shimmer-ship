import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Let Supabase handle the hash/query params automatically
        // This is called after Supabase redirects back from OAuth provider
        
        // Check if there's a session already established
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // Session exists, redirect to admin
          navigate({ to: "/admin" });
          return;
        }

        // Try to exchange code if present in URL
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          navigate({ to: "/admin" });
          return;
        }

        // If no code and no session, wait a moment and check again
        // Supabase might be processing the hash in the background
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const {
          data: { session: newSession },
        } = await supabase.auth.getSession();

        if (newSession) {
          navigate({ to: "/admin" });
        } else {
          throw new Error("No authorization received. Please try again.");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Authentication failed";
        setError(message);
        // Redirect back to login after a delay
        setTimeout(() => navigate({ to: "/login" }), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy via-navy/95 to-primary/30">
        <div className="rounded-lg bg-white p-6 text-center shadow-lg">
          <p className="text-red-600">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy via-navy/95 to-primary/30">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-white">Completing sign in...</p>
      </div>
    </div>
  );
}
