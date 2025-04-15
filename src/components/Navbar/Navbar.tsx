import { Link } from 'react-router-dom';
import './navbar.scss';

import { RestrictedIconSVG } from '@/assets/icon';
import { useParamActions } from '@/hooks/useParam';
import { DashboardContext } from '@/pages/dashboard';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import restrictedUniversities from '@/utils/restrictedUniversities';
import { getLocalStorage, localStorageNames } from '@/utils/storageFunc';
import { Flex } from 'antd';
import { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useNavbarList from './useNavbarList';

export const Navbar = () => {
  const RESTRICTED_PATH = '/dashboard/restricted';
  const dispatch = useAppDispatch();
  const themeColor = useSelector((store: RootState) => store.themeSlice?.color);
  const { navigate, pathLocation } = useParamActions();
  const { isMobile, setIsNavbarActive, toggleButtonRef, toggleMenuButtonRef } =
    useContext(DashboardContext);
  const navbarRef = useRef<HTMLDivElement>(null);
  const isMobileRef = useRef(isMobile);
  const { navbarBottom, navbarList } = useNavbarList();
  const isRestrictedUniversity = !!restrictedUniversities.find(uni =>
    getLocalStorage(localStorageNames.universityApi)?.includes(uni)
  );

  const handleRestrictedUniversity = () => {
    navigate(RESTRICTED_PATH);
  };

  useEffect(() => {
    if (isRestrictedUniversity) {
      navigate(RESTRICTED_PATH);
    }
  }, []);

  const handleClickOutside = (event?: MouseEvent) => {
    event.stopPropagation();
    if (
      isMobileRef.current &&
      navbarRef?.current &&
      event &&
      !navbarRef?.current?.contains(event?.target as Node) &&
      !toggleButtonRef.current?.contains(event.target as Node) &&
      !toggleMenuButtonRef.current?.contains(event.target as Node)
    ) {
      setIsNavbarActive(false);
    }
  };

  const handleClickNavItem = (path: string) => {
    if (isMobile) {
      setIsNavbarActive(false);
    }
    navigate(path);
  };

  const handleClickSubItem = ({
    path,
    index,
  }: {
    path: string;
    index: number;
  }) => {
    if (isMobile) {
      setIsNavbarActive(false);
    }
    if (index == 2) {
      dispatch(logout());
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar" ref={navbarRef}>
      <Link
        to={'./'}
        className="flex-center"
        onClick={() => {
          isMobile && setIsNavbarActive(false);
        }}
      >
        {themeColor === 'dark' ? (
          <img
            className="big-logo"
            src="/images/logo-dark.svg"
            alt="hemis logo"
          />
        ) : (
          <img className="big-logo" src="/images/logo.svg" alt="hemis logo" />
        )}

        <img
          className="small-logo"
          src="/images/lms-icon.svg"
          alt="lms logo"
        />
      </Link>

      <div className="navbar__list">
        {navbarList.map(item => (
          <Flex
            className={`navbar__item ${pathLocation.pathname == item.path ? 'navbar__item-active' : ''
              }`}
            gap={8}
            key={item.title}
            // check restricted university click
            onClick={() =>
              !(isRestrictedUniversity && item.isPrivatePath)
                ? handleClickNavItem(item.path)
                : handleRestrictedUniversity()
            }
          >
            {/* check restricted university icon */}
            {!(isRestrictedUniversity && item.isPrivatePath) ? (
              item.icon
            ) : (
              <RestrictedIconSVG />
            )}{' '}
            <h3>{item.title}</h3>
          </Flex>
        ))}
      </div>

      <div className="navbar__bottom">
        {navbarBottom.map((item, index) => (
          <Flex
            className={`navbar__item ${pathLocation.pathname == item.path ? 'navbar__item-active' : ''}`}
            gap={8}
            key={item.title}
            onClick={() => handleClickSubItem({ path: item?.path, index })}
          >
            {item.icon} <h3>{item.title}</h3>
          </Flex>
        ))}
      </div>
    </div>
  );
};
