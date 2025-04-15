import {
  useGetSubjectIDMutation,
  useGetSubjectsMutation,
} from '@/services/dashboard';
import { ISubject, ISubjects } from '@/services/dashboard/type';
import { ISemestr } from '@/services/users/type';
import { RootState } from '@/store/store';
import { Card, Flex, Image, Progress, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './Subjects.scss';

export const SubjectsPage = () => {
  const [getSubjectList, { data: subjectList }] =
    useGetSubjectsMutation();
  const [subjects, setSubjects] = useState<Map<string, ISubject>>(new Map());
  const [getSubjectId] = useGetSubjectIDMutation();
  const currentSemester = useSelector(
    (store: RootState) => store.authSlice?.currentSemester
  );
  const { t } = useTranslation();

  const getEncodedKey = (
    currentSemester: ISemestr | null,
    subject: ISubjects
  ): string => {
    return `${currentSemester?.code}-${subject?.subject?.id}`;
  };

  useEffect(() => {
    if (currentSemester) {
      getSubjectList({
        semester: currentSemester?.code,
      });
    }
  }, [getSubjectList, currentSemester]);

  useEffect(() => {
    subjectList?.data?.map(async sub => {
      const encodedKey = getEncodedKey(currentSemester, sub);
      if (subjects.has(encodedKey)) return;
      const res = await getSubjectId({
        semestr: currentSemester?.code,
        subject: `${sub?.subject?.id}`,
      });
      if ('data' in res && 'data' in res.data) {
        setSubjects(prevSubjects => {
          const newSubjects = new Map(prevSubjects);
          newSubjects.set(encodedKey, res.data.data);
          return newSubjects;
        });
      }
    });
  }, [subjectList]);

  return (
    <DashboardLayout title={t('dashboard.subjects_page.title')}>
      <section className="section dashboard__outlet upper-element">
        <div className="dashboard__outlet--content">
          <Flex
            className="subjects__card-wrapper"
            wrap
            align="flex-start"
            gap={24}
            key={currentSemester?.code}
          >
            <Link
              key={0}
              className="subject-link"
              to={`/dashboard/subjects/1`}
            >
              <Card className="subjects__card" hoverable>
                <Flex
                  vertical
                  gap={12}
                  justify="space-between"
                  style={{ minHeight: '144px' }}
                >
                  <Image src='/images/example_subject.jpg' preview={false} />
                  <Flex className="subject-info" vertical>
                    <Typography.Title level={4}>
                      Ma'lumotlar bazasi
                    </Typography.Title>
                    <Flex className="dashboard__details-list">
                      <Typography.Text>
                        Majburiy
                      </Typography.Text>
                      <Typography.Text>
                        120{' '}
                        {t('const.hours_plural')}
                      </Typography.Text>
                      <Typography.Text>
                        {Number(6).toFixed(1)}{' '}
                        {6 > 1
                          ? t('const.credit_plural')
                          : t('const.credit_singular')}
                      </Typography.Text>
                    </Flex>
                  </Flex>

                  <Flex
                    className="subject__task-completion"
                    align="flex-end"
                    wrap
                    style={{ rowGap: '10px', columnGap: '20px' }}
                  >
                    <Progress
                      percent={80}
                      style={{ flex: 1, minWidth: '160px' }}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                  </Flex>
                </Flex>
              </Card>
            </Link>

            {/* {!isLoading && currentSemester ? (
            <>
              {subjectList && subjectList.data?.length > 0 ? (
                subjectList.data.map((subject, index) => {
                  const subjectItem = subjects.get(
                    getEncodedKey(currentSemester, subject)
                  );
                  const percent = subjectItem?.tasks_count
                    ? Math.round(
                        (subjectItem?.marked_count / subjectItem?.tasks_count) *
                          100
                      )
                    : 0;

                  return (
                    <Link
                      key={index}
                      className="subject-link"
                      to={`/dashboard/subjects/${subject?.subject?.id}`}
                    >
                      <Card className="subjects__card" hoverable>
                        <Flex
                          vertical
                          gap={12}
                          justify="space-between"
                          style={{ minHeight: '144px' }}
                        >
                          <Flex className="subject-info" vertical>
                            <Typography.Title level={4}>
                              {subject?.subject?.name}
                            </Typography.Title>
                            <Flex className="dashboard__details-list">
                              <Typography.Text>
                                {subject?.subjectType?.name}
                              </Typography.Text>
                              <Typography.Text>
                                {subject?.total_acload}{' '}
                                {t('const.hours_plural')}
                              </Typography.Text>
                              <Typography.Text>
                                {subject?.credit.toFixed(1)}{' '}
                                {subject?.credit > 1
                                  ? t('const.credit_plural')
                                  : t('const.credit_singular')}
                              </Typography.Text>
                            </Flex>
                          </Flex>

                          <Flex
                            className="subject__task-completion"
                            align="flex-end"
                            wrap
                            style={{ rowGap: '10px', columnGap: '20px' }}
                          >
                            <Flex vertical gap={4} style={{ color: '#1677FF' }}>
                              {subjectItem ? (
                                <Typography.Title
                                  style={{
                                    fontSize: '24px',
                                    margin: 0,
                                    color: 'inherit',
                                    width: 100,
                                  }}
                                >
                                  {`${subjectItem?.marked_count ?? 0} / ${subjectItem?.tasks_count ?? 0}`}
                                </Typography.Title>
                              ) : (
                                <Skeleton.Button active size="small" />
                              )}

                              <Typography.Text
                                style={{
                                  fontSize: '12px',
                                  width: 'max-content',
                                  color: 'inherit',
                                }}
                              >
                                {t('const.tasks')}
                              </Typography.Text>
                            </Flex>
                            <Progress
                              format={() =>
                                !subjectItem ? (
                                  <Spin size="small" />
                                ) : percent === 100 ? (
                                  <CheckCircleFilled />
                                ) : (
                                  `${percent}%`
                                )
                              }
                              percent={percent}
                              style={{ flex: 1, minWidth: '160px' }}
                            />
                          </Flex>
                        </Flex>
                      </Card>
                    </Link>
                  );
                })
              ) : isLoading ? (
                <GenerateSkeleton numberOfRepetition={4}>
                  <SubjectCardSkeleton />
                </GenerateSkeleton>
              ) : (
                <Empty
                  description={`${t('const.subjects')} ${t('const.not_found')}`}
                />
              )}
            </>
          ) : (
            <GenerateSkeleton numberOfRepetition={4}>
              <SubjectCardSkeleton />
            </GenerateSkeleton>
          )} */}
          </Flex>
        </div>
      </section>
    </DashboardLayout>
  );
};
