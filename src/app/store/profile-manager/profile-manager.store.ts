import { Injectable } from '@angular/core';
import { GridService } from '@app/shared/services/grid.service';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, updateItem } from '@ngxs/store/operators';
import { GridClient } from 'grid3_client';
import { forkJoin, from } from 'rxjs';
import { map, mergeMap, retry, tap } from 'rxjs/operators';
import { v4 } from 'uuid';

import {
  ActiveProfile,
  AddNewProfile,
  CreateNewProfileManager,
  RemoveProfile,
} from './profile-manager.actions';
import { IProfile, IProfileManagerState } from './profile-manager.types';

type Ctx = StateContext<IProfileManagerState>;

function __createProfile() {
  return {
    id: v4(),
    address: '',
    mnemonic:
      'guilt leaf sure wheel shield broom retreat zone stove cycle candy nation',
    sshKey:
      'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMUv2EQUnLL/Ei2+JRR/8EFIOrMxmlVLIc7psOZau6FE engm5081@gmail.com',
    twinId: 0,
  } as IProfile;
}

@State<IProfileManagerState>({
  name: 'ProfileManager',
  defaults: {
    password: 'secret',
    profiles: [__createProfile()],
    activeProfile: -1,
    balance: 0,
    active: true,
  },
})
@Injectable()
export class ProfileManagerState {
  @Selector()
  static active(state: IProfileManagerState): boolean {
    return state.active;
  }

  @Selector()
  static profile(state: IProfileManagerState): IProfile | undefined {
    return state.profiles[state.activeProfile];
  }

  @Selector()
  static profiles(state: IProfileManagerState): IProfile[] {
    return state.profiles;
  }

  constructor(private readonly gridService: GridService) {}

  @Action(CreateNewProfileManager)
  public onCreateNewProfileManager(
    ctx: Ctx,
    { password }: CreateNewProfileManager
  ) {
    ctx.setState(
      patch<IProfileManagerState>({
        active: true,
        profiles: [__createProfile()],
        password,
      })
    );
  }

  @Action(AddNewProfile)
  public onAddNewProfile(ctx: Ctx) {
    ctx.setState(
      patch<IProfileManagerState>({
        profiles: append([__createProfile()]),
      })
    );
  }

  @Action(RemoveProfile)
  public onRemoveProfile(ctx: Ctx, { index }: RemoveProfile) {
    ctx.setState(
      patch<IProfileManagerState>({
        profiles: removeItem(index),
      })
    );
  }

  @Action(ActiveProfile)
  public onActiveProfile(ctx: Ctx, { index, profile }: ActiveProfile) {
    const state = ctx.getState();

    let grid: GridClient;
    return this.gridService.__createNewGrid(profile, state.password).pipe(
      retry(3),
      tap((g) => (grid = g)),
      mergeMap(() => from(grid.twins.get_my_twin_id()).pipe(retry(3))),
      tap((twinId) => {
        ctx.setState(
          patch<IProfileManagerState>({
            activeProfile: index,
            profiles: updateItem(index, {
              ...profile,
              address: grid.twins.client.client.address,
              twinId,
            }),
          })
        );
      })
      // tap((grid) => {
      //   if (grid) {
      //     ctx.setState(
      //       patch<IProfileManagerState>({
      //         profiles: updateItem(index, )
      //       })
      //     );
      //   }
      // })
    );
    /* import type { IProfile } from "../types/Profile";
const { GridClient } = window.configs?.grid3_client ?? {};
const { HTTPMessageBusClient } = window.configs?.client ?? {};

export default function validateMnemonics(profile: IProfile) {
  const { networkEnv, mnemonics, storeSecret } = profile;
  const http = new HTTPMessageBusClient(0, "", "", "");
  const grid = new GridClient(
    networkEnv as any,
    mnemonics,
    storeSecret,
    http,
    undefined,
    "tfkvstore" as any
  );
  return grid
    .connect()
    .then(() => grid.disconnect())
    .then(() => true)
    .catch(() => false);
} */
  }

  // @Action(SetProfileManagerActive)
  // public onSetProfileManagerActive(
  //   ctx: Ctx,
  //   { active, password }: SetProfileManagerActive
  // ) {
  //   ctx.setState(
  //     patch<IProfileManagerState>({
  //       active,
  //       password,
  //     })
  //   );
  // }

  // @Action(AddProfileManager)
  // public onAddProfileManager(ctx: Ctx) {
  //   const profile: IProfileManager = {
  //     name: 'New Profile',
  //     address: '',
  //     mnemonic: '',
  //     sshKey: '',
  //     twinId: 0,
  //   };

  //   ctx.setState(
  //     patch<IProfileManagerState>({
  //       profiles: append([profile]),
  //     })
  //   );
  // }
}
