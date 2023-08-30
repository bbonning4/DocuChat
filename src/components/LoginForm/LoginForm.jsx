import { useState } from "react";
import * as usersService from "../../utilities/users-service";

export default function LoginForm({ setUser, showSignUp, setShowSignUp }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError("");
  }

  async function handleSubmit(evt) {
    // Prevent form from being submitted to the server
    evt.preventDefault();
    try {
      // The promise returned by the signUp service method
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      const user = await usersService.login(credentials);
      setUser(user);
    } catch {
      setError("Log In Failed - Try Again");
    }
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
            <form autoComplete="off" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="email"
                  className="input-bordered input"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  className="input-bordered input"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <label className="label">
                  <a href="#" className="link-hover label-text-alt link">
                    Forgot password?
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn-primary btn">
                  Login
                </button>
                <p className="text-center">OR</p>
                <button
                  className="btn-primary btn"
                  onClick={() => setShowSignUp(!showSignUp)}
                >
                  {showSignUp ? "Log In" : "Sign Up"}
                </button>
              </div>
            </form>
            <p className="error-message">&nbsp;{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
}