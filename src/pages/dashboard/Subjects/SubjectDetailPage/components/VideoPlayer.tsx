import { LeftArrowSVG, RightArrowSVG } from "@/assets/icon";
import { Button, Flex, Typography } from "antd";
import ReactPlayer, { ReactPlayerProps } from "react-player";

const VideoPlayer = ({ title, info, ...props }: { title: string, info: string } | ReactPlayerProps) => {
    return (
        <Flex vertical gap={16} className="video-container">
            <Typography.Title level={3} style={{ margin: 0 }}>{title}</Typography.Title>
            <ReactPlayer {...props} />
            <Typography.Text className="video-info">{info}</Typography.Text>
            <Flex justify="space-between" gap={24} wrap>
                <Button className="main-btn secondary-btn" icon={<LeftArrowSVG />}>Oldingi dars</Button>
                <Button className="main-btn primary-btn" icon={<RightArrowSVG />} iconPosition="end">Keyingi dars</Button>
            </Flex>
        </Flex>
    )
}

export default VideoPlayer