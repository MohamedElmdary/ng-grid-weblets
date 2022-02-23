import { Injectable } from '@angular/core';
import { GridService } from '@app/shared/services/grid.service';
import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { patch, append, removeItem, updateItem } from '@ngxs/store/operators';
import { GridClient } from 'grid3_client';
import { forkJoin, from, of, timer } from 'rxjs';
import {
  catchError,
  delay,
  map,
  mergeMap,
  repeat,
  retry,
  startWith,
  tap,
} from 'rxjs/operators';
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
export class ProfileManagerState implements NgxsOnInit {
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

  @Selector()
  static balance(state: IProfileManagerState): number | undefined {
    return state.balance;
  }

  constructor(private readonly gridService: GridService) {}

  ngxsOnInit(ctx: StateContext<IProfileManagerState>) {
    timer(5 * 60 * 1000) // 5 mins
      .pipe(
        startWith(0),
        mergeMap(() => this.gridService.getGrid()),
        mergeMap((grid) =>
          from(grid.balance.getMyBalance()).pipe(
            retry(3),
            catchError(() => of({ free: 0 }))
          )
        ),
        map(({ free }) => free)
      )
      .subscribe((balance) => {
        ctx.patchState({ balance });
      });
  }

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
    return this.gridService
      .getGrid({ profile, storeSecret: state.password })
      .pipe(
        retry(3),
        tap((g) => (grid = g)),
        mergeMap(() => from(grid.twins.get_my_twin_id()).pipe(retry(3))),
        tap((twinId) => {
          ctx.setState(
            patch<IProfileManagerState>({
              activeProfile: index,
              profiles: updateItem(index, {
                id: state.profiles[index].id,
                mnemonic: profile.mnemonic,
                sshKey: profile.sshKey,
                address: grid.twins.client.client.address,
                twinId,
              }),
            })
          );
        })
      );
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
