import { createServerClient } from "@supabase/ssr";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/admin";

  if (code || (token_hash && type)) {
    const response = NextResponse.redirect(new URL(next, origin));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ type: type!, token_hash: token_hash! });

    if (!error) {
      return response;
    }

    console.error("auth/confirm verification failed:", {
      message: error.message,
      status: error.status,
      code: error.code,
      usedFlow: code ? "pkce" : "otp",
    });
  } else {
    console.error("auth/confirm missing params:", {
      hasCode: Boolean(code),
      hasTokenHash: Boolean(token_hash),
      type,
    });
  }

  return NextResponse.redirect(
    new URL("/admin/login?error=link_invalido", origin),
  );
}
