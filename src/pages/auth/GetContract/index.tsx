import { LeftArrowSVG } from '@/assets/icon';
import UniversitySelect from '@/components/Select/UniversitySelect';
import { paths } from '@/router/paths';
import { getBaseUrl } from '@/services/api/const';
import { getLocalStorage, localStorageNames } from '@/utils/storageFunc';
import { Button, Flex, Form, Input, Typography } from 'antd';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const GetContract = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleUniver = () => {
    if (getLocalStorage(localStorageNames.universityApi)) {
      navigate('/');
      window.location.href = getBaseUrl('', false).replace(
        'rest/v1',
        'dashboard/contract'
      );
    }
  };

  useEffect(() => {
    handleUniver();
  }, []);

  return (
    <>
      {!getLocalStorage(localStorageNames.universityApi) ? (
        <Flex
          gap={10}
          align="center"
          justify="center"
          style={{ width: '100%' }}
        >
          <Helmet>
            <title>Shartnoma olish</title>
            <meta
              name="description"
              content="HEMIS orqali kontrakt shartnomasini olish. HEMIS - Oliy ta’lim jarayonlarini boshqarish axborot tizimi. Ushbu tizim Oliy ta’lim muassasalari uchun ma’muriy boshqaruv, o‘quv jarayoni, ilmiy faoliyat, va moliyaviy boshqaruv modullarini taqdim etadi. 226 dan ortiq OTM va 1 milliondan ortiq foydalanuvchilar (talabalar va o‘qituvchilar) tomonidan qo‘llaniladi."
            />
            <meta
              name="keywords"
              content="HEMIS, Oliy ta’lim tizimi, boshqarish axborot tizimi, ma’muriy boshqaruv, o‘quv jarayoni, ilmiy faoliyat, moliyaviy boshqaruv, OTM, talaba axborot tizimi, o‘qituvchi axborot tizimi, oliy ta’lim boshqaruvi, HEMIS yo‘riqnoma, Oliy ta’lim muassasalari, hemis shartnoma olish, shartnoma olish"
            />
            <meta property="og:title" content="LMS" />
            <meta
              property="og:description"
              content="HEMIS orqali kontrakt shartnomasini olish. HEMIS - Oliy ta’lim jarayonlarini boshqarish axborot tizimi. Ushbu tizim Oliy ta’lim muassasalari uchun ma’muriy boshqaruv, o‘quv jarayoni, ilmiy faoliyat, va moliyaviy boshqaruv modullarini taqdim etadi. 226 dan ortiq OTM va 1 milliondan ortiq foydalanuvchilar (talabalar va o‘qituvchilar) tomonidan qo‘llaniladi."
            />
            <meta property="og:image" content="/images/lms-icon.svg" />
          </Helmet>
          <UniversitySelect />
          <Button type="primary" onClick={handleUniver}>
            {t('const.choose')}
          </Button>
        </Flex>
      ) : (
        <>
          <Flex
            justify="flex-start"
            align="start"
            gap={24}
            style={{ width: '100%', maxWidth: '520px' }}
          >
            <Button
              className="login__prev-btn"
              onClick={() => navigate(paths.base)}
            >
              <LeftArrowSVG />
            </Button>
          </Flex>

          <div
            className="customBox login__main--card"
            style={{ position: 'relative' }}
          >
            <div className="test-page">{t('components.soon_card.text')}</div>
            <Typography.Title
              level={4}
              className="customBox__title"
              style={{ textAlign: 'left', marginBottom: '24px' }}
            >
              {t('get_contract.title')}
            </Typography.Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={values => console.log(values)}
              className="login__main--form"
            >
              <Form.Item
                name={'university'}
                label={t('get_contract.input_label')}
              >
                <Input
                  size="large"
                  placeholder={t('get_contract.input_placeholder')}
                />
              </Form.Item>

              <Flex align="center" justify="space-between" gap={24} wrap>
                <img src="/images/random.png" alt="" />
                <Form.Item
                  name={'university'}
                  label={t('get_contract.code_label')}
                  style={{ flexGrow: 1 }}
                >
                  <Input
                    size="large"
                    placeholder={t('get_contract.code_placeholder')}
                  />
                </Form.Item>
              </Flex>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%' }}
                >
                  {t('get_contract.button_text')}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </>
  );
};

export default GetContract;
