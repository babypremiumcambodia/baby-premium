"use client";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function checkExistingSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      if (!session) {
        setChecking(false);
        return;
      }

      const { data: isAdmin } = await supabase.rpc(
        "is_pos_admin"
      );

      if (!active) return;

      if (isAdmin) {
        router.replace("/admin/pos");
        return;
      }

      await supabase.auth.signOut();
      setChecking(false);
    }

    checkExistingSession();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSigningIn(true);
    setErrorMessage("");

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (signInError) {
      setErrorMessage(
        "The email or password is incorrect."
      );
      setSigningIn(false);
      return;
    }

    const {
      data: isAdmin,
      error: adminCheckError,
    } = await supabase.rpc("is_pos_admin");

    if (adminCheckError || !isAdmin) {
      await supabase.auth.signOut();

      setErrorMessage(
        "This account does not have POS access."
      );
      setSigningIn(false);
      return;
    }

    router.replace("/admin/pos");
    router.refresh();
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-premium">
        <LoaderCircle className="h-8 w-8 animate-spin text-gold" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-premium px-5 py-10">
      <div className="glass w-full max-w-md rounded-[32px] border border-white/70 p-7 shadow-[0_18px_50px_rgba(122,79,22,0.12)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-white shadow-[0_8px_24px_rgba(184,137,50,0.25)]">
          <LockKeyhole className="h-6 w-6" />
        </div>

        <h1 className="mt-5 text-center text-3xl font-bold text-slate-900">
          Baby Premium & Essentials POS
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Sign in with your administrator account
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-4"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </span>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="admin@example.com"
                autoComplete="email"
                required
                className="w-full rounded-2xl border border-white/70 bg-white/60 py-4 pl-12 pr-4 outline-none transition focus:border-gold/60"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </span>

            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-2xl border border-white/70 bg-white/60 py-4 pl-12 pr-4 outline-none transition focus:border-gold/60"
              />
            </div>
          </label>

          {errorMessage && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={signingIn}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingIn && (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            )}

            {signingIn
              ? "Signing in…"
              : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}