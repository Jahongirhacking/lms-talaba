import { RightOutlinedSVG } from '@/assets/icon';
import GenerateSkeleton from '@/components/Skeletons/GenerateSkeleton';
import TaskSkeleton from '@/components/Skeletons/TaskSkeleton';
import Task from '@/components/Task';
import { useGetTaskListMutation } from '@/services/dashboard';
import { ITaskList, ITaskStatus } from '@/services/dashboard/type';
import { setDrawer } from '@/store/slices/drawerSlice';
import { RootState } from '@/store/store';
import { DrawerChildTypes, SearchParams } from '@/utils/config';
import { getTaskStatus } from '@/utils/dateFunc';
import { Button, Card, Empty, Flex, Typography } from 'antd';
import { forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import './style.scss';

const Tasks = forwardRef<HTMLDivElement>((props, ref) => {
  const dispatch = useDispatch();
  const now = useSelector((store: RootState) => store.currentTimeSlice);
  const currentSemester = useSelector(
    (store: RootState) => store.authSlice?.currentSemester
  );
  const [getTaskList, { data: tasks, isLoading }] = useGetTaskListMutation();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = () => {};

  const handleClickTask = (task: ITaskList) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(SearchParams.Drawer, DrawerChildTypes.Task);
    newParams.set(
      SearchParams.DrawerProps,
      JSON.stringify({ taskId: task?.id })
    );
    setSearchParams(newParams);
    dispatch(
      setDrawer({
        title: t('dashboard.dashboard_page.tasks.drawer_title'),
      })
    );
  };

  useEffect(() => {
    if (currentSemester) {
      getTaskList({
        semester: currentSemester?.code,
      });
    }
  }, [getTaskList, currentSemester]);

  const getTaskByStatus = (tasks: ITaskList[], status: ITaskStatus) => {
    return tasks
      ?.filter(
        task =>
          getTaskStatus(task?.taskStatus?.code, task?.deadline, now) === status
      )
      .sort((task1, task2) => task1.deadline - task2.deadline);
  };

  // Sort by priority
  const tasksList =
    tasks && tasks.data
      ? [
          ...getTaskByStatus(tasks.data, 'important'),
          ...getTaskByStatus(tasks.data, 'new'),
          ...getTaskByStatus(tasks.data, 'sent'),
          ...getTaskByStatus(tasks.data, 'marked'),
          ...getTaskByStatus(tasks.data, 'expired'),
        ]
      : [];

  return (
    <Card className="tasks dashboard__card" ref={ref} {...props}>
      <Flex
        className="tasks__header card__header"
        justify="space-between"
        align="center"
        gap={10}
      >
        <Typography.Title level={4}>
          {t('dashboard.dashboard_page.tasks.title')}
        </Typography.Title>
        <Button
          className="details-btn"
          icon={<RightOutlinedSVG />}
          onClick={handleClick}
          style={{ visibility: 'hidden' }}
        />
      </Flex>
      <Flex
        className="tasks__body card__body"
        style={
          tasks?.data?.length === 0 && !isLoading
            ? { justifyContent: 'center' }
            : {}
        }
        vertical
        gap={8}
      >
        {tasksList && tasksList.length > 0 ? (
          tasksList?.map((task, index) => (
            <Task
              key={task?.id || index}
              task={task}
              onClick={() => handleClickTask(task)}
            />
          ))
        ) : isLoading ? (
          <GenerateSkeleton>
            <TaskSkeleton status="new" />
            <TaskSkeleton status="sent" />
          </GenerateSkeleton>
        ) : (
          <Empty description={t('dashboard.dashboard_page.tasks.empty_text')} />
        )}
      </Flex>
    </Card>
  );
});

export default Tasks;
