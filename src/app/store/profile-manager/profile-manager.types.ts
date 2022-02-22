export interface IProfileManagerState {
  password: string;
  profiles: IProfile[];
  activeProfile: number;
  active: boolean;
  balance?: number;
}

export interface IProfile {
  id: string;
  mnemonic: string;
  twinId: number;
  address: string;
  sshKey: string;
}
