import { Avatar, Flex, Typography } from 'antd'

const Chat = () => {
    return (
        <Flex vertical className='chat-container'>
            <Flex vertical gap={8} className='chat-box'>
                <Flex className='message-container user-message'>
                    <Flex gap={12} className='chat-message' wrap>
                        <Typography.Text className='message-text'>Assalomu alaykum!</Typography.Text>
                        <Typography.Text className='message-time'>23:46</Typography.Text>
                    </Flex>
                </Flex>
                <Flex className='message-container'>
                    <Avatar src="/images/avatar.png" style={{ width: 32 }}>AU</Avatar>
                    <Flex gap={12} className='chat-message' wrap>
                        <Typography.Text className='message-text'>Assalomu alaykum!</Typography.Text>
                        <Typography.Text className='message-time'>23:46</Typography.Text>
                    </Flex>
                </Flex>
                <Flex className='message-container user-message'>
                    <Flex gap={12} className='chat-message' wrap>
                        <Typography.Text className='message-text'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia sint sit consequatur. Laudantium nemo recusandae quidem laborum at dicta repellat, modi ducimus libero. Saepe itaque pariatur sed est ipsam corporis.!</Typography.Text>
                        <Typography.Text className='message-time'>23:46</Typography.Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Chat