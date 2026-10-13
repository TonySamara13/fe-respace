"use client";

import { useState } from "react";

import { isApiError } from "@/shared/api/errors";
import { publicEnv } from "@/shared/config/env";
import { routes, safeNextPath } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Toast } from "@/shared/ui/Toast";

type GoogleCredential = { credential?: string };

type GoogleButtonProps = {
  nextPath?: string;
};

export function GoogleButton({ nextPath }: GoogleButtonProps) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function signIn() {
    if (!publicEnv.googleClientId) {
      setError("Вход через Google сейчас недоступен");
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const credential = await requestGoogleCredential(publicEnv.googleClientId);
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "google", idToken: credential }),
      });
      const body = (await response.json()) as { code?: string; detail?: string; emailVerified?: boolean };
      if (!response.ok) {
        setError(body.detail ?? "Не удалось войти через Google");
        return;
      }
      window.location.assign(body.emailVerified ? safeNextPath(nextPath) : routes.verifyEmail);
    } catch (caught) {
      setError(isApiError(caught) ? caught.detail : "Не удалось войти через Google");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error ? <Toast variant="error">{error}</Toast> : null}
      <Button variant="ghost" block loading={loading} onClick={() => void signIn()}>
        Продолжить с Google
      </Button>
    </div>
  );
}

function requestGoogleCredential(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const start = () => {
      const google = window.google;
      if (!google) {
        reject(new Error("google"));
        return;
      }
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: GoogleCredential) => {
          if (!response.credential) {
            reject(new Error("google"));
            return;
          }
          resolve(response.credential);
        },
      });
      google.accounts.id.prompt();
    };

    if (window.google) {
      start();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = start;
    script.onerror = () => reject(new Error("google"));
    document.head.appendChild(script);
  });
}
