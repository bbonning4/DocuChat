import { Component } from "react";
import { signUp } from "../../utilities/users-service";

export default class SignUpForm extends Component {
  state = {
    email: "",
    password: "",
    confirm: "",
    error: "",
  };

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
      error: "",
    });
  };

  handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const { email, password } = this.state;
      const formData = { email, password };
      // The promise returned by the signUp service
      // method will resolve to the user object included
      // in the payload of the JSON Web Token (JWT)
      const user = await signUp(formData);
      this.props.setUser(user);
    } catch {
      // An error occurred
      // Probably due to a duplicate email
      this.setState({ error: "Sign Up Failed - Try Again" });
    }
  };

  render() {
    const { showSignUp, setShowSignUp } = this.props;
    const disable = this.state.password !== this.state.confirm;
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Sign up now!</h1>
            <p className="py-6">
              Sign up with DocuChat to save documents and chat with multiple documents at once.
            </p>
          </div>
          <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
            <div className="card-body">
              <form autoComplete="off" onSubmit={this.handleSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    placeholder="email"
                    className="input-bordered input"
                    value={this.state.email}
                    onChange={this.handleChange}
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
                    value={this.state.password}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirm Password</span>
                  </label>
                  <input
                    type="password"
                    name="confirm"
                    placeholder="password"
                    className="input-bordered input"
                    value={this.state.confirm}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="form-control mt-6">
                  <button type="submit" className="btn-primary btn">
                    Sign Up
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
              <p className="error-message">&nbsp;{this.state.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}