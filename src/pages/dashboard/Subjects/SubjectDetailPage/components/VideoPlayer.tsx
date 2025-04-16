import { Flex, Typography } from "antd";
import ReactPlayer, { ReactPlayerProps } from "react-player";

const VideoPlayer = ({ title, info, ...props }: { title: string, info: string } | ReactPlayerProps) => {
    return (
        <Flex vertical gap={16}>
            <Typography.Title level={3} style={{ margin: 0 }}>{title}</Typography.Title>
            <ReactPlayer {...props} />
            <Typography.Text>{info}</Typography.Text>
        </Flex>
    )
}

export default VideoPlayer