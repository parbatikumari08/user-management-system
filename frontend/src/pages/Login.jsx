import { useState, useContext } from "react";
import { loginUser, registerUser } from "../services/api";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setForm({
        ...form,
        email: "admin@example.com",
        password: "admin123"
      });
    } else if (role === 'user') {
      setForm({
        ...form,
        email: "user@example.com",
        password: "user123"
      });
    } else if (role === 'manager') {
      setForm({
        ...form,
        email: "manager@example.com",
        password: "manager123"
      });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isLogin) {
      if (form.password !== form.confirmPassword) {
        setError("Passwords don't match");
        setLoading(false);
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        const res = await loginUser({ email: form.email, password: form.password });
        const userData = {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
          token: res.data.token,
          status: res.data.user.status
        };
        login(userData);
        
        // Redirect based on role
        if (userData.role === 'admin' || userData.role === 'manager') {
          navigate("/dashboard");
        } else {
          // Regular users go to profile page
          navigate("/profile");
        }
      } else {
        await registerUser({
          name: form.name,
          email: form.email,
          password: form.password
        });
        const loginRes = await loginUser({ email: form.email, password: form.password });
        const userData = {
          id: loginRes.data.user.id,
          name: loginRes.data.user.name,
          email: loginRes.data.user.email,
          role: loginRes.data.user.role,
          token: loginRes.data.token,
          status: loginRes.data.user.status
        };
        login(userData);
        
        // New registered users are 'user' role by default
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.decorativeBar}>
          <div style={styles.decorativeCircle1}></div>
          <div style={styles.decorativeCircle2}></div>
        </div>

        <div style={styles.header}>
          <div style={styles.logo}>✨</div>
          <h1 style={styles.title}>User Management</h1>
          <p style={styles.subtitle}>
            {isLogin ? "Welcome back! Please login to your account" : "Create your account to get started"}
          </p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>👤</span>
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📧</span>
              Email Address
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔒</span>
              Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>✓</span>
                Confirm Password
              </label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  style={styles.passwordInput}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? (
              <span style={styles.spinner}></span>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div style={styles.toggleContainer}>
          <p style={styles.toggleText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setForm({ name: "", email: "", password: "", confirmPassword: "" });
            }}
            style={styles.toggleButton}
          >
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </div>

        <div style={styles.demoBox}>
          <p style={styles.demoTitle}>🎯 Quick Login (Click to Autofill)</p>
          <div style={styles.demoGrid}>
            <div 
              style={styles.demoCard} 
              onClick={() => fillDemoCredentials('admin')}
            >
              <div style={styles.demoRole}>
                <span style={styles.adminBadge}>👑 Admin</span>
              </div>
              <div style={styles.demoEmail}>admin@example.com</div>
              <div style={styles.demoPass}>•••••••</div>
              <div style={styles.clickHint}>Click to autofill</div>
            </div>
            
            <div 
              style={styles.demoCard} 
              onClick={() => fillDemoCredentials('manager')}
            >
              <div style={styles.demoRole}>
                <span style={styles.managerBadge}>📊 Manager</span>
              </div>
              <div style={styles.demoEmail}>manager@example.com</div>
              <div style={styles.demoPass}>•••••••</div>
              <div style={styles.clickHint}>Click to autofill</div>
            </div>

            <div 
              style={styles.demoCard} 
              onClick={() => fillDemoCredentials('user')}
            >
              <div style={styles.demoRole}>
                <span style={styles.userBadge}>👤 User</span>
              </div>
              <div style={styles.demoEmail}>user@example.com</div>
              <div style={styles.demoPass}>•••••••</div>
              <div style={styles.clickHint}>Click to autofill</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
    padding: "20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  card: {
    maxWidth: "500px",
    width: "100%",
    background: "rgba(26, 26, 46, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "28px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    position: "relative",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  decorativeBar: {
    height: "4px",
    background: "linear-gradient(90deg, #a78bfa, #ec4899, #f59e0b)",
    position: "relative"
  },
  decorativeCircle1: {
    position: "absolute",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "rgba(167, 139, 250, 0.1)",
    top: "-50px",
    right: "-30px"
  },
  decorativeCircle2: {
    position: "absolute",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background: "rgba(236, 72, 153, 0.05)",
    bottom: "-75px",
    left: "-75px"
  },
  header: {
    textAlign: "center",
    padding: "40px 30px 20px"
  },
  logo: {
    fontSize: "48px",
    marginBottom: "16px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #a78bfa, #ec4899)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px"
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: "14px"
  },
  errorAlert: {
    margin: "0 30px 20px",
    padding: "12px",
    background: "rgba(239, 68, 68, 0.1)",
    borderLeft: "4px solid #ef4444",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: "#f87171"
  },
  errorIcon: {
    fontSize: "18px"
  },
  form: {
    padding: "0 30px"
  },
  inputGroup: {
    marginBottom: "20px"
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#e4e4e7",
    marginBottom: "8px"
  },
  labelIcon: {
    fontSize: "16px"
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    background: "#0f0f1e",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#e4e4e7",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box"
  },
  passwordWrapper: {
    position: "relative",
    width: "100%"
  },
  passwordInput: {
    width: "100%",
    padding: "12px 45px 12px 16px",
    background: "#0f0f1e",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#e4e4e7",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box"
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    padding: "0",
    margin: "0",
    boxShadow: "none",
    color: "#9ca3af"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #a78bfa, #ec4899)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px",
    position: "relative"
  },
  spinner: {
    display: "inline-block",
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  toggleContainer: {
    textAlign: "center",
    padding: "30px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    marginTop: "20px"
  },
  toggleText: {
    color: "#9ca3af",
    fontSize: "14px",
    marginBottom: "10px"
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#a78bfa",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
    padding: "5px 10px"
  },
  demoBox: {
    background: "rgba(15, 15, 30, 0.8)",
    margin: "0 30px 30px",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },
  demoTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#9ca3af",
    marginBottom: "12px",
    textAlign: "center"
  },
  demoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px"
  },
  demoCard: {
    background: "#0f0f1e",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative"
  },
  demoRole: {
    marginBottom: "8px"
  },
  adminBadge: {
    background: "linear-gradient(135deg, #a78bfa, #8b5cf6)",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block"
  },
  managerBadge: {
    background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block"
  },
  userBadge: {
    background: "linear-gradient(135deg, #34d399, #10b981)",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block"
  },
  demoEmail: {
    fontSize: "11px",
    color: "#9ca3af",
    fontFamily: "monospace",
    marginBottom: "6px",
    wordBreak: "break-all"
  },
  demoPass: {
    fontSize: "11px",
    color: "#6b7280",
    fontFamily: "monospace"
  },
  clickHint: {
    fontSize: "9px",
    color: "#6b7280",
    marginTop: "6px",
    fontStyle: "italic"
  }
};

// Add keyframe animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .card {
    animation: slideUp 0.5s ease;
  }
  
  input:focus {
    border-color: #a78bfa !important;
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1) !important;
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(167, 139, 250, 0.3);
  }
  
  button:active {
    transform: translateY(0);
  }
  
  .demoCard:hover {
    transform: translateY(-2px);
    border-color: rgba(167, 139, 250, 0.3);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(styleSheet);

export default Login;