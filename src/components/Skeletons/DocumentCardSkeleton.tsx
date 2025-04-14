import { Card, Flex, Skeleton } from 'antd';

const DocumentCardSkeleton = () => {
  return (
    <Flex
      className="student-document--wrapper"
      wrap
      gap={24}
      justify="flex-start"
      style={{ width: '100%' }}
    >
      <Card className="document-card">
        <Flex vertical gap={16} justify="space-between">
          <Flex vertical gap={16}>
            <Skeleton active />
          </Flex>
          <Skeleton.Button
            className="document-download-btn-skeleton"
            active
            style={{ backgroundColor: '#1677ff' }}
          />
        </Flex>
      </Card>
      <Card className="document-card">
        <Flex vertical gap={16} justify="space-between">
          <Flex vertical gap={16}>
            <Skeleton active />
          </Flex>
          <Skeleton.Button
            className="document-download-btn-skeleton"
            active
            style={{ backgroundColor: '#1677ff' }}
          />
        </Flex>
      </Card>
    </Flex>
  );
};

export default DocumentCardSkeleton;
