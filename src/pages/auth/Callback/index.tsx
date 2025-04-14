import { getBaseUrl } from '@/services/api/const';
import { register } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import { UserOutlined } from '@ant-design/icons';
import { Button, Flex, message } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const CallbackPage = () => {
  const location = useLocation();
  const REDIRECT_URI = 'https://my.hemis.uz/auth/callback';
  const dispatch = useDispatch();
  const isLogged = useSelector((store: RootState) => store.authSlice.isLogged);

  useEffect(() => {
    const params = new Object();
    const queryParams = new URLSearchParams(location.search);
    queryParams.forEach((value, key) => {
      params[key] = value;
    });
    (async () => {
      try {
        const { data } = await axios.get(getBaseUrl('/auth/oauth', false), {
          params,
        });
        dispatch(register(data?.data?.token));
        message.success(data?.data?.message);
      } catch (err) {
        console.error(err);
        message.warning(JSON.parse(err?.request?.response)?.error);
      }
    })();
  }, []);

  if (isLogged) return <Navigate to="/dashboard" />;

  return (
    <Flex vertical gap={10}>
      <Button
        size="large"
        type="link"
        style={{ width: '100%', backgroundColor: '#4825c2', color: '#fff' }}
        icon={<UserOutlined />}
        href={getBaseUrl(`/auth/oauth?redirect_uri=${REDIRECT_URI}`, false)}
      >
        One ID
      </Button>
    </Flex>
  );
};

export default CallbackPage;
