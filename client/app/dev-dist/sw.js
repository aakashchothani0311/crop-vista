/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-0fe04e4f'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "3ca0b8505b4bec776b69afdba2768812"
  }, {
    "url": "index.html",
    "revision": "0.5pvajmmcif"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
    allowlist: [/^\/$/]
  }));
  workbox.registerRoute(({
    url
  }) => {
    return url.pathname.includes("public");
  }, new workbox.CacheFirst({
    "cacheName": "static-assets",
    plugins: [new workbox.ExpirationPlugin({
      maxAgeSeconds: 3600,
      maxEntries: 200
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(({
    url
  }) => {
    return url.pathname.includes("crops");
  }, new workbox.CacheFirst({
    "cacheName": "crops-data",
    plugins: [new workbox.ExpirationPlugin({
      maxAgeSeconds: 3600,
      maxEntries: 500
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(({
    url
  }) => {
    return url.pathname.includes("accounts");
  }, new workbox.NetworkFirst({
    "cacheName": "account-data",
    plugins: [new workbox.ExpirationPlugin({
      maxAgeSeconds: 120,
      maxEntries: 100
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(({
    url
  }) => {
    return url.pathname.includes("supplies");
  }, new workbox.NetworkFirst({
    "cacheName": "supply-data",
    plugins: [new workbox.ExpirationPlugin({
      maxAgeSeconds: 3600,
      maxEntries: 100
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(({
    url
  }) => {
    return url.pathname.includes("demands");
  }, new workbox.NetworkFirst({
    "cacheName": "demand-data",
    plugins: [new workbox.ExpirationPlugin({
      maxAgeSeconds: 3600,
      maxEntries: 100
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(({
    url
  }) => {
    return url.pathname.includes("distprocs");
  }, new workbox.NetworkFirst({
    "cacheName": "distprocs-data",
    plugins: [new workbox.ExpirationPlugin({
      maxAgeSeconds: 3600,
      maxEntries: 100
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(({
    url
  }) => {
    return url.pathname.includes("distoffers");
  }, new workbox.NetworkFirst({
    "cacheName": "distoffers-data",
    plugins: [new workbox.ExpirationPlugin({
      maxAgeSeconds: 3600,
      maxEntries: 100
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
