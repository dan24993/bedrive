import {isAbsoluteUrl} from '../urls/is-absolute-url';

interface Options {
  id?: string;
  force?: boolean;
  type?: 'js' | 'css';
  parentEl?: HTMLElement;
  document?: Document;
}

interface LoadAssetOptions {
  url: string;
  id: string;
  resolve: (value?: any | PromiseLike<any>) => void;
  parentEl?: HTMLElement;
  document?: Document;
}

class LazyLoader {
  private loadedAssets: Record<
    string,
    {
      state: 'loaded' | Promise<void>;
      doc?: Document;
    }
  > = {};

  loadAsset(url: string, params: Options = {type: 'js'}): Promise<any> {
    const currentState = this.loadedAssets[url]?.state;

    // script is already loaded, return resolved promise
    if (currentState === 'loaded' && !params.force) {
      return new Promise<void>(resolve => resolve());
    }

    const neverLoaded =
      !currentState || this.loadedAssets[url].doc !== params.document;
    // script has never been loaded before, load it, return promise and resolve on script load event
    if (neverLoaded || (params.force && currentState === 'loaded')) {
      this.loadedAssets[url] = {
        state: new Promise(resolve => {
          const finalUrl = isAbsoluteUrl(url) ? url : `assets/${url}`;
          const finalId = buildId(url, params.id);

          const assetOptions: LoadAssetOptions = {
            url: finalUrl,
            id: finalId,
            resolve,
            parentEl: params.parentEl,
            document: params.document,
          };

          if (params.type === 'css') {
            this.loadStyleAsset(assetOptions);
          } else {
            this.loadScriptAsset(assetOptions);
          }
        }),
        doc: params.document,
      };
      return this.loadedAssets[url].state as Promise<void>;
    }

    // script is still loading, return existing promise
    return this.loadedAssets[url].state as Promise<void>;
  }

  /**
   * Check whether asset is loading or has already loaded.
   */
  isLoadingOrLoaded(url: string): boolean {
    return this.loadedAssets[url] != null;
  }

  private loadStyleAsset(options: LoadAssetOptions) {
    const doc = options.document || document;
    const parentEl = options.parentEl || doc.head;
    const style = doc.createElement('link');
    const prefixedId = buildId(options.url, options.id);

    style.rel = 'stylesheet';
    style.id = prefixedId;
    style.href = options.url;

    try {
      if (parentEl.querySelector(`#${prefixedId}`)) {
        parentEl.querySelector(`#${prefixedId}`)?.remove();
      }
    } catch (e) {}

    style.onload = () => {
      this.loadedAssets[options.url].state = 'loaded';
      options.resolve();
    };

    parentEl.appendChild(style);
  }

  private loadScriptAsset(options: LoadAssetOptions) {
    const doc = options.document || document;
    const parentEl = options.parentEl || doc.body;
    const script: HTMLScriptElement = doc.createElement('script');
    const prefixedId = buildId(options.url, options.id);

    script.async = true;
    script.id = prefixedId;
    script.src = options.url;

    try {
      if (parentEl.querySelector(`#${prefixedId}`)) {
        parentEl.querySelector(`#${prefixedId}`)?.remove();
      }
    } catch (e) {}

    script.onload = () => {
      this.loadedAssets[options.url].state = 'loaded';
      options.resolve();
    };

    (parentEl || parentEl).appendChild(script);
  }
}

function buildId(url: string, id?: string): string {
  if (id) return id;
  return btoa(url.split('/').pop() as string);
}

export default new LazyLoader();
