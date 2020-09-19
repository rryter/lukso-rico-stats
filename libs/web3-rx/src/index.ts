// allow custom properties on the window object
declare global {
  interface Window {
    [index: string]: any;
  }
}

export * from './lib/web3-rx.module';
