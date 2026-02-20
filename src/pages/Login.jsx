import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase.js";
import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_PATTERN, MIN_PASSWORD_LENGTH } from "@/lib/constants.js";

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!supabase) {
      setError("App is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      setIsLoading(false);
      return;
    }

    try {
      if (isRegister) {
        if (!username || username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
          setError(`Username must be ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters`);
          return;
        }
        if (!USERNAME_PATTERN.test(username)) {
          setError("Username: letters, numbers, underscores only");
          return;
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
          setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
          return;
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (signUpError) throw signUpError;
        /* Profile is created by DB trigger handle_new_user() with username from user_metadata. */
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page page-enter">
      <Card className="login-card">
        <div>
          <h1 className="login-title">One Year Doodle</h1>
          <p className="login-subtitle">
            {isRegister ? "Create your garden" : "Welcome back"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="your_name"
                autoComplete="username"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder={isRegister ? "8+ characters" : "Enter password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : isRegister ? "Create Account" : "Sign In"}
          </Button>
        </form>
        <div className="login-toggle">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Already have an account? Sign in" : "Need an account? Register"}
          </button>
        </div>
      </Card>
    </main>
  );
}
