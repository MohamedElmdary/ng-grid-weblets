import { IProfile } from './profile-manager.types';

export class CreateNewProfileManager {
  static readonly type = '[ProfileManager] Create New Profile Manager';
  constructor(public password: string) {}
}

export class AddNewProfile {
  static readonly type = '[ProfileManager] Add New Profile';
}

export class RemoveProfile {
  static readonly type = '[ProfileManager] Remove Profile';
  constructor(public index: number) {}
}

export class ActiveProfile {
  static readonly type = '[ProfileManager] Active Profile';
  constructor(public index: number, public profile: IProfile) {}
}

// export class SetProfileManagerActive {
//   static readonly type = '[ProfileManager] Set Profile Manager Active';
//   constructor(public active: boolean = false, public password: string = '') {}
// }

// export class AddProfileManager {
//   static readonly type = '[ProfileManager] Add Profile Manager';
// }
