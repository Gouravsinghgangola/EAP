import AuthForm from '../components/AuthForm';
import { register } from '../services/api';

export default function RegisterPage() {
  return <AuthForm type="register" onSubmit={register} />;
}