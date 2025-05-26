import { Icon,Tooltip } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdEdit,
  MdNotifications,
  MdDvr,
  MdApartment
} from 'react-icons/md';

// Admin Imports
// import MainDashboard from './pages/v1/dashboard';
// import NFTMarketplace from './pages/v1/nft-marketplace';
// import Profile from './pages/v1/profile';
// import DataTables from './pages/v1/data-tables';
// import RTL from './pages/rtl/rtl-default';

// Auth Imports
// import SignInCentered from './pages/auth/sign-in';
import { IRoute } from 'types/navigation';

const routes: IRoute[] = [
  {
    name: '메인 홈',
    layout: '/v1',
    path: '/dashboard',
    icon: <Tooltip label="메인 홈">
      <Icon as={MdHome} width="20px" height="20px" color="inherit" />
    </Tooltip>,
  },
  {
    name: '공지사항',
    layout: '/v1',
    path: '/notice',
    icon: <Tooltip label="공지사항"><Icon as={MdNotifications} width="20px" height="20px" color="inherit" /></Tooltip>,
    secondary: true,
  },
  {
    name: '회원관리',
    layout: '/v1',
    path: '/users',
    icon: <Tooltip label="회원관리"><Icon as={MdPerson} width="20px" height="20px" color="inherit" /></Tooltip>,
    secondary: true,
  },
  {
    name: '리뷰관리',
    layout: '/v1',
    path: '/review',
    icon: <Tooltip label="리뷰관리"><Icon as={MdDvr} width="20px" height="20px" color="inherit" /></Tooltip>,
    secondary: true,
  },
  {
    name: '수정요청',
    layout: '/v1',
    path: '/inquiry',
    icon: <Tooltip label="수정요청"><Icon as={MdEdit} width="20px" height="20px" color="inherit" /></Tooltip>,
    secondary: true,
  },
  {
    name: '병원관리',
    layout: '/v1',
    icon: <Tooltip label="병원관리"><Icon as={MdApartment} width="20px" height="20px" color="inherit" /></Tooltip>,
    path: '/hospital',
  },
  {
    name: '각종통계',
    layout: '/v1',
    icon: <Tooltip label="각종통계"><Icon as={MdBarChart} width="20px" height="20px" color="inherit" /></Tooltip>,
    path: '/anaysis',
  },
  /* {
    name: 'Profile',
    layout: '/v1',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  }, */
/*   {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
  }, */
  /* {
    name: 'RTL Admin',
    layout: '/rtl',
    path: '/rtl-default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  }, */
];

export default routes;
