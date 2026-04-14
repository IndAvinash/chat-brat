import { useState, useEffect, useRef } from "react";
import { Branding } from "./Header";
import { Link } from "react-router-dom";
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
    --success: #00f5d4;
  }
     

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .signup-page {
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .signup-card {
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

  .signup-heading {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 28px;
  }

  .signup-form {
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

  /* Password strength bar */
  .strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 2px;
  }

  .strength-seg {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: var(--border);
    transition: background 0.25s ease;
  }

  .strength-seg.filled-1 { background: var(--error); }
  .strength-seg.filled-2 { background: #ffaa00; }
  .strength-seg.filled-3 { background: var(--success); }

  .strength-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    margin-top: 4px;
  }

  /* Terms */
  .terms-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: -2px;
  }

  .terms-checkbox {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    margin-top: 2px;
    accent-color: var(--accent);
    cursor: pointer;
  }

  .terms-text {
    font-size: 12px;
    font-weight: 500;
    color: var(--muted);
    line-height: 1.5;
  }

  .terms-link {
    color: var(--text);
    text-decoration: underline;
    text-decoration-color: rgba(240,238,255,0.2);
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 500;
    padding: 0;
    transition: color 0.15s;
  }
  .terms-link:hover { color: var(--accent); }

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

  .signin-row {
    text-align: center;
    font-size: 13px;
    color: var(--muted);
    margin-top: 6px;
  }

  .signin-link {
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
  .signin-link:hover { color: var(--accent); }

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

type Strength = 0 | 1 | 2 | 3;

function getStrength(pw: string): Strength {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score as Strength;
}

const strengthLabel: Record<Strength, string> = {
  0: "",
  1: "Weak",
  2: "Fair",
  3: "Strong",
};

interface SignUpProps {
  onSignUp?: (name: string, email: string, password: string) => Promise<void> | void;
}

export default function SignUp({ onSignUp }: SignUpProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const strength = getStrength(password);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min. 6 characters";
    if (!confirm) e.confirm = "Please confirm your password";
    else if (confirm !== password) e.confirm = "Passwords do not match";
    if (!agreed) e.terms = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSignUp?.(name, email, password);
      showToast("Account created");
    } catch {
      showToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const clear = (key: string) => setErrors(p => { const n = { ...p }; delete n[key]; return n; });

  return (
    <>
      <style>{styles}</style>

      <div className="signup-page">
        <div className="signup-card" onKeyDown={handleKeyDown}>

         < Branding />

          <h1 className="signup-heading">Create account</h1>

          <div className="signup-form">

            {/* Name */}
            <div className="field">
              <label className="field-label">Name</label>
              <input
                className={`field-input${errors.name ? " error" : ""}`}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => { setName(e.target.value); clear("name"); }}
                autoComplete="name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="field">
              <label className="field-label">Email</label>
              <input
                className={`field-input${errors.email ? " error" : ""}`}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); clear("email"); }}
                autoComplete="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <input
                  className={`field-input has-eye${errors.password ? " error" : ""}`}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); clear("password"); }}
                  autoComplete="new-password"
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
              {password && (
                <>
                  <div className="strength-bar">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`strength-seg${strength >= i ? ` filled-${strength}` : ""}`}
                      />
                    ))}
                  </div>
                  {strength > 0 && <span className="strength-label">{strengthLabel[strength]}</span>}
                </>
              )}
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {/* Confirm password */}
            <div className="field">
              <label className="field-label">Confirm password</label>
              <div className="field-wrap">
                <input
                  className={`field-input has-eye${errors.confirm ? " error" : ""}`}
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); clear("confirm"); }}
                  autoComplete="new-password"
                />
                <button className="field-eye" type="button" onClick={() => setShowConfirm(s => !s)} tabIndex={-1}>
                  {showConfirm ? (
                    <img src="./src/assets/off.svg" alt="Hide password" />
                  ) : (
                    <img src="./src/assets/on.svg" alt="Show password" />
                  )}
                </button>
              </div>
              {errors.confirm && <span className="field-error">{errors.confirm}</span>}
            </div>

            {/* Terms */}
            <div className="field">
              <label className="terms-row">
                <input
                  className="terms-checkbox"
                  type="checkbox"
                  checked={agreed}
                  onChange={e => { setAgreed(e.target.checked); clear("terms"); }}
                />
                <span className="terms-text">
                  I agree to the{" "}
                  <button className="terms-link" type="button">Terms of Service</button>
                  {" "}and{" "}
                  <button className="terms-link" type="button">Privacy Policy</button>
                </span>
              </label>
              {errors.terms && <span className="field-error">{errors.terms}</span>}
            </div>

            {/* Submit */}
            <button className="submit-btn" type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <><div className="spinner" /> Creating account</> : "Create account"}
            </button>

            <p className="signin-row">
              Already have an account?
              <Link to="/login" className="signin-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </>
  );
}