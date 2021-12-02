import type { LinksFunction, MetaFunction } from 'remix';
import {
  Scripts,
  Links,
  LiveReload,
  Outlet,
  useCatch,
  Meta,
} from 'remix';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material';

import globalStylesUrl from './styles/global.css';

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
  },
  {
    rel: 'stylesheet',
    href: globalStylesUrl,
  },
];

export const meta: MetaFunction = () => {
  const description = 'A crypto dashboard with SEO optimization!';
  return {
    viewport: 'width=device-width,initial-scale=1',
    description,
    keywords: 'Cypto,Dashboard',
  };
};

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? (
          <LiveReload />
        ) : null}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document
      title={`${caught.status} ${caught.statusText}`}
    >
      <div className="error-container">
        <h1>
          {caught.status}
          {' '}
          {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

const darkTheme = responsiveFontSizes(createTheme({
  palette: {
    mode: 'dark',
  },
}));

export default function App() {
  return (
    <Document title="Crypto Dashboard">
      <ThemeProvider theme={darkTheme}>
        <Outlet />
        <Scripts />
        {process.env.NODE_ENV === 'development' ? (
          <LiveReload />
        ) : null}
      </ThemeProvider>
    </Document>
  );
}
