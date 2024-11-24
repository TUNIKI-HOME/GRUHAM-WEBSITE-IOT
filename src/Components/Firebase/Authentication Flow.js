import { loginWithEmailAndPassword } from '../Firebase/Firebase';

const handleLogin = async () => {
  try {
    await loginWithEmailAndPassword('user@example.com', 'password123');
    console.log('User logged in');
  } catch (error) {
    console.error('Login failed', error);
  }
};
