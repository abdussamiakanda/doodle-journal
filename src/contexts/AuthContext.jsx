import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const done = () => {
      if (!cancelled) setIsLoading(false);
    };

    supabase.auth.getUser()
      .then(({ data: { user: u } }) => {
        if (cancelled) return;
        setUser(u);
        if (u) {
          supabase
            .from("profiles")
            .select("username")
            .eq("id", u.id)
            .single()
            .then(({ data }) => { if (!cancelled) setProfile(data); });
        } else {
          setProfile(null);
        }
      })
      .catch(() => {
        setUser(null);
        setProfile(null);
      })
      .finally(done);

    const timeout = window.setTimeout(done, 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", session.user.id)
            .single();
          setProfile(data);
        } else {
          setProfile(null);
        }
      }
    );
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Logout flow:
   * 1. Clear React state (user, profile) → ProtectedRoute will redirect to /login.
   * 2. Call Supabase signOut() to clear the in-memory session (persistSession: false).
   * 3. Navigate to /login (client-side; no full page reload).
   */
  const logout = useCallback(async () => {
    setUser(null);
    setProfile(null);
    if (supabase) await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = {
    user,
    profile,
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
