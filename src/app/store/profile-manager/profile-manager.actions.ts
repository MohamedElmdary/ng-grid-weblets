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

export class UnActivateProfileManager {
  static readonly type = '[ProfileManger] UnActivate Profile Manager';
}

export class DeactivateProfile {
  static readonly type = '[ProfileManger] Deactivate Profile';
}

export class LoadProfileManager {
  static readonly type = '[ProfileManager] Load Profile Manager';
  constructor(public password: string, public hash: string) {}
}
