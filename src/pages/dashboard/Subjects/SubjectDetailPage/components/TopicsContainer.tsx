import { Divider, Flex, Progress, Typography } from "antd"
import TopicItem from "./TopicItem"

const TopicsContainer = () => {
    return (
        <Flex vertical className='topics-container'>
            <Flex gap={12} className='topics-title' align="center" justify="space-between">
                <Typography.Title level={3} style={{ margin: 0 }}>Darslar soni: 26</Typography.Title>
                <Progress percent={80} strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                }} />
            </Flex>
            <Divider style={{ margin: 0 }} />
            <Flex vertical className='topics-body' gap={8}>
                <TopicItem
                    status='watched'
                    title='HTML5 yangi standartlari va ularning vazifalari'
                    duration='15:05'
                />
                <TopicItem
                    status="watching"
                    title='HTML5 yangi standartlari va ularning vazifalari'
                    duration='15:05'
                />
                <TopicItem
                    status="not-watched"
                    title='HTML5 yangi standartlari va ularning vazifalari'
                    duration='15:05'
                />
                <TopicItem
                    status="not-watched"
                    title='HTML5 yangi standartlari va ularning vazifalari'
                    duration='15:05'
                />
            </Flex>
        </Flex>
    )
}

export default TopicsContainer