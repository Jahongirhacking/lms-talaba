import {
  DashboardAppropriationSVG,
  DashboardAttendanceSVG,
  DashboardGpaScoreSVG,
  DashboardScheduleSVG,
  DashboardTasksSVG,
} from '@/assets/icon';
import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Appropriations from '../_Appropriations';
import Attendances from '../_Attendances';
import GpaScores from '../_GpaScores';
import Schedules from '../_Schedules';
import Tasks from '../_Tasks';

interface IDashboardCardObject {
  id: string;
  icon: ReactElement;
  title: string;
  children: ReactElement;
  index: number;
  linearGradient: string;
}

const useDashboardCards = (): IDashboardCardObject[] => {
  const [dashboardCards, setDashboardCards] = useState<IDashboardCardObject[]>(
    []
  );
  const { t } = useTranslation();

  useEffect(() => {
    const dashboardCardsObject = [
      {
        id: 'tasks',
        icon: <DashboardTasksSVG />,
        title: (
          t('dashboard.dashboard_page.card_names', {
            returnObjects: true,
          }) as string[]
        )[0],
        children: <Tasks />,
        index: 3,
        linearGradient: '135deg, #00E0F4 26.71%, #00F2BD 93.12%',
      },
      {
        id: 'schedules',
        icon: <DashboardScheduleSVG />,
        title: (
          t('dashboard.dashboard_page.card_names', {
            returnObjects: true,
          }) as string[]
        )[1],
        children: <Schedules />,
        index: 1,
        linearGradient: '90deg, #01A52F 16.01%, #BDDB08 100%',
      },
      {
        id: 'appropriation',
        icon: <DashboardAppropriationSVG />,
        title: (
          t('dashboard.dashboard_page.card_names', {
            returnObjects: true,
          }) as string[]
        )[2],
        children: <Appropriations />,
        index: 4,
        linearGradient: '136.64deg, #F400A7 25.75%, #B900F2 93.18%',
      },
      {
        id: 'attendance',
        icon: <DashboardAttendanceSVG />,
        title: (
          t('dashboard.dashboard_page.card_names', {
            returnObjects: true,
          }) as string[]
        )[3],
        children: <Attendances />,
        index: 2,
        linearGradient: '90deg, #1453e7 23%, #5bb8f1 100%',
      },
      {
        id: 'gpa-scores',
        icon: <DashboardGpaScoreSVG />,
        title: 'GPA',
        children: <GpaScores />,
        index: 5,
        linearGradient: '90deg, #F49200 23%, #F2CB00 100%',
      },
    ];
    setDashboardCards(dashboardCardsObject);
  }, []);

  return dashboardCards;
};

export default useDashboardCards;
