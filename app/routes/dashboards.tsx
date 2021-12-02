import type { LinksFunction, LoaderFunction } from 'remix';
import type { Dashboard, User } from '@prisma/client';
import { Outlet, useLoaderData } from 'remix';
import { Dashboard as DashboardIcon, Create } from '@mui/icons-material';
import { getUser } from '~/utils/session.server';
import Navigation from '~/components/Navigation';
import stylesUrl from '../styles/dashboards.css';
import { getUserDashboards } from '~/utils/dashboards.server';

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: stylesUrl,
  },
];

type LoaderData = {
  dashboards: Dashboard[],
  user: User | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const dashboards = user ? (await getUserDashboards(user.id)) : [];
  const data: LoaderData = { dashboards, user };
  return data;
};

export default function DashboardsRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="dashboards-layout">
      <header>
        <Navigation
          user={data.user}
          sideNavItems={[...data.dashboards.map((dashboard) => ({
            id: dashboard.id,
            label: dashboard.name,
            prefix: <DashboardIcon />,
            link: dashboard.id,
          })), {
            id: 'add', label: 'Add Dashboard', prefix: <Create />, link: 'new',
          }]}
        />
      </header>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}
