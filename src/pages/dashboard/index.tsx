import { RightOutlinedSVG } from '@/assets/icon';
import { Navbar } from '@/components/Navbar/Navbar';
import NavbarBottom from '@/components/Navbar/NavbarBottom';
import useNavbarList from '@/components/Navbar/useNavbarList';
import {
  useGetAllAttendeanceMutation,
  useGetProfileMutation,
  useGetSemestrMutation,
} from '@/services/users';
import {
  setCurrentSemester,
  setMobileNavBottom,
  setStateIsMobile
} from '@/store/slices/authSlice';
import { toggleThemeColor } from '@/store/slices/themeSlice';
import { RootState } from '@/store/store';
import {
  getLocalStorage,
  localStorageNames,
  setLocalStorage,
} from '@/utils/storageFunc';
import { truncateString } from '@/utils/stringFunc';
import { MenuOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import {
  Avatar,
  Breadcrumb,
  Button,
  Flex, Select,
  Spin,
  Switch,
  Tooltip,
  Typography
} from 'antd';
import { t } from 'i18next';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './main.scss';

interface IDashboardContext {
  isMobile: boolean;
  isNavbarActive: boolean;
  setIsNavbarActive: React.Dispatch<React.SetStateAction<boolean>>;
  deviceSize: number;
  toggleButtonRef: { current: HTMLButtonElement };
  toggleMenuButtonRef: { current: HTMLButtonElement };
}

interface ISemesterSelectProp {
  label: string;
  value: string;
}

export const DashboardContext = createContext<IDashboardContext>(null);

export const Dashboard = () => {
  const MOBILE_SIZE = 670;
  const location = useLocation();
  // const navigate = useNavigate();
  const pathNames = location.pathname.split('/').filter(name => name);
  const dispatch = useDispatch();
  const semestrs = useSelector((store: RootState) => store.authSlice?.semestrs);
  const currentSemester = useSelector(
    (store: RootState) => store.authSlice?.currentSemester
  );
  const profile = useSelector((store: RootState) => store.authSlice?.profile);
  const isMobileNavBottom = useSelector(
    (store: RootState) => store.authSlice.isMobileNavBottom
  );
  const themeColor = useSelector((store: RootState) => store.themeSlice.color);
  const currentSemesterRef = useRef(currentSemester);

  const [getProfile, { error }] = useGetProfileMutation();
  const [getSemestr] = useGetSemestrMutation();
  const [getAttendance] = useGetAllAttendeanceMutation();

  const [deviceSize, setDeviceSize] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(deviceSize < MOBILE_SIZE);
  const [isNavbarActive, setIsNavbarActive] = useState<boolean>(!isMobile);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const toggleMenuButtonRef = useRef<HTMLButtonElement>(null);
  const [activeSemester, setActiveSemester] =
    useState<ISemesterSelectProp | null>(null);
  const { navbarList } = useNavbarList();
  const [isLoading, setIsLoading] = useState(true);
  // const [noResponseFromServer, setNoResponseFromServer] = useState(false);

  const onSemesterChange = (semester: ISemesterSelectProp) => {
    setActiveSemester(semester);
  };

  console.error(error);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const errorRes: any = error;

  // Expired token
  // useEffect(() => {
  //   if (errorRes?.status === 403) {
  //     navigate('/');
  //     dispatch(logout());
  //     message.warning(t('dashboard.expired_token_text'));
  //   }
  // }, [dispatch, errorRes, navigate]);

  // Fetch data
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    getSemestr();
  }, [getSemestr]);

  useEffect(() => {
    getAttendance();
  }, [getAttendance]);

  useEffect(() => {
    currentSemesterRef.current = currentSemester;
  }, [currentSemester]);

  // Loading card
  // Set semester
  useEffect(() => {
    // if no response from server
    const intervalId = setInterval(() => {
      if (!currentSemesterRef.current) {
        // setNoResponseFromServer(true);
      }
    }, 15000);
    if (!currentSemester) return;

    // if response come
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      // setNoResponseFromServer(false);
    }

    setActiveSemester({
      label: currentSemester?.name,
      value: currentSemester?.code,
    });

    clearInterval(intervalId);
    return () => {
      clearInterval(intervalId);
    };
  }, [currentSemester]);

  // nor response
  // useEffect(() => {
  //   if (noResponseFromServer) {
  //     Modal.warning({
  //       title: t('off_topic.no_response_server_title'),
  //       content: t('off_topic.no_response_server_content'),
  //       onCancel() {
  //         localStorage.removeItem(localStorageNames.HEMIS_TOKEN);
  //         localStorage.removeItem(localStorageNames.university);
  //         localStorage.removeItem(localStorageNames.universityApi);
  //         window.location.href = '/';
  //       },
  //       onOk() {
  //         setNoResponseFromServer(false);
  //       },
  //       cancelText: t('const.yes'),
  //       okText: t('const.no'),
  //       okCancel: true,
  //     });
  //   }
  // }, [noResponseFromServer]);

  // dispatch active semester
  useEffect(() => {
    if (activeSemester) {
      dispatch(
        setCurrentSemester(
          semestrs?.data?.find(
            semester => semester?.code === activeSemester?.value
          )
        )
      );
    }
  }, [activeSemester]);

  // Handle resize event (mobile)
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setDeviceSize(currentWidth);
      setIsMobile(currentWidth < MOBILE_SIZE);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle navbar
  useEffect(() => {
    dispatch(setStateIsMobile(isMobile));
    setIsNavbarActive(!isMobile);
    if (
      isMobile &&
      getLocalStorage(localStorageNames.isMobileNavBottom) === null
    ) {
      dispatch(setMobileNavBottom(true));
    }
  }, [isMobile]);

  // Storage functions
  useEffect(() => {
    const clearTemporaryTabs = () => {
      setLocalStorage(localStorageNames.temporaryTabs, {});
    };

    if (!getLocalStorage(localStorageNames.savedTabs)) {
      setLocalStorage(localStorageNames.savedTabs, {});
    }

    clearTemporaryTabs();
    window.addEventListener('beforeunload', clearTemporaryTabs);
    return () => {
      window.removeEventListener('beforeunload', clearTemporaryTabs);
    };
  }, []);

  // Desktop navbar toggle
  const onToggleNavbar = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsNavbarActive(prev => !prev);
  };

  return (
    <DashboardContext.Provider
      value={{
        isMobile,
        setIsNavbarActive,
        isNavbarActive,
        deviceSize,
        toggleButtonRef,
        toggleMenuButtonRef,
      }}
    >
      <div className="dashboard">
        <div
          className={`dashboard__navbar ${isNavbarActive ? 'active' : 'inactive'}`}
        >
          {!isMobileNavBottom && <Navbar />}

          {!isMobileNavBottom && !isMobile && (
            <Button
              ref={toggleButtonRef}
              shape="circle"
              icon={<RightOutlinedSVG />}
              className="nav__toggle-btn"
              onClick={onToggleNavbar}
            />
          )}
        </div>
        <div className={`dashboard__body`}>
          {/* {isLoading && <Loading />} */}
          <Flex
            className="dashboard__header upper-element"
            justify="space-between"
            align="center"
            gap={5}
            wrap
          >
            <Flex gap={8} align="flex-end">
              <Typography.Text strong className="semester-name">
                {currentSemester ? (
                  <Select
                    labelInValue
                    style={{ width: '115px' }}
                    options={semestrs?.data?.map(semester => ({
                      label: semester?.name,
                      value: semester?.code,
                    }))}
                    value={activeSemester}
                    onChange={onSemesterChange}
                  />
                ) : (
                  <Spin />
                )}
              </Typography.Text>
              {profile?.data?.group?.name && (
                <Tooltip placement="bottom" title={profile?.data?.group?.name}>
                  <Typography.Text className="group-name">
                    {truncateString(profile?.data?.group?.name, 10)}
                  </Typography.Text>
                </Tooltip>
              )}
            </Flex>

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
                  ref={toggleMenuButtonRef}
                />
              )}
            </Flex>
          </Flex>

          <div className="dashboard__body--box">
            <Flex vertical>
              <Breadcrumb
                style={{ marginBottom: 16 }}
                items={[
                  {
                    title: t('const.main'),
                  },
                  ...pathNames.map((name, index) => {
                    const fullPath = `/${pathNames.slice(0, index + 1).join('/')}`;
                    const navItem = navbarList.find(
                      nav => nav.path === fullPath
                    );
                    return {
                      title: (
                        <Link to={fullPath}>
                          {(navItem && navItem.title) || name}
                        </Link>
                      ),
                    };
                  }),
                ]}
              />
              <Outlet />
            </Flex>
          </div>
          {isMobileNavBottom && <NavbarBottom />}
        </div>
      </div>
    </DashboardContext.Provider>
  );
};
