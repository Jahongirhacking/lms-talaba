import { NotWatchedVideoIcon, WatchedVideoIcon, WatchingVideoIcon } from '@/assets/icon'
import { Flex, Typography } from 'antd'

const TopicItem = ({ status, title, duration }: { status: "watched" | "watching" | 'not-watched', title: string, duration: string }) => {
    return (
        <Flex className={`topic-item ${status === "watching" ? "active" : 'inactive'}`} gap={12} justify='space-between' align='center'>
            <Flex gap={8}>
                {
                    status === 'watched' ? <WatchedVideoIcon /> : status === 'watching' ? <WatchingVideoIcon /> : <NotWatchedVideoIcon />
                }
                <Typography.Text>{title}</Typography.Text>
            </Flex>
            <Typography.Text className='duration'>{duration}</Typography.Text>
        </Flex>
    )
}

export default TopicItem