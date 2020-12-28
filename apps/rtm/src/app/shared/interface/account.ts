export interface Account {
  address: string;
  owner: string;
  balance: number;
  isExecutable: boolean;
  isManagable: boolean;
  qrCode: string;
  stage: number;
}

export interface AccountData {
  name: string;
  description: string;
}
