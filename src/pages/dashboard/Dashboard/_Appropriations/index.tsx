import DashedList from '@/components/DashedList';
import AppropriationSkeleton from '@/components/Skeletons/AppropriationSkeleton';
import GenerateSkeleton from '@/components/Skeletons/GenerateSkeleton';
import { useGetSubjectListMutation } from '@/services/dashboard';
import { setDrawer } from '@/store/slices/drawerSlice';
import { RootState } from '@/store/store';
import { DrawerChildTypes, SearchParams } from '@/utils/config';
import { getExamMark } from '@/utils/markFunc';
import {
  Button,
  Card,
  Collapse,
  Divider,
  Empty,
  Flex,
  Select,
  Typography,
} from 'antd';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import './style.scss';

interface ISelectOption {
  label: string;
  value: string;
}

const Appropriations = forwardRef<HTMLDivElement>((props, ref) => {
  const OVERALL_EXAM_CODE = '14';
  const [getSubjectList, { data: subjectList, isLoading }] =
    useGetSubjectListMutation();
  const semesters = useSelector(
    (store: RootState) => store.authSlice?.semestrs?.data
  );
  const currentSemester = useSelector(
    (store: RootState) => store.authSlice?.currentSemester
  );
  const [activeSemester, setActiveSemester] = useState<ISelectOption>({
    label: '',
    value: '',
  });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const subjects = subjectList?.data;
  const options: ISelectOption[] = semesters
    ? semesters?.map(semester => ({
        key: semester?.id,
        label: semester?.name,
        value: semester?.code,
      }))
    : [];

  const onSelectChange = (value: ISelectOption) => {
    setActiveSemester(value);
  };

  useEffect(() => {
    if (!semesters) return;
    if (currentSemester) {
      setActiveSemester({
        label: currentSemester.name,
        value: currentSemester.code,
      });
      return;
    }
    if (semesters.length) {
      setActiveSemester({
        label: semesters[0]?.name,
        value: semesters[0]?.code,
      });
      return;
    }
  }, [semesters]);

  useEffect(() => {
    if (currentSemester) {
      setActiveSemester({
        label: currentSemester?.name,
        value: currentSemester?.code,
      });
    }
  }, [currentSemester]);

  useEffect(() => {
    if (activeSemester && activeSemester.value) {
      getSubjectList({ semester: activeSemester.value });
    }
  }, [activeSemester]);

  return (
    <Card className="appropriations dashboard__card" ref={ref} {...props}>
      <Flex
        className="appropriations__header card__header"
        justify="space-between"
        align="center"
        wrap
        gap={10}
      >
        <Typography.Title level={4}>
          {t('dashboard.dashboard_page.appropriations.title')}
        </Typography.Title>
        <Select
          labelInValue
          value={activeSemester}
          onChange={onSelectChange}
          options={options}
          style={{ minWidth: '116px' }}
        />
      </Flex>
      <Flex className="appropriations__body card__body" vertical gap={8}>
        {isLoading ? (
          <GenerateSkeleton>
            <AppropriationSkeleton status="good" />
            <AppropriationSkeleton status="normal" />
            <AppropriationSkeleton status="bad" />
          </GenerateSkeleton>
        ) : subjects && subjects.length ? (
          subjects.map(subject => (
            <Collapse
              key={subject?.id}
              className="appropriation-card"
              expandIconPosition="end"
              items={[
                {
                  key: subject?.id,
                  label: (
                    <Flex
                      justify="space-between"
                      align="center"
                      wrap
                      style={{ rowGap: '10px', columnGap: '3px' }}
                    >
                      <Typography.Text strong>
                        {subject?.curriculumSubject?.subject?.name}
                      </Typography.Text>
                      {getExamMark(subject?.overallScore)}
                    </Flex>
                  ),
                  children: (
                    <Flex vertical gap={12}>
                      <DashedList
                        list={subject?.gradesByExam
                          ?.filter(
                            exam => exam?.examType?.code !== OVERALL_EXAM_CODE
                          )
                          ?.map(exam => ({
                            key: subject?.id,
                            label: exam?.examType?.name,
                            value: getExamMark(exam),
                          }))}
                        emptyElement={
                          <Empty
                            description={`${t('const.marks')} ${t('const.not_found')}`}
                          />
                        }
                        bordered={false}
                      />
                      <Divider style={{ margin: 0 }} />
                      {subject &&
                        subject.overallScore &&
                        subject.overallScore.examType && (
                          <DashedList
                            list={[
                              {
                                label: (
                                  <strong>
                                    {subject?.overallScore?.examType?.name}
                                  </strong>
                                ),
                                value: (
                                  <Button
                                    className="overall-grade"
                                    type="primary"
                                    onClick={() => {
                                      const newParams = new URLSearchParams(
                                        searchParams
                                      );
                                      newParams.set(
                                        SearchParams.Drawer,
                                        DrawerChildTypes.Appropriation
                                      );
                                      setSearchParams(newParams);
                                      dispatch(
                                        setDrawer({
                                          title: t('const.close'),
                                          props: { subject },
                                        })
                                      );
                                    }}
                                    style={{
                                      padding: '0px 7px',
                                      height: 'auto',
                                    }}
                                  >
                                    {`${subject?.overallScore?.grade} / ${subject?.overallScore?.max_ball}`}
                                  </Button>
                                ),
                              },
                            ]}
                            bordered={false}
                          />
                        )}
                    </Flex>
                  ),
                },
              ]}
            />
          ))
        ) : (
          <Empty
            description={t(
              'dashboard.dashboard_page.appropriations.empty_text'
            )}
          />
        )}
      </Flex>
    </Card>
  );
});

export default Appropriations;
