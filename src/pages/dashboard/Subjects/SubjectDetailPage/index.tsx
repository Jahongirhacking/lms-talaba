import { LeftArrowSVG } from '@/assets/icon';
import { RootState } from '@/store/store';
import { Button, Flex } from 'antd';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import TopicsContainer from './components/TopicsContainer';
import './style.scss';

const SubjectDetailPage = () => {
  const navigate = useNavigate();
  // const { subjectId } = useParams();
  // const [getSubjectID, { data, isLoading }] = useGetSubjectIDMutation();
  // const [getSubjectRES, { data: resources }] = useGetSubjectResourceMutation();
  const currentSemester = useSelector(
    (store: RootState) => store.authSlice?.currentSemester
  );
  const prevRefSemesterCode = useRef<string | null>(null);

  // useEffect(() => {
  //   if (currentSemester) {
  //     getSubjectID({
  //       semestr: getExistedOne(currentSemester?.code, '11'),
  //       subject: `${subjectId}`,
  //     });
  //     getSubjectRES({
  //       semestr: getExistedOne(currentSemester?.code, '11'),
  //       subject: `${subjectId}`,
  //     });
  //   }
  // }, [getSubjectRES, getSubjectID, subjectId, currentSemester]);

  useEffect(() => {
    if (!currentSemester) return;
    if (!prevRefSemesterCode.current) {
      prevRefSemesterCode.current = currentSemester.code;
      return;
    }
    if (prevRefSemesterCode.current !== currentSemester.code) {
      navigate('/dashboard/subjects');
    }
  }, [currentSemester]);

  // if (isLoading)
  //   return (
  //     <GenerateSkeleton>
  //       <SubjectDetailSkeleton />
  //     </GenerateSkeleton>
  //   );

  // if (!data?.data) {
  //   return (
  //     <Result
  //       style={{ height: '100dvh', paddingTop: '80px' }}
  //       status="404"
  //       title="404"
  //       subTitle={`${t('const.sorry')}, ${t('const.subject')} ${t('const.not_found')}!`}
  //       extra={
  //         <Link to={'/dashboard/subjects'}>
  //           {t('const.back_to_section', { section: t('const.subjects') })}
  //         </Link>
  //       }
  //     />
  //   );
  // }

  return (
    <DashboardLayout
      title={(
        <Flex gap={16}>
          <Link to={'/dashboard/subjects'}>
            <Button icon={<LeftArrowSVG />} shape="circle" />
          </Link>
          Ma'lumotlar bazasi
        </Flex>
      )}
      extra={false}
    >
      <section className="section dashboard__outlet subject_details_page">
        <div className="dashboard__outlet--content">
          <Flex gap={24}>
            <TopicsContainer />
          </Flex>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default SubjectDetailPage;
