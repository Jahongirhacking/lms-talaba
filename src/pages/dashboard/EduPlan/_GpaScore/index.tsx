import { useGetGpaScoreMutation } from '@/services/dashboard';
import { IGpaScore } from '@/services/dashboard/type';
import { setDrawer } from '@/store/slices/drawerSlice';
import { RootState } from '@/store/store';
import { DrawerChildTypes, SearchParams } from '@/utils/config';
import { getExamMark } from '@/utils/markFunc';
import { toFirstCapitalLetter, toFirstLowerLetter } from '@/utils/stringFunc';
import { Button, Empty, Skeleton, Table, TableColumnsType } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const GpaScore = () => {
  const { t } = useTranslation();
  const [getGpaScore, { data, isLoading }] = useGetGpaScoreMutation();
  const currentSemester = useSelector(
    (store: RootState) => store?.authSlice?.currentSemester
  );
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const gpaScores = data?.data;

  useEffect(() => {
    if (currentSemester) {
      getGpaScore({ semester: currentSemester?.code });
    }
  }, [getGpaScore]);

  const handleClickMoreDetail = record => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(SearchParams.Drawer, DrawerChildTypes.GpaDetail);
    setSearchParams(newParams);
    dispatch(
      setDrawer({
        title: t('const.in_detail'),
        props: { gpaScore: record },
      })
    );
  };

  const columns: TableColumnsType<IGpaScore> = [
    {
      title: t('const.academic_year'),
      key: 'academic_year',
      dataIndex: 'academic_year',
      render: (_, record) => record?.educationYear?.name,
      className: 'gpa-academic_year-column',
    },
    {
      title: t('const.course'),
      key: 'course',
      dataIndex: 'course',
      render: (_, record) => record?.level?.name,
    },
    {
      title: 'GPA',
      key: 'gpa',
      dataIndex: 'gpa',
      render: value =>
        getExamMark(
          {
            grade: Number.parseFloat(value),
            max_ball: 5,
            percent: (Number.parseFloat(value) / 5) * 100,
          },
          'GPA',
          false
        ),
    },
    {
      title: toFirstCapitalLetter(t('const.credit_singular')),
      key: 'credit_sum',
      dataIndex: 'credit_sum',
      className: 'gpa-credit-column',
    },
    {
      title: t('const.debt'),
      key: 'debt',
      dataIndex: 'debt',
      render: (_, record) => `${record?.debt_subjects} / ${record?.subjects}`,
      className: 'gpa-debt-column',
    },
    {
      title: t('const.gpa_method'),
      key: 'method',
      dataIndex: 'method',
      render: (_, record) =>
        record?.method === 'all_year'
          ? t('const.total_gpa')
          : t('const.annual_gpa'),
      className: 'gpa-method-column',
    },
    {
      title: t('const.in_detail'),
      key: 'actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => handleClickMoreDetail(record)}>
          Batafsil
        </Button>
      ),
      className: 'gpa-actions-column',
    },
  ];

  if (!gpaScores)
    return (
      <Empty
        description={`GPA ${toFirstLowerLetter(t('const.info'))} ${t('const.not_found')}`}
      />
    );

  return (
    <Table
      className="gpa-table"
      columns={columns}
      dataSource={[...gpaScores].sort(
        (gpaScore1, gpaScore2) =>
          Number(gpaScore2?.educationYear?.code) -
          Number(gpaScore1?.educationYear?.code)
      )}
      rowKey={'id'}
      pagination={false}
      locale={{
        emptyText: isLoading ? (
          <Skeleton active />
        ) : (
          <Empty
            description={`${t('const.info')} ${t('const.not_found')}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
            }}
          />
        ),
        filterReset: t('const.clean'),
      }}
    />
  );
};

export default GpaScore;
