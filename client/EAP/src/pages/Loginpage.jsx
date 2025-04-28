import AuthForm from '../components/AuthForm';
import { login } from '../services/api';

export default function LoginPage() {
  return <AuthForm type="login" onSubmit={login} />;
}