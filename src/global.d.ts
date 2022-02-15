import * as grid3_client from 'grid3_client';
import * as ts_rmb_http_client from 'ts-rmb-http-client';

interface AppConfig {
  grid3_client: typeof grid3_client;
  ts_rmb_http_client: typeof ts_rmb_http_client;
}

declare global {
  interface Window {
    configs: AppConfig;
  }
}
