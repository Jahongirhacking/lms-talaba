import { RestrictedIconSVG, UsefulIconSVG, UserIconSVG } from '@/assets/icon';
import { useParamActions } from '@/hooks/useParam';
import i18n from '@/i18n';
import restrictedUniversities from '@/utils/restrictedUniversities';
import { getLocalStorage, localStorageNames } from '@/utils/storageFunc';
import { truncateString } from '@/utils/stringFunc';
import { Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import './navbar.scss';
import useNavbarList, { INavbarList } from './useNavbarList';

const NavbarBottom = () => {
  const RESTRICTED_PATH = '/dashboard/restricted';
  const { navbarList } = useNavbarList();
  const [usefulNav, setUsefulNav] = useState<INavbarList>();
  const [profileNav, setProfileNav] = useState<INavbarList>();
  const { t } = useTranslation();
  const { pathLocation } = useParamActions();
  const navigate = useNavigate();
  const isRestrictedUniversity = !!restrictedUniversities.find(uni =>
    getLocalStorage(localStorageNames.universityApi)?.includes(uni)
  );

  useEffect(() => {
    if (isRestrictedUniversity) {
      navigate('/dashboard/restricted');
    }
  }, []);

  useEffect(() => {
    setUsefulNav({
      title: t('const.useful'),
      icon: <UsefulIconSVG />,
      path: '/dashboard/useful-menus',
    });
    setProfileNav({
      title: t('const.profile'),
      icon: <UserIconSVG />,
      path: '/dashboard/profile-menus',
    });
  }, [i18n.language]);

  if (!navbarList || navbarList.length === 0) return null;

  const subjectsNav = navbarList[2];
  const timetableNav = navbarList[1];
  const dashboardNav = navbarList[0];

  const bottomNavs = [
    subjectsNav,
    timetableNav,
    dashboardNav,
    usefulNav,
    profileNav,
  ];

  return (
    <Flex className="bottom-nav" gap={10} align="center" justify="space-evenly">
      {/* Subjects */}
      {/* Check restricted university */}
      {bottomNavs.map(nav => (
        <NavLink
          key={`${nav.path}-${nav.title}`}
          to={
            !(isRestrictedUniversity && nav?.isPrivatePath)
              ? nav?.path
              : RESTRICTED_PATH
          }
          className={
            (nav.path === dashboardNav.path &&
              pathLocation.pathname !== dashboardNav.path) ||
            (nav.isPrivatePath && isRestrictedUniversity)
              ? 'inactive'
              : ''
          }
        >
          <Flex vertical gap={3} align="center">
            {!(isRestrictedUniversity && nav?.isPrivatePath) ? (
              nav?.icon
            ) : (
              <RestrictedIconSVG />
            )}
            <Typography.Text>{truncateString(nav?.title, 12)}</Typography.Text>
          </Flex>
        </NavLink>
      ))}
    </Flex>
  );
};

export default NavbarBottom;
