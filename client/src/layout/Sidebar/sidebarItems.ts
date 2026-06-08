import DashboardIcon from '@mui/icons-material/Dashboard';
import PullRequestIcon from '@mui/icons-material/MergeType';
import RateReviewIcon from '@mui/icons-material/RateReview';
import VerifiedIcon from '@mui/icons-material/Verified';
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
  { label: 'Code Review', path: '/code-review', Icon: RateReviewIcon },
  { label: 'Code Quality', path: '/code-quality', Icon: VerifiedIcon },
];

export default sidebarItems;
