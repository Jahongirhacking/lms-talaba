import { Button, Flex, Table, TableColumnsType, Typography } from 'antd';
import moment from 'moment';
import staticExamsData from './data';

const Exams = () => {
  const columns: TableColumnsType<any> = [
    {
      title: 'Fanlar',
      key: 'subjectName',
      dataIndex: 'subjectName',
      render: (_, record) => (
        <Flex vertical>
          <Typography.Text>{record?.subject?.name}</Typography.Text>
          <Typography.Text style={{ color: '#00000073' }}>
            {record?.subject?.lessonType} / {record?.employee}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: 'Natija',
      key: 'result',
      dataIndex: 'result',
      render: (_, record) => (
        <Flex vertical>
          <Typography.Text>
            {record?.exam_score?.score} ball /{' '}
            {Math.ceil(
              (record?.exam_score?.score / record?.exam_score?.max_score) * 100
            )}
            %
          </Typography.Text>
          <Typography.Text style={{ color: '#00000073' }}>
            {moment.unix(record?.date).format('DD.MM.YYYY HH:mm')} /{' '}
            {record?.max_attempts} ta urinish
          </Typography.Text>
        </Flex>
      ),
      className: 'exams-result-column',
    },
    {
      title: 'Maks. ball',
      key: 'maxBall',
      dataIndex: 'maxBall',
      render: (_, record) => (
        <Flex vertical>
          <Typography.Text>
            {record?.exam_score?.max_score} ball
          </Typography.Text>
          <Typography.Text style={{ color: '#00000073' }}>
            {record?.numberOfQuestions} ta savol / {record?.duration} daqiqa
          </Typography.Text>
        </Flex>
      ),
      className: 'exams-max_ball-column',
    },
    {
      title: 'Test davri',
      key: 'duration',
      dataIndex: 'duration',
      render: (_, record) => (
        <Flex vertical>
          <Typography.Text>
            {moment
              .unix(record?.deadline?.start_date)
              .format('DD.MM.YYYY HH:mm')}
          </Typography.Text>
          <Typography.Text style={{ color: '#00000073' }}>
            {moment.unix(record?.deadline?.end_date).format('DD.MM.YYYY HH:mm')}
          </Typography.Text>
        </Flex>
      ),
      className: 'exams-duration-column',
    },
    {
      title: 'Amallar',
      key: 'actions',
      dataIndex: 'actions',
      render: () => (
        <Flex gap={8}>
          <Button type="link">Natija</Button>
          <Button type="primary">Boshlash</Button>
        </Flex>
      ),
    },
  ];
  return (
    <div className="eduplan__subjects exams">
      <Table columns={columns} dataSource={staticExamsData} rowKey={'id'} />
    </div>
  );
};

export default Exams;
