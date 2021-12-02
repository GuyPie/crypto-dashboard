import type { TickerWidget } from '@prisma/client';
import { db } from './db.server';

export async function createDashboard(
  userId: string,
  name: string,
) {
  return db.dashboard.create({
    data: { name, userId },
  });
}

export async function getDashboard(
  dashboardId: string,
) {
  return db.dashboard.findUnique({
    where: { id: dashboardId },
  });
}

export async function getUserDashboard(
  userId: string,
  name: string,
) {
  return db.dashboard.findFirst({ where: { name, userId } });
}

export async function getUserDashboards(
  userId: string,
) {
  return db.dashboard.findMany({ where: { userId } });
}

export async function getDashboardWidgets(
  dashboardId: string,
) {
  return db.tickerWidget.findMany({ where: { dashboardId } });
}

export async function createTickerWidget(data: Pick<TickerWidget, 'dashboardId' | 'coinId' | 'targetCoinId' | 'marketName' | 'coinIcon' | 'targetCoinIcon'>) {
  return db.tickerWidget.create({
    data,
  });
}
