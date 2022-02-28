import { Injectable } from '@angular/core';
import { GridClient, NetworkEnv, BackendStorageType } from 'grid3_client';
import { HTTPMessageBusClient } from 'ts-rmb-http-client';
import { from, Observable } from 'rxjs';
import { filter, map, mergeMap, take } from 'rxjs/operators';
import { IProfile } from '@app/store/profile-manager/profile-manager.types';
import { Store } from '@ngxs/store';
import { IAppState } from '@app/store';

interface IUrsl {
  graphql: string;
  rmbProxy: string;
}

export interface GetGridOptions {
  profile?: IProfile;
  storeSecret?: string;
  projectName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GridService {
  get urls(): Observable<IUrsl> {
    return this.getGrid().pipe(
      map((grid) => grid.getDefaultUrls(NetworkEnv.dev) as unknown as IUrsl)
    );
  }

  constructor(private readonly store: Store) {}

  public getGrid(options: GetGridOptions = {}) {
    if (options.profile && options.profile.mnemonic && options.storeSecret) {
      return this.__getGrid(
        options.profile.mnemonic,
        options.storeSecret,
        options.projectName
      );
    }

    return this.store
      .select((s: IAppState) => {
        const c = s.ProfileManager.profiles[s.ProfileManager.activeProfile];
        return { password: s.ProfileManager.password, profile: c };
      })
      .pipe(
        filter(({ password, profile }) => !!profile && !!password),
        take(1),
        mergeMap(({ profile, password }) => {
          return this.__getGrid(
            profile.mnemonic,
            password,
            options.projectName
          );
        })
      );
  }

  private __getGrid(
    mnemonic: string,
    storeSecret: string,
    projectName?: string
  ) {
    const grid = new GridClient(
      NetworkEnv.dev,
      mnemonic,
      storeSecret,
      new HTTPMessageBusClient(0, '', '', ''),
      projectName,
      BackendStorageType.tfkvstore
    );

    return from(grid.connect()).pipe(map(() => grid));
  }
}
