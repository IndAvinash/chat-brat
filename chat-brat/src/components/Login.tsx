import { useState, useEffect, useRef } from "react";
import { Branding } from "./Header";
import { Link } from "react-router-dom";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');

  :root {
    --bg: #131326;
    --surface: #111118;
    --border: rgba(255,255,255,0.08);
    --border-focus: rgba(255,255,255,0.2);
    --accent: #ff3cac;
    --text: #f0eeff;
    --muted: rgba(240,238,255,0.38);
    --error: #ff5c5c;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-page {
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .login-card {
    width: 100%;
    max-width: 380px;
  }

  .brand {
    margin-bottom: 40px;
  }

  .brand-name {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  .brand-tagline {
    margin-top: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    line-height: 1.5;
  }

  .login-heading {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 28px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .field-wrap {
    position: relative;
  }

  .field-input {
    width: 100%;
    padding: 11px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    transition: border-color 0.15s ease;
    caret-color: var(--accent);
  }

  .field-input::placeholder { color: var(--muted); }
  .field-input:focus { border-color: var(--border-focus); }
  .field-input.has-eye { padding-right: 40px; }
  .field-input.error { border-color: rgba(255,92,92,0.5); }

  .field-eye {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    transition: color 0.15s;
  }
  .field-eye:hover { color: var(--text); }

  .field-error {
    font-size: 11px;
    font-weight: 600;
    color: var(--error);
  }

  .forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: -4px;
  }

  .forgot-link {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    transition: color 0.15s;
    padding: 0;
  }
  .forgot-link:hover { color: var(--text); }

  .submit-btn {
    margin-top: 4px;
    padding: 12px;
    border-radius: 8px;
    border: none;
    background: var(--accent);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .submit-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .signup-row {
    text-align: center;
    font-size: 13px;
    color: var(--muted);
    margin-top: 6px;
  }

  .signup-link {
    background: none;
    border: none;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    cursor: pointer;
    margin-left: 4px;
    transition: color 0.15s;
    padding: 0;
  }
  .signup-link:hover { color: var(--accent); }

  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(60px);
    background: #1c1c28;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    z-index: 999;
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;
    opacity: 0;
    white-space: nowrap;
    pointer-events: none;
  }
  .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
`;

interface LoginProps {
  onLogin?: (email: string, password: string) => Promise<void> | void;
  onForgotPassword?: () => void;
}

export default function Login({ onLogin, onForgotPassword }: LoginProps) {
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
      // Store token in localStorage
      localStorage.setItem('token', response.token || '');
      localStorage.setItem('user', JSON.stringify(response.user));
      showToast("Welcome back!");
      setTimeout(() => navigate('/chat'), 500);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <style>{styles}</style>

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
                    // read from assets/off.svg
                   <img src="./src/assets/off.svg" alt="Hide password" />
                  ) : (
                   // read from assets/on.svg
                   <img src="./src/assets/on.svg" alt="Show password" />
                  )}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="forgot-row">
              <button className="forgot-link" type="button" onClick={onForgotPassword}>
                Forgot password?
              </button>
            </div>

            <button className="submit-btn" type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <><div className="spinner" /> Signing in</> : "Sign in"}
            </button>

            <p className="signup-row">
              No account?
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