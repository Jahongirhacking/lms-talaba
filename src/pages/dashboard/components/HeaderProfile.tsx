import useDeviceSize from "@/hooks/useDeviceSize"
import { toggleThemeColor } from "@/store/slices/themeSlice"
import { RootState } from "@/store/store"
import { MenuOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons"
import { Avatar, Button, Flex, Switch } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

const HeaderProfile = () => {
  const { authSlice: { profile, isMobileNavBottom }, themeSlice: { color: themeColor } } = useSelector((store: RootState) => store);
  const dispatch = useDispatch();
  const { isMobile, setIsNavbarActive } = useDeviceSize();

  return (
    <Flex gap={8} align="center">
      <Link to="/dashboard/profile" style={{ width: '32px' }}>
        <Avatar
          src={profile?.data?.image ?? '/images/avatar.png'}
          style={{ backgroundColor: '#8381D8' }}
        >
          {`${profile?.data?.first_name[0]}${profile?.data?.second_name[0]}`}
        </Avatar>
      </Link>

      <Switch
        value={themeColor === 'dark'}
        onChange={() => dispatch(toggleThemeColor())}
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
      />
      {/* <Button
                style={{
                  borderRadius: 6,
                  width: 32,
                  height: 32,
                  padding: 0,
                }}
                onClick={() => {
                  dispatch(
                    setDrawer({
                      isOpen: true,
                      title: t('dashboard.notifications_text'),
                      childType: 'notifications',
                      props: {},
                    })
                  );
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0026 10.5V7.16667C12.0026 5.12 10.9093 3.40667 9.00259 2.95333V2.5C9.00259 1.94667 8.54926 1.5 7.99592 1.5C7.44259 1.5 7.00259 1.94667 7.00259 2.5V2.95333C5.08926 3.40667 4.00259 5.11333 4.00259 7.16667V10.5L3.13592 11.36C2.71592 11.78 3.00926 12.5 3.60259 12.5H12.3826C12.9759 12.5 13.2759 11.78 12.8559 11.36L12.0026 10.5ZM7.99592 14.5C8.72926 14.5 9.32926 13.9 9.32926 13.1667H6.66259C6.66259 13.9 7.25592 14.5 7.99592 14.5ZM4.51592 2.98667C4.79592 2.73333 4.80259 2.3 4.53592 2.03333C4.28259 1.78 3.86926 1.77333 3.60926 2.02C2.46926 3.06 1.68259 4.47333 1.42926 6.06C1.36926 6.46667 1.68259 6.83333 2.09592 6.83333C2.41592 6.83333 2.69592 6.6 2.74926 6.28C2.94926 4.98667 3.58926 3.83333 4.51592 2.98667ZM12.4026 2.02C12.1359 1.77333 11.7226 1.78 11.4693 2.03333C11.2026 2.3 11.2159 2.72667 11.4893 2.98C12.4093 3.82667 13.0559 4.98 13.2559 6.27333C13.3026 6.59333 13.5826 6.82667 13.9093 6.82667C14.3159 6.82667 14.6359 6.46 14.5693 6.05333C14.3159 4.47333 13.5359 3.06667 12.4026 2.02Z"
                    fill="black"
                    fillOpacity="0.88"
                  />
                </svg>
              </Button> */}

      {!isMobileNavBottom && isMobile && (
        <Button
          icon={<MenuOutlined />}
          onClick={() => setIsNavbarActive(prev => !prev)}
        />
      )}
    </Flex>
  )
}

export default HeaderProfile