import { setMobileNavBottom, setStateIsMobile } from '@/store/slices/authSlice';
import { getLocalStorage, localStorageNames } from '@/utils/storageFunc';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const useDeviceSize = () => {
  const dispatch = useDispatch();
  const MOBILE_SIZE = 670;
  const [deviceSize, setDeviceSize] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(deviceSize < MOBILE_SIZE);
  const [isNavbarActive, setIsNavbarActive] = useState<boolean>(!isMobile);

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

  return {
    MOBILE_SIZE,
    deviceSize,
    setDeviceSize,
    isMobile,
    setIsMobile,
    isNavbarActive,
    setIsNavbarActive,
  };
};

export default useDeviceSize;
