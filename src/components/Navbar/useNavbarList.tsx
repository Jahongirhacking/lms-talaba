import {
  BookIconSVG,
  CalendarIconSVG,
  DashboardIconSVG,
  DocumentIconSVG,
  FolderIconSVG,
  HelpIconSVG,
  LibraryIconSVG,
  LogOutIconSVG,
  MoneyIconSVG,
  PlanIconSVG,
  SettingIconSVG,
} from '@/assets/icon';
import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface INavbarList {
  title: string;
  icon: ReactElement;
  path?: string;
  isPrivatePath?: boolean;
}

const useNavbarList = () => {
  const [navbarList, setNavbarList] = useState<INavbarList[]>([]);
  const [navbarBottom, setNavbarBottom] = useState<INavbarList[]>([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setNavbarList([
      {
        title: (
          t('dashboard.navbar.navbarList', { returnObjects: true }) as string[]
        )[0],
        icon: <DashboardIconSVG />,
        path: '/dashboard',
        isPrivatePath: true,
      },
      {
        title: (
          t('dashboard.navbar.navbarList', { returnObjects: true }) as string[]
        )[1],
        icon: <CalendarIconSVG />,
        path: '/dashboard/timetable',
        isPrivatePath: true,
      },
      {
        title: (
          t('dashboard.navbar.navbarList', { returnObjects: true }) as string[]
        )[2],
        icon: <BookIconSVG />,
        path: '/dashboard/subjects',
        isPrivatePath: true,
      },
      {
        title: (
          t('dashboard.navbar.navbarList', { returnObjects: true }) as string[]
        )[3],
        icon: <DocumentIconSVG />,
        path: '/dashboard/eduplan',
        isPrivatePath: true,
      },
      {
        title: (
          t('dashboard.navbar.navbarList', { returnObjects: true }) as string[]
        )[4],
        icon: <PlanIconSVG />,
        path: '/dashboard/attendance',
        isPrivatePath: true,
      },
      {
        title: (
          t('dashboard.navbar.navbarList', { returnObjects: true }) as string[]
        )[5],
        icon: <MoneyIconSVG />,
        path: '/dashboard/payment',
      },

      // {
      //   title: (
      //     t('dashboard.navbar.navbarList', { returnObjects: true }) as string[]
      //   )[6],
      //   icon: <RestoreIconSVG />,
      //   path: '/dashboard/reeducation',
      // },
      {
        title: (
          t('dashboard.navbar.navbarList', { returnObjects: true }) as string[]
        )[7],
        icon: <FolderIconSVG />,
        path: '/dashboard/folders',
        isPrivatePath: true,
      },
      {
        title: (
          t('dashboard.navbar.navbarList', { returnObjects: true }) as string[]
        )[8],
        icon: <LibraryIconSVG />,
        path: '/dashboard/library',
        isPrivatePath: false,
      },
    ]);

    setNavbarBottom([
      {
        title: (
          t('dashboard.navbar.navbarBottom', {
            returnObjects: true,
          }) as string[]
        )[0],
        icon: <SettingIconSVG />,
        path: '/dashboard/settings',
        isPrivatePath: false,
      },
      {
        title: (
          t('dashboard.navbar.navbarBottom', {
            returnObjects: true,
          }) as string[]
        )[1],
        icon: <HelpIconSVG />,
        path: '/dashboard/help',
        isPrivatePath: false,
      },
      {
        title: (
          t('dashboard.navbar.navbarBottom', {
            returnObjects: true,
          }) as string[]
        )[2],
        icon: <LogOutIconSVG />,
        path: '/',
        isPrivatePath: false,
      },
    ]);
  }, [i18n.language]);

  return { navbarList, navbarBottom };
};

export default useNavbarList;
