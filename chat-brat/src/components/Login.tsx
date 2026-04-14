import { useState, useEffect, useRef } from "react";
import { Branding } from "./Header";
import { Link } from "react-router-dom";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";



export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [toast, setToast] = useState<string | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min. 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

 const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await login({ email, password });
    
      localStorage.setItem('token', response.token || '');
      localStorage.setItem('user', JSON.stringify(response.user));
      showToast("Welcome back!");
      setTimeout(() => navigate('/chat'), 500);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Login failed");
    } finally {
      setTimeout(() => setLoading(false), 500);
      
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };
  return (
    <>

      <div className="login-page">
        <div className="login-card" onKeyDown={handleKeyDown}>

          <Branding/>

          <h1 className="login-heading">Sign in</h1>

          <div className="login-form">
            <div className="field">
              <label className="field-label">Email</label>
              <div className="field-wrap">
                <input
                  className={`field-input${errors.email ? " error" : ""}`}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <input
                  className={`field-input has-eye${errors.password ? " error" : ""}`}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                  autoComplete="current-password"
                />
                <button className="field-eye" type="button" onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                  {showPass ? (
                   <img src="./src/assets/off.svg" alt="Hide password" />
                  ) : (
                   <img src="./src/assets/on.svg" alt="Show password" />
                  )}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="forgot-row">
              <button className="forgot-link" type="button" onClick={() => showToast("Password reset is not implemented yet")}>
                Forgot password?
              </button>
            </div>

            <button className="submit-btn" type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <><div className="spinner"/>Checking Your Key</> : "Let Me In"}
            </button>

            <p className="signup-row">No account?
              <Link to="/signup" className="signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className={`toast${toast ? " show" : ""}` }>{toast}</div>
    </>
  );
}