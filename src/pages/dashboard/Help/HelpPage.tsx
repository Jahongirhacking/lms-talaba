import { toFirstLowerLetter } from '@/utils/stringFunc';
import { LinkOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Flex, Typography } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useTranslation } from 'react-i18next';

const SocialLinkCard = ({
  href,
  imgSrc,
  title,
  description,
}: {
  href: string;
  imgSrc: string;
  title: string;
  description: string;
}) => {
  const { t } = useTranslation();
  return (
    <Card
      className="upper-element"
      style={{
        flex: 1,
        minWidth: 'min(400px, 100%)',
        width: '100%',
        maxWidth: '1000px',
      }}
      actions={[
        <Button
          key={'link'}
          icon={<LinkOutlined style={{ marginRight: '8px' }} />}
          href={href}
          target="_blank"
          type="link"
          style={{ height: '100%' }}
        >
          {t('const.see')}
        </Button>,
      ]}
    >
      <Meta
        avatar={<Avatar size="large" src={imgSrc} />}
        title={title}
        description={description}
      />
    </Card>
  );
};

const HelpPage = () => {
  const { t } = useTranslation();

  return (
    <Flex vertical gap={16} className="settings-page">
      <Typography.Title
        level={3}
        className="section_title"
        style={{ marginBottom: 0 }}
      >
        {
          (
            t('dashboard.navbar.navbarBottom', {
              returnObjects: true,
            }) as string[]
          )[1]
        }
      </Typography.Title>
      <Flex vertical gap={25} style={{ marginTop: 10 }} align="center">
        <SocialLinkCard
          href="https://t.me/HEMIS_support"
          imgSrc="/images/tg_group.jpg"
          title={`Telegram ${toFirstLowerLetter(t('const.group'))}`}
          description={t('help.tg_group_info')}
        />
        <SocialLinkCard
          href="https://t.me/hemis_university"
          imgSrc="/images/tg-logo.png"
          title={`Telegram ${t('const.channel')}`}
          description={t('help.tg_channel_info')}
        />
        <SocialLinkCard
          href="https://t.me/my_hemis_uzbot"
          imgSrc="/images/tg-logo.png"
          title={`Telegram ${t('const.bot')}`}
          description={t('help.tg_bot_info')}
        />
        <SocialLinkCard
          href="https://www.youtube.com/@hemis_blog"
          imgSrc="/images/yt-logo.png"
          title={`YouTube ${t('const.channel')}`}
          description={t('help.yt_channel_info')}
        />
      </Flex>
    </Flex>
  );
};

export default HelpPage;
