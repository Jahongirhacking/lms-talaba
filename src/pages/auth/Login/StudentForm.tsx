import { ControlledFlowContext } from '@/components/ControlledFlow';
import { LoadingOutlined, LoginOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Typography } from 'antd';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

const StudentForm = ({ isLoading = false }: { isLoading?: boolean }) => {
  const { form, onSubmit, data } = useContext(ControlledFlowContext);
  const { t } = useTranslation();

  const handleSubmit = () => {
    onSubmit({
      login: form.getFieldsValue()?.login?.split(' ')?.join(''),
      password: form.getFieldsValue()?.password,
      ...data,
    });
  };

  return (
    <div className="customBox login__main--card">
      <Typography.Title level={2} className="customBox__title">{t('login.student_form.title')}</Typography.Title>
      <Typography.Text>Iltimos talaba ID si va parolingizni kiriting</Typography.Text>
      <Form
        onFinish={e => e.preventDefault()}
        layout="vertical"
        form={form}
        className="login__main--form"
      >
        <Form.Item name={'login'} label={t('login.student_form.login_label')}>
          <Input
            size="large"
            placeholder={t('login.student_form.login_placeholder')}
          />
        </Form.Item>
        <Form.Item
          name={'password'}
          label={t('login.student_form.password_label')}
        >
          <Input.Password
            size="large"
            placeholder={t('login.student_form.password_placeholder')}
          />
        </Form.Item>

        <Flex vertical gap={10}>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              disabled={isLoading}
              icon={isLoading ? <LoadingOutlined /> : <LoginOutlined />}
              onClick={handleSubmit}
            >
              {t('login.student_form.button_text')}
            </Button>
          </Form.Item>

          {/* <Divider style={{ margin: '3px 0', fontSize: '11pt' }}>
            {t('const.enter_via_other_method')}
          </Divider>

          <Button
            size="large"
            type="link"
            style={{ width: '100%', backgroundColor: '#4825c2', color: '#fff' }}
            icon={<UserOutlined />}
            href={`https://student.hemis.uz/rest/v1/auth/oauth?redirect_uri=https://my.hemis.uz`}
          >
            One ID
          </Button> */}
        </Flex>
      </Form>
    </div>
  );
};

export default StudentForm;
