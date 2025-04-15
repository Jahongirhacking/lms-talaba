import { RightOutlinedSVG } from '@/assets/icon';
import { Navbar } from '@/components/Navbar/Navbar';
import NavbarBottom from '@/components/Navbar/NavbarBottom';
import useDeviceSize from '@/hooks/useDeviceSize';
import {
  useGetAllAttendeanceMutation,
  useGetProfileMutation,
  useGetSemestrMutation,
} from '@/services/users';
import {
  setCurrentSemester
} from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import {
  getLocalStorage,
  localStorageNames,
  setLocalStorage,
} from '@/utils/storageFunc';
import {
  Button,
  Flex
} from 'antd';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
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
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const semestrs = useSelector((store: RootState) => store.authSlice?.semestrs);
  const currentSemester = useSelector(
    (store: RootState) => store.authSlice?.currentSemester
  );
  const isMobileNavBottom = useSelector(
    (store: RootState) => store.authSlice.isMobileNavBottom
  );
  const currentSemesterRef = useRef(currentSemester);

  const [getProfile, { error }] = useGetProfileMutation();
  const [getSemestr] = useGetSemestrMutation();
  const [getAttendance] = useGetAllAttendeanceMutation();

  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const toggleMenuButtonRef = useRef<HTMLButtonElement>(null);
  const [activeSemester, setActiveSemester] =
    useState<ISemesterSelectProp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [noResponseFromServer, setNoResponseFromServer] = useState(false);
  const { isNavbarActive, setIsNavbarActive, deviceSize, isMobile } = useDeviceSize();

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

          <div className="dashboard__body--box">
            <Flex vertical>
              <Outlet />
            </Flex>
          </div>
          {isMobileNavBottom && <NavbarBottom />}
        </div>
      </div>
    </DashboardContext.Provider>
  );
};
