import AttendanceBoard from '@/components/Attendance/AttendanceBoard';
import AttendanceSkeleton from '@/components/Skeletons/AttendanceSkeleton';
import GenerateSkeleton from '@/components/Skeletons/GenerateSkeleton';
import { RootState } from '@/store/store';
import {
  formatUnixTimestampToDate,
  getStartingDateUnixTimeStamp,
  handleClickDateChangerBtn,
} from '@/utils/dateFunc';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Flex, Select, Typography } from 'antd';
import moment from 'moment';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import './style.scss';

interface ISelectOption {
  label: string;
  value: 'week' | 'month' | 'semester';
}

const Attendances = forwardRef<HTMLDivElement>((props, ref) => {
  const attendanceList = useSelector(
    (store: RootState) => store?.authSlice?.attendance
  );
  const { t } = useTranslation();

  const options: ISelectOption[] = [
    {
      label: t('const.week'),
      value: 'week',
    },
    {
      label: t('const.month'),
      value: 'month',
    },
  ];

  const [currentInterval, setCurrentInterval] = useState<ISelectOption>(
    options[0]
  );
  const attendances = attendanceList?.data;
  const currentSemester = useSelector(
    (store: RootState) => store.authSlice?.currentSemester
  );
  const [activeDate, setActiveDate] = useState<number>(
    getStartingDateUnixTimeStamp(moment().unix(), currentInterval.value)
  );

  const onSelectChange = (interval: ISelectOption) => {
    setCurrentInterval(interval);
  };

  const endDate =
    currentInterval.value === 'week'
      ? moment.unix(activeDate).add(5, 'days').unix()
      : moment.unix(activeDate).endOf('month').unix();

  const dateRange = `${formatUnixTimestampToDate(activeDate, '-', 'short')} — ${formatUnixTimestampToDate(endDate, '-', 'short')}`;

  const handleDateChange = useCallback(
    (timeStamp: number) => {
      const newDate = getStartingDateUnixTimeStamp(
        timeStamp,
        currentInterval.value
      );
      if (newDate !== timeStamp) {
        setActiveDate(newDate);
      }
    },
    [currentInterval.value]
  );

  useEffect(() => {
    handleDateChange(moment().unix());
  }, [handleDateChange]);

  useEffect(() => {
    if (!currentSemester) return;
    const currentWeeks = currentSemester?.weeks;
    if (!currentWeeks || !currentWeeks.length) return;
    if (currentWeeks[currentWeeks.length - 1]?.end_date < moment().unix()) {
      return setActiveDate(
        getStartingDateUnixTimeStamp(
          currentWeeks[0]?.start_date,
          currentInterval.value
        )
      );
    }
    return setActiveDate(
      getStartingDateUnixTimeStamp(
        moment().startOf('day').unix(),
        currentInterval.value
      )
    );
  }, [currentSemester, currentInterval.value]);

  return (
    <>
      <Card className="attendances dashboard__card" ref={ref} {...props}>
        <Flex
          className="attendances__header card__header"
          justify="space-between"
          align="center"
          wrap
          gap={10}
        >
          <Typography.Title level={4}>
            {t('dashboard.dashboard_page.attendances.title')}
          </Typography.Title>
          <Select
            labelInValue
            value={currentInterval}
            onChange={onSelectChange}
            options={options}
            style={{ minWidth: '116px' }}
          />
        </Flex>
        <Flex className="attendances__body card__body" vertical gap={4}>
          <Flex
            className="attendances__date-range"
            gap={10}
            justify="space-between"
            align="center"
          >
            <Button
              icon={<LeftOutlined />}
              onClick={() =>
                handleClickDateChangerBtn(
                  -1,
                  currentInterval.value,
                  setActiveDate
                )
              }
            />
            <Typography.Text strong>{dateRange}</Typography.Text>
            <Button
              icon={<RightOutlined />}
              onClick={() =>
                handleClickDateChangerBtn(
                  1,
                  currentInterval.value,
                  setActiveDate
                )
              }
            />
          </Flex>
          {attendances ? (
            <AttendanceBoard
              attendances={attendances}
              type={currentInterval.value}
              startDate={activeDate}
              endDate={endDate}
            />
          ) : !attendanceList ? (
            <GenerateSkeleton>
              <AttendanceSkeleton />
            </GenerateSkeleton>
          ) : (
            <Empty
              description={t('dashboard.dashboard_page.attendances.empty_text')}
            />
          )}
        </Flex>
      </Card>
    </>
  );
});

export default Attendances;
