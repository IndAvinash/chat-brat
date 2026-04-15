import { useState, useEffect, useRef } from "react";
import { Branding } from "./Header";
import { Link } from "react-router-dom";
import { signup } from "../services/api";
import { useNavigate } from "react-router-dom";


type Strength = 0 | 1 | 2 | 3;

function getStrength(pw: string): Strength {
  if (!pw) return 0;
  let score = 0;
if(score<3){
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if(pw.length >= 15) score=3;
  }
  return score as Strength;
}

const strengthLabel: Record<Strength, string> = {
  0: "",
  1: "Weak",
  2: "Fair",
  3: "Strong",
};



export default function SignUp() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
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
      await signup({ name, email, password });
      showToast("Account created! Redirecting to login...");
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Signup failed");
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