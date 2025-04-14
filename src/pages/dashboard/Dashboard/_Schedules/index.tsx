import Schedule from '@/components/Schedule';
import GenerateSkeleton from '@/components/Skeletons/GenerateSkeleton';
import ScheduleSkeleton from '@/components/Skeletons/ScheduleSkeleton';
import { useGetScheduleListMutation } from '@/services/dashboard';
import { RootState } from '@/store/store';
import {
  areTimestampsInSameDay,
  convertDateToDayName,
  formatUnixTimestampToDate,
  getCorrectWeek,
  getStartingDateUnixTimeStamp,
  handleClickDateChangerBtn,
  timeStringToMinutes,
} from '@/utils/dateFunc';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Flex, Typography } from 'antd';
import moment from 'moment';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import './style.scss';

const Schedules = forwardRef<HTMLDivElement>((props, ref) => {
  const [currentDate, setCurrentDate] = useState<number>(
    getStartingDateUnixTimeStamp(moment().unix(), 'day')
  );
  const [activeWeek, setActiveWeek] = useState<number>(0);
  const [getSchedules, { data: list, isLoading }] =
    useGetScheduleListMutation();
  const currentSemester = useSelector(
    (store: RootState) => store.authSlice?.currentSemester
  );
  const { t } = useTranslation();
  const schedules = list?.data;

  const handleClickPrev = () => {
    handleClickDateChangerBtn(-1, 'day', setCurrentDate);
  };
  const handleClickNext = () => {
    handleClickDateChangerBtn(1, 'day', setCurrentDate);
  };

  const filteredSortedSchedules = schedules
    ?.filter(
      schedule =>
        schedule.lessonPair &&
        areTimestampsInSameDay(schedule.lesson_date, currentDate)
    )
    .sort(
      (schedule1, schedule2) =>
        timeStringToMinutes(schedule1.lessonPair.start_time) -
        timeStringToMinutes(schedule2.lessonPair.start_time)
    );

  useEffect(() => {
    const newWeek = getCorrectWeek(currentDate, currentSemester);
    if (!newWeek) return;
    if (newWeek === activeWeek) return;
    getSchedules({
      week: `${newWeek}`,
    });
    setActiveWeek(newWeek);
  }, [getSchedules, currentDate, activeWeek, currentSemester]);

  useEffect(() => {
    if (!currentSemester) return;
    const currentWeeks = currentSemester?.weeks;
    if (!currentWeeks || !currentWeeks.length) return;
    if (currentWeeks[currentWeeks.length - 1]?.end_date < moment().unix()) {
      return setCurrentDate(currentWeeks[0]?.start_date);
    }
    return setCurrentDate(
      getStartingDateUnixTimeStamp(moment().startOf('day').unix(), 'day')
    );
  }, [currentSemester]);

  return (
    <Card className="schedules dashboard__card" ref={ref} {...props}>
      <Flex
        className="schedules__header card__header"
        justify="space-between"
        align="center"
        wrap
        gap={10}
      >
        <Flex vertical gap={2}>
          <Typography.Title level={4}>
            {t('dashboard.dashboard_page.schedules.title')}
            {areTimestampsInSameDay(currentDate, moment().unix()) &&
              ` - ${t('const.today')}`}
          </Typography.Title>
          <Typography.Text strong>
            {formatUnixTimestampToDate(currentDate)} -{' '}
            {convertDateToDayName(moment.unix(currentDate).unix(), 'short')}
          </Typography.Text>
        </Flex>
        <Flex gap={8}>
          <Button
            className="prev-btn"
            icon={<LeftOutlined />}
            onClick={handleClickPrev}
          />
          <Button
            className="next-btn"
            icon={<RightOutlined />}
            onClick={handleClickNext}
          />
        </Flex>
      </Flex>
      <Flex
        className="schedules__body card__body"
        vertical
        style={
          filteredSortedSchedules?.length === 0 && !isLoading
            ? { justifyContent: 'center' }
            : {}
        }
        gap={8}
      >
        {filteredSortedSchedules && filteredSortedSchedules.length > 0 ? (
          filteredSortedSchedules.map((schedule, index) => (
            <Schedule key={schedule?.id || index} schedule={schedule} />
          ))
        ) : isLoading ? (
          <GenerateSkeleton>
            <ScheduleSkeleton status="completed" />
            <ScheduleSkeleton status="processing" />
            <ScheduleSkeleton status="future" />
          </GenerateSkeleton>
        ) : (
          <Empty
            description={t('dashboard.dashboard_page.schedules.empty_text')}
          />
        )}
      </Flex>
    </Card>
  );
});

export default Schedules;
