import DashboardCardSkeleton from '@/components/Skeletons/DashboardCardSkeleton';
import GenerateSkeleton from '@/components/Skeletons/GenerateSkeleton';
import { setDrawer } from '@/store/slices/drawerSlice';
import { RootState } from '@/store/store';
import { DrawerChildTypes, SearchParams } from '@/utils/config';
import { Button, Flex } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import './DashboardPage.scss';
import useDashboardCards from './components/useDashboardCards';

export const DashboardPage = () => {
  const dashboardCards = useSelector(
    (store: RootState) => store.dashboardCardSlice
  );
  const dispatch = useDispatch();
  const dashboardCardsArray = useDashboardCards();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <section className="section dashboard__outlet upper-element">
      <Flex
        className="dashboard__title"
        justify="space-between"
        align="center"
        gap={16}
        wrap
      >
        <Flex className="dashboard-controls">
          <Button
            type="primary"
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set(
                SearchParams.Drawer,
                DrawerChildTypes.DashboardCards
              );
              setSearchParams(newParams);
              dispatch(
                setDrawer({
                  title: t('dashboard.dashboard_page.edit_cards_text'),
                })
              );
            }}
          >
            {t('dashboard.dashboard_page.manage_cards_button_text')}
          </Button>
        </Flex>
      </Flex>
      <div className="dashboard__outlet--content">
        <Flex className="dashboard__card-wrapper" wrap align="flex-start">
          {dashboardCardsArray?.length ? (
            dashboardCards
              .filter(card => card.isAdded)
              .map(card =>
                React.cloneElement(
                  dashboardCardsArray.find(
                    dashboardCard => dashboardCard.id === card.id
                  )?.children,
                  { key: card.id }
                )
              )
          ) : (
            <GenerateSkeleton numberOfRepetition={4}>
              <DashboardCardSkeleton />
            </GenerateSkeleton>
          )}
        </Flex>
      </div>
    </section>
  );
};
