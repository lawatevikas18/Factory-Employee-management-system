import { Component, OnInit } from '@angular/core';

interface SiteData {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  employeeCount: number;
  presentToday: number;
  location: string;
}

interface EmployeeData {
  id: string;
  name: string;
  designation: string;
  status: 'present' | 'absent' | 'late';
  site: string;
  checkInTime?: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
 totalSites = 12;
  workingSitesToday = 10;
  totalEmployees = 156;
  presentEmployeesToday = 142;
  absentEmployeesToday = 14;
  lateEmployeesToday = 8;

  sites: SiteData[] = [
    { id: '1', name: 'Factory Unit A', status: 'active', employeeCount: 45, presentToday: 42, location: 'Pandharpur' },
    { id: '2', name: 'Factory Unit B', status: 'active', employeeCount: 38, presentToday: 35, location: 'Solapur' },
    { id: '3', name: 'Warehouse North', status: 'active', employeeCount: 22, presentToday: 20, location: 'Mumbai' },
    { id: '4', name: 'Processing Center', status: 'maintenance', employeeCount: 15, presentToday: 0, location: 'Pune' },
    { id: '5', name: 'Admin Office', status: 'active', employeeCount: 12, presentToday: 12, location: 'Pandharpur' },
  ];

  recentEmployees: EmployeeData[] = [
    { id: '1', name: 'John Smith', designation: 'Manager', status: 'present', site: 'Factory Unit A', checkInTime: '08:00 AM' },
    { id: '2', name: 'Sarah Johnson', designation: 'Supervisor', status: 'late', site: 'Factory Unit B', checkInTime: '09:15 AM' },
    { id: '3', name: 'Mike Davis', designation: 'Operator', status: 'present', site: 'Warehouse North', checkInTime: '07:45 AM' },
    { id: '4', name: 'Lisa Anderson', designation: 'Technician', status: 'absent', site: 'Processing Center' },
    { id: '5', name: 'Robert Wilson', designation: 'Driver', status: 'present', site: 'Admin Office', checkInTime: '08:30 AM' },
  ];

  attendancePercentage = 0;
  siteOperationalPercentage = 0;

  constructor() { }

  ngOnInit(): void {
    this.calculatePercentages();
  }

  calculatePercentages(): void {
    this.attendancePercentage = Math.round((this.presentEmployeesToday / this.totalEmployees) * 100);
    this.siteOperationalPercentage = Math.round((this.workingSitesToday / this.totalSites) * 100);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
      case 'present':
        return 'badge-success';
      case 'late':
      case 'maintenance':
        return 'badge-warning';
      case 'inactive':
      case 'absent':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'active':
      case 'present':
        return 'status-present';
      case 'late':
        return 'status-late';
      case 'inactive':
      case 'absent':
        return 'status-absent';
      case 'maintenance':
        return 'status-maintenance';
      default:
        return 'status-absent';
    }
  }

  getAttendanceRate(site: SiteData): number {
    return site.employeeCount > 0 ? Math.round((site.presentToday / site.employeeCount) * 100) : 0;
  }
}
