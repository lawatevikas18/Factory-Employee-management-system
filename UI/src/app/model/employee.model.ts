// export interface Employee {
//   factoryName: string;
//   employeeName: string;
//   employeeCode: string;
//   address: string;
//   village: string;
//   taluka: string;
//   district: string;
//   state: string;
//   designation: string;
//   aadhaar: string;
//   pan: string;
//   mobile1: string;
//   mobile2: string;
//   salary: number;
// }


export interface Employee {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  designation: string;
  factory: string;
  salary: number;
  deposit: number;
  aadhar: string;
  carNo?: string;
  panNo?: string;
  mobile1: string;
  mobile2?: string;
  village: string;
  taluka?: string;
  district?: string;
  country: string;
  state: string;
}
