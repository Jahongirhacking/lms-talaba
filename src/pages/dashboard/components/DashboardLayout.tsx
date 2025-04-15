import { Flex, Typography } from "antd"
import { ReactElement, ReactNode } from "react"
import HeaderProfile from "./HeaderProfile"

const DashboardLayout = ({ title, children, extra = true }: { title: ReactElement | string, children: ReactNode, extra?: boolean }) => {
    return (
        <Flex vertical className="dashboard-layout">
            <Flex className="dashboard-title" align="center" justify="space-between">
                <Typography.Title level={2} style={{ margin: 0 }}>
                    {title}
                </Typography.Title>
                {
                    extra && (
                        <HeaderProfile />
                    )
                }
            </Flex>
            {children}
        </Flex>
    )
}

export default DashboardLayout