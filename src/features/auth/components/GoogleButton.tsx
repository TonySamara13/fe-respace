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
        <GoogleMark />
        Продолжить с Google
      </Button>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
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
