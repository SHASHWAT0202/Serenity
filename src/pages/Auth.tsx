import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "sign-up") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (signUpError) throw signUpError;
        setInfo("Account created. Please check your email to verify, then sign in.");
        setMode("sign-in");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        const redirectTo = location?.state?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      }
    } catch (err: any) {
      setError(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-serenity-50 to-purple-50">
      <div className="therapeutic-card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">{mode === "sign-in" ? "Sign In" : "Create Account"}</h1>
        <p className="text-center text-sm text-muted-foreground mb-6">Access your private journal and profile</p>
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "sign-up" && (
            <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {info && <div className="text-green-700 text-sm">{info}</div>}
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Please wait..." : mode === "sign-in" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {mode === "sign-in" ? (
            <button className="underline" onClick={() => setMode("sign-up")}>Create an account</button>
          ) : (
            <button className="underline" onClick={() => setMode("sign-in")}>Already have an account? Sign in</button>
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthPage;


