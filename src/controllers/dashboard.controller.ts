import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { catchAsync } from '../utils/catchAsync';

export const DashboardController = {
  getStats: catchAsync(async (req: Request, res: Response) => {
    const stats = await DashboardService.getStats();
    const recent = await DashboardService.getRecentActivities();
    
    res.status(200).json({
      success: true,
      data: {
        ...stats,
        ...recent
      }
    });
  })
};
