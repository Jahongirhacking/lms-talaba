import { LeftArrowSVG, TasksListIcon, VideoAndResourcesIcon } from '@/assets/icon';
import FileList from '@/components/FileList';
import { RootState } from '@/store/store';
import { Button, Divider, Flex, Segmented, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Tasks from './_Tasks';
import Chat from './components/Chat';
import TopicsContainer from './components/TopicsContainer';
import VideoPlayer from './components/VideoPlayer';
import './style.scss';

enum OptionValue {
  Video = 'video',
  Task = 'task'
}

const SubjectDetailPage = () => {
  const navigate = useNavigate();
  // const { subjectId } = useParams();
  // const [getSubjectID, { data, isLoading }] = useGetSubjectIDMutation();
  // const [getSubjectRES, { data: resources }] = useGetSubjectResourceMutation();
  const currentSemester = useSelector(
    (store: RootState) => store.authSlice?.currentSemester
  );
  const prevRefSemesterCode = useRef<string | null>(null);
  const options = [
    { label: "Video va resurslar", icon: <VideoAndResourcesIcon />, value: OptionValue.Video },
    { label: "Topshiriqlar jadvali", icon: <TasksListIcon />, value: OptionValue.Task }
  ]
  const [selectedOption, setSelectedOption] = useState(options[0].value);

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
        <Flex gap={25} justify="space-between" className='details-header' wrap>
          <Flex gap={16} align='center'>
            <Link to={'/dashboard/subjects'}>
              <Button icon={<LeftArrowSVG />} shape="circle" />
            </Link>
            <span className='subject-name'>Ma'lumotlar bazasi</span>
          </Flex>
          <Segmented
            options={options}
            onChange={(value) => setSelectedOption(value)}
          />
        </Flex>
      )}
      extra={false}
    >
      <section className="section dashboard__outlet subject_details_page">
        <div className="dashboard__outlet--content">
          <Flex gap={24} className='details-body'>
            <TopicsContainer />
            <Flex vertical className='main-content'>
              {
                selectedOption === OptionValue.Video && (
                  <Flex vertical gap={24}>
                    <VideoPlayer
                      controls
                      title='Kirish.“O‘zbekistonning eng yangi tarixi” o‘quv fanining predmeti, maqsadi va vazifalari, nazariy-metodologik tamoyillari.'
                      url='/videos/demo.mp4'
                      info="Excel dasturini noldan tushunishga yordam beradigan amaliy onlayn kurs. 14 ta video-dars davomida siz asosiy funksiyalarni o‘rganasiz: jadval va formulalar bilan ishlash, diagrammalar yaratish, hisobotlar tayyorlash."
                    />
                    <Divider style={{ margin: 0 }} />
                    <Flex vertical gap={20}>
                      <Typography.Title level={5} style={{ margin: 0 }}>Resurslar</Typography.Title>
                      <FileList
                        files={[
                          { name: "Bootstrap_freymvork_texnologiyasi.docx", size: 5242880, url: '#' },
                          { name: "Bootstrap_freymvork_texnologiyasi.xlsx", size: 5242880, url: '#' }
                        ]}
                      />
                    </Flex>
                    <Divider style={{ margin: 0 }} />
                    <Flex vertical gap={24}>
                      <Typography.Title level={5} style={{ margin: 0 }}>Chat</Typography.Title>
                      <Chat />
                    </Flex>
                  </Flex>
                )
              }
              {
                selectedOption === OptionValue.Task && (
                  <Flex vertical gap={24}>
                    <Tasks tasks={{ tasks: [] }} />
                  </Flex>
                )
              }
            </Flex>
          </Flex>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default SubjectDetailPage;
