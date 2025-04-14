import { RestrictedIconSVG } from '@/assets/icon';
import useNavbarList from '@/components/Navbar/useNavbarList';
import restrictedUniversities from '@/utils/restrictedUniversities';
import { getLocalStorage, localStorageNames } from '@/utils/storageFunc';
import { RightOutlined } from '@ant-design/icons';
import { Flex, Skeleton, Typography } from 'antd';
import { Link } from 'react-router-dom';

const UsefulMenus = () => {
  const RESTRICTED_PATH = '/dashboard/restricted';
  const { navbarList } = useNavbarList();
  if (!navbarList || navbarList.length === 0) return <Skeleton active />;
  const isRestrictedUniversity = !!restrictedUniversities.find(uni =>
    getLocalStorage(localStorageNames.universityApi)?.includes(uni)
  );

  const menus = [
    navbarList[3],
    navbarList[4],
    navbarList[7],
    navbarList[5],
    navbarList[6],
  ];

  return (
    <>
      {menus?.map(nav => (
        <Link
          className="menu-link upper-element"
          key={nav?.path}
          to={
            !(isRestrictedUniversity && nav.isPrivatePath)
              ? nav?.path
              : RESTRICTED_PATH
          }
        >
          <Flex gap={10} justify="space-between">
            <Flex gap={10}>
              {!(isRestrictedUniversity && nav.isPrivatePath) ? (
                nav?.icon
              ) : (
                <RestrictedIconSVG />
              )}
              <Typography.Text strong>{nav?.title}</Typography.Text>
            </Flex>
            <RightOutlined />
          </Flex>
        </Link>
      ))}
    </>
  );
};

export default UsefulMenus;
