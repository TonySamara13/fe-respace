import { NextResponse } from "next/server";

import { login, loginGoogle, register } from "@/shared/api/generated/auth/auth";
import { isApiError } from "@/shared/api/errors";
import { readSessionToken, readSessionUser, writeSession, clearSession } from "@/shared/api/sessionCookie";

type SessionBody =
  | { mode: "login"; email: string; password: string }
  | { mode: "register"; email: string; password: string }
  | { mode: "google"; idToken: string };

function publicUser(email: string, emailVerified: boolean) {
  return { email, emailVerified };
}

export async function POST(request: Request) {
  let body: SessionBody;
  try {
    body = (await request.json()) as SessionBody;
  } catch {
    return NextResponse.json(
      { code: "validation_error", detail: "Некорректный запрос" },
      { status: 400 },
    );
  }

  try {
    const result =
      body.mode === "register"
        ? await register({ email: body.email, password: body.password })
        : body.mode === "google"
          ? await loginGoogle({ idToken: body.idToken })
          : await login({ email: body.email, password: body.password });
    const auth = result.data;
    const response = NextResponse.json(publicUser(auth.email, auth.emailVerified));
    writeSession(response, auth);
    return response;
  } catch (error) {
    if (isApiError(error)) {
      return NextResponse.json(
        { code: error.code, detail: error.detail, ...error.extra },
        { status: error.status },
      );
    }
    return NextResponse.json({ code: "internal_error", detail: "Не удалось войти" }, { status: 500 });
  }
}

export async function PATCH() {
  const [user, token] = await Promise.all([readSessionUser(), readSessionToken()]);
  if (!user || !token) {
    return NextResponse.json({ code: "unauthorized", detail: "Требуется авторизация" }, { status: 401 });
  }
  const response = NextResponse.json(publicUser(user.email, true));
  writeSession(response, { accessToken: token, email: user.email, emailVerified: true });
  return response;
}

export async function DELETE() {
  const response = new NextResponse(null, { status: 204 });
  clearSession(response);
  return response;
}
