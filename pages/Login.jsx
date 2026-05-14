import App from "../src/App";
import { useState } from "react";
import "../src/styles.css";

function Login() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("1234"); // default password
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (password === savedPassword) {
      setLoggedIn(true);
    } else {
      alert("Invalid Password");
    }
  };

  const handleChangePassword = () => {
    if (oldPassword === savedPassword) {
      setSavedPassword(newPassword);
      alert("Password changed successfully!");
      setIsChangingPassword(false);
      setOldPassword("");
      setNewPassword("");
    } else {
      alert("Old password is incorrect");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setPassword("");
  };

  if (loggedIn) {
    return (
    <App/>
    );
  }

  return (
    <main className="login-container">
      <div className="login-card">

        {!isChangingPassword ? (
          <>
            <h1>Login</h1>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p
              className="switch"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </p>
          </>
        ) : (
          <>
            <h1>Change Password</h1>
            <input
              type="password"
              placeholder="Old Password"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Update Password</button>
            <p
              className="switch"
              onClick={() => setIsChangingPassword(false)}
            >
              Back to Login
            </p>
          </>
        )}

      </div>
    </main>
  );
}

export default Login;