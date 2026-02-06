"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 page-enter">
      <Card className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-bold text-garden-ink">
            One Year Doodle
          </h1>
          <p className="text-garden-ink/50 mt-1 font-body text-sm">
            {isRegister ? "Create your garden" : "Welcome back"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block font-body text-sm text-garden-ink/70 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-garden-cream-dark text-garden-ink
                font-body text-base placeholder:text-garden-ink/30
                focus:outline-none focus:ring-2 focus:ring-garden-accent/30"
              placeholder="your_name"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-body text-sm text-garden-ink/70 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-garden-cream-dark text-garden-ink
                font-body text-base placeholder:text-garden-ink/30
                focus:outline-none focus:ring-2 focus:ring-garden-accent/30"
              placeholder={isRegister ? "6+ characters" : "Enter password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
            />
          </div>

          {error && (
            <p className="text-red-600 font-body text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading
              ? "Loading..."
              : isRegister
                ? "Create Account"
                : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="font-body text-sm text-garden-ink/50 hover:text-garden-ink transition-colors"
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "Need an account? Register"}
          </button>
        </div>
      </Card>
    </main>
  );
}
