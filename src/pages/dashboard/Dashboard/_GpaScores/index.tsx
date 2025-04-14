import DashedList from '@/components/DashedList';
import AppropriationSkeleton from '@/components/Skeletons/AppropriationSkeleton';
import GenerateSkeleton from '@/components/Skeletons/GenerateSkeleton';
import { useGetGpaScoreMutation } from '@/services/dashboard';
import { RootState } from '@/store/store';
import { getExamMark } from '@/utils/markFunc';
import { toFirstCapitalLetter, toFirstLowerLetter } from '@/utils/stringFunc';
import { Card, Collapse, Divider, Empty, Flex, Tag, Typography } from 'antd';
import { forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import './style.scss';

const GpaScores = forwardRef<HTMLDivElement>((props, ref) => {
  const MAX_SCORE = 5;
  const [getGpaScore, { data, isLoading }] = useGetGpaScoreMutation();
  const currentSemester = useSelector(
    (store: RootState) => store.authSlice?.currentSemester
  );
  const { t } = useTranslation();

  const gpaScores =
    data?.data &&
    [...data?.data].sort(
      (gpa1, gpa2) =>
        Number.parseInt(gpa2?.educationYear?.code) -
        Number.parseInt(gpa1?.educationYear?.code)
    );

  useEffect(() => {
    if (currentSemester) {
      getGpaScore({ semester: currentSemester?.code });
    }
  }, [getGpaScore, currentSemester]);

  return (
    <Card className="gpa-score dashboard__card" ref={ref} {...props}>
      <Flex
        className="gpa-score__header card__header"
        justify="space-between"
        align="center"
        wrap
        gap={10}
      >
        <Typography.Title level={4}>GPA</Typography.Title>
      </Flex>
      <Flex className="gpa-score__body card__body" vertical gap={8}>
        {isLoading ? (
          <GenerateSkeleton>
            <AppropriationSkeleton status="good" />
            <AppropriationSkeleton status="normal" />
            <AppropriationSkeleton status="bad" />
          </GenerateSkeleton>
        ) : gpaScores && gpaScores.length ? (
          gpaScores.map((gpaScore, index) => {
            const score = {
              grade: Number.parseFloat(gpaScore?.gpa),
              max_ball: MAX_SCORE,
              percent: (Number.parseFloat(gpaScore?.gpa) / MAX_SCORE) * 100,
            };

            return (
              <Collapse
                key={gpaScore?.id}
                defaultActiveKey={0}
                className="gpa-score-card"
                expandIconPosition="end"
                items={[
                  {
                    key: index,
                    label: (
                      <Flex
                        justify="space-between"
                        align="center"
                        wrap
                        style={{ rowGap: '10px', columnGap: '3px' }}
                      >
                        <Typography.Text strong>
                          {`${gpaScore?.educationYear?.name} | ${gpaScore?.level?.name}`}
                        </Typography.Text>
                        {getExamMark(score, 'GPA', false)}
                      </Flex>
                    ),
                    children: (
                      <Flex vertical gap={12}>
                        <DashedList
                          list={[
                            {
                              label: toFirstCapitalLetter(
                                t('const.credit_singular')
                              ),
                              value: (
                                <Tag color="orange">{gpaScore?.credit_sum}</Tag>
                              ),
                            },
                            {
                              label: t('const.debt'),
                              value: (
                                <Tag color="orange">{`${gpaScore?.debt_subjects} / ${gpaScore?.subjects}`}</Tag>
                              ),
                            },
                            {
                              label: t('const.gpa_method'),
                              value: (
                                <Tag color="purple">
                                  {gpaScore?.method === 'all_year'
                                    ? t('const.total_gpa')
                                    : t('const.annual_gpa')}
                                </Tag>
                              ),
                            },
                          ]}
                          emptyElement={
                            <Empty
                              description={`GPA ${t('const.not_found')}`}
                            />
                          }
                          bordered={false}
                        />
                        <Divider style={{ margin: 0 }} />
                        <DashedList
                          list={[
                            {
                              label: <strong>GPA</strong>,
                              value: getExamMark(score, 'GPA'),
                            },
                          ]}
                          bordered={false}
                        />
                      </Flex>
                    ),
                  },
                ]}
              />
            );
          })
        ) : (
          <Empty
            description={`GPA ${toFirstLowerLetter(t('const.info'))} ${t('const.not_found')}`}
          />
        )}
      </Flex>
    </Card>
  );
});

export default GpaScores;
