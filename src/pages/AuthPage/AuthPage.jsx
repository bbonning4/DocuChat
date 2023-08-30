import { useState } from 'react';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import LoginForm from '../../components/LoginForm/LoginForm';

export default function AuthPage({ setUser }) {
  const [showSignUp, setShowSignUp] = useState(false);
  return (
    <main>
      {showSignUp ? (
        <SignUpForm setUser={setUser} showSignUp={showSignUp} setShowSignUp={setShowSignUp} />
      ) : (
        <LoginForm setUser={setUser} showSignUp={showSignUp} setShowSignUp={setShowSignUp} />
      )}
    </main>
  );
}