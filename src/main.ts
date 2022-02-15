import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import * as grid3_client from 'grid3_client';
import * as ts_rmb_http_client from 'ts-rmb-http-client';

window.configs = {
  grid3_client,
  ts_rmb_http_client,
};

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
