
import { Component, OnInit } from '@angular/core';
import { EmployeeService, EmployeeWallet } from 'src/app/core/services/employee.service';


@Component({
  selector: 'app-employee-wallet',
  templateUrl: './employee-wallet.component.html',
  styleUrls: ['./employee-wallet.component.css']
})
export class EmployeeWalletComponent implements OnInit {
  wallets: EmployeeWallet[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getWallets().subscribe(res => this.wallets = res);
  }
}
