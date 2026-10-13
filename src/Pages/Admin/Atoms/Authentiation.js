import { useRecoilState } from 'recoil';
import { authenticationState } from './atoms';
import axios from 'axios';
import { server } from '@/main';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useAuthentication = () => {
  const [authState, setAuthState] = useRecoilState(authenticationState);
  const navigate = useNavigate();

  const loginAdmin = async (email, password) => {
    try {
      const response = await axios.post(
        `${server}/admin/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      const data = response?.data?.data;

      if (!data) {
        throw new Error('The server returned an unexpected login response.');
      }

      setAuthState((prevState) => ({
        ...prevState,
        isAuthenticated: true,
        token: data,
      }));

      if (data.token) {
        localStorage.setItem('adminAuthToken', data.token);
      }

      if (data.name) {
        localStorage.setItem('adminName', data.name);
      }

      if (data.email) {
        localStorage.setItem('adminEmail', data.email);
      }

      const expirationTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('tokenExpiration', String(expirationTime));

      toast.success('You have successfully logged in.', {
        position: 'bottom-center',
        closeOnClick: true,
        draggable: true,
        theme: 'colored',
      });

      navigate('/admin/dasbord');
    } catch (error) {
      setAuthState((prevState) => ({
        ...prevState,
        isAuthenticated: false,
        token: null,
      }));

      console.error('Admin login request failed:', error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';

      toast.error(message, {
        position: 'top-center',
        closeOnClick: true,
        draggable: true,
        theme: 'colored',
      });

      throw error;
    }
  };

  return { loginAdmin };
};