// filepath: d:\academy\CRMSystem\crm-test\src\types\index.ts
export type Role = 'guest' | 'user' | 'admin';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}