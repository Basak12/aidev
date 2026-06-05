import DashboardIcon from '@mui/icons-material/Dashboard';
import PullRequestIcon from '@mui/icons-material/MergeType';
import type { SvgIconComponent } from '@mui/icons-material';

export interface SidebarItem {
  label: string;
  path: string;
  Icon: SvgIconComponent;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', path: '/dashboard', Icon: DashboardIcon },
  { label: 'Pull Requests', path: '/pull-requests', Icon: PullRequestIcon },
];

export default sidebarItems;
