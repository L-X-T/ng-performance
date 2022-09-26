# Initial Load Performance

<!-- TOC -->
* [Initial Load Performance](#initial-load-performance)
  * [Improving Initial Load NgOptimizedImage](#improving-initial-load-ngoptimizedimage)
  * [Improving Initial Load with NG Prod Mode](#improving-initial-load-with-ng-prod-mode)
    * [Inspecting Bundles with webpack-bundle-analyzer](#inspecting-bundles-with-webpack-bundle-analyzer)
    * [Bonus: Inspecting source files with source-map-explorer](#bonus--inspecting-source-files-with-source-map-explorer)
  * [Avoid large 3rd party libs](#avoid-large-3rd-party-libs)
    * [Check your build for large parts of 3rd party code](#check-your-build-for-large-parts-of-3rd-party-code)
  * [Lazy Loading](#lazy-loading)
    * [Implementing Lazy Loading for a feature module](#implementing-lazy-loading-for-a-feature-module)
    * [Implementing Preloading](#implementing-preloading)
    * [Bonus: Use ngx-quicklink for smarter Preloading  **](#bonus--use-ngx-quicklink-for-smarter-preloading--)
    * [Bonus: Implementing a Custom Preloading Strategy *](#bonus--implementing-a-custom-preloading-strategy-)
<!-- TOC -->

In this lab we will work with the Angular App of this repository / workspace. Of course, you could also apply the same optimizations to your own Apps if you prefer to do that.

## Improving Initial Load NgOptimizedImage

1. Check out the `HomeComponent` which is shown on our Apps front page.

   You can find some `<img>` tags in it. The first of them is above the fold, so it should be loaded eagerly, while the other two are below the fold, so we could use lazy loading on them.
2. To active image lazy loading we need to import the `NgOptimizedImage` directive to the `AppModule`:
   ```typescript
   @NgModule({
       imports: [
            [...],
            NgOptimizedImage
       ],
       [...]        
   })
   export class AppModule {}
   ```
   Also, make sure the corresponding import was added.
3. Now we just need to replace the images `src` attribute with the same `ngSrc` attribute (rename it from "src" to "ngSrc" without changing it\'s value).

## Improving Initial Load with NG Prod Mode

1. Make sure, your solution runs in debug mode (``ng serve -o``)
2. Open the performance tab in Chrome's dev tools and reload the app. Find out how long bootstrapping takes and create a screenshot.

   **Hint:** In order to respect the cache, do it twice and take the screenshot after the 2nd try.
3. Install the simple web server serve:
   ```
   npm install serve -g
   ```
4. Switch to the console and move to the root folder of your project. Create a production build:
   ```
   ng build
   ```
5. Start live-server for your production build. For this, switch to your project within the ``dist`` folder and call serve:
   ```
   serve -s
   ```
6. Open the performance tab in Chrome's dev tools and reload the app. Find out how long bootstrapping takes and create a screenshot.

   **Hint:** In order to respect the cache, do it twice and take the screenshot after the 2nd try.
7. Compare your screenshot with the performance results.

### Inspecting Bundles with webpack-bundle-analyzer

Using the webpack-bundle-analyzer one can have a look at a bundle's content. In this exercise you will use this possibility by inspecting your AOT-based and your AOT-less production build.

1. Install the `webpack-bundle-analyzer` globally (for the sake of simplicity):
   ```
   npm install -g webpack
   npm install -g webpack-bundle-analyzer
   ```
2. Move to the root folder of your project. Create a Production Build without AOT and generate a statistics file for the analyzer using the `stats-json` flag:
   ```
   ng build --aot=false --build-optimizer=false --stats-json
   ```
3. Analyze your bundles:
   ```
   cd dist/performance
   webpack-bundle-analyzer stats.json
   ```

   The name of ``stats.json`` can be slightly different on your machine, e. g. ``stats-es5.json`` or ``stats-es2015.json``.
4. Take a screen shot to document this.
5. Move to the root folder of your project. Create a production build using AOT:
   ```
   ng build --stats-json
   ```
6. Analyze these bundles too and compare it to the former bundles:
   ```
   cd dist/performance
   webpack-bundle-analyzer stats.json
   ```

### Bonus: Inspecting source files with source-map-explorer

Now let's try the `source-map-explorer` as an alternative to `webpack-bundle-analyzer`. With the `source-map-explorer` you look into single files instead of the bundle.
   ```
   npm i -g source-map-explorer
   ```
To be able to explore the .js files you need source maps to be enabled in your `angular.json`. Make sure you enable that for both, the development and the production build.

After enabling source maps and rebuilding the App open the main bundle (main.js) and explore it with the `source-map-explorer`.

Results tend to be more accurate here compared to the `webpack-bundle-analyzer`.

## Avoid large 3rd party libs

### Check your build for large parts of 3rd party code

You can either use `webpack-bundle-analyzer` or `source-map-explorer` for this task.

1. See if you can find a large import and if yes try to replace that.

2. Make sure the new 3rd party lib has **ES6 imports** and this is **tree-shakeable**.

3. Compare the production build size and check how much smaller your build has become.

## Lazy Loading

### Implementing Lazy Loading for a feature module

Implement lazy loading for the `FlightBookingModule` in your `app.routes.ts`.
Keep in mind that lazy loading only works if the module in question isn't referenced directly but only with a string in the router configuration.

1. Open the file `app.module.ts` and remove the import for the `FlightBookingModule`.

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
    @NgModule({
        imports: [
            [...]
            // FlightBookingModule,
            // ^^ Removed b/c this would prevent lazy loading
            [...]
        ],
        [...]        
    })
    export class AppModule {}
    ```

    </p>
    </details>

2. Since Angular 8, we are using EcmaScript inline imports for lazy loading. To make them work, you have to adjust your ``tsconfig.app.json`` (in ``flight-app``):

    - Here, make sure, ``module`` is set to ``esnext``.
    - This might also be set in the (included) root folder's ``tsconfig.base.json``.

3. Open the file `app.routes.ts` and introduce a route with the path `flight-booking`.
   It should point to the `FlightBookingModule` using `loadChildren`:

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
    [...]
    {
        path: 'flight-booking',
        loadChildren: () => import('./flight-booking/flight-booking.module').then(m => m.FlightBookingModule)
    },
    {
        // This route needs to be the last one!
        path: '**',
        [...]
    }
    [...]
    ```

    </p>
    </details>

4. Make sure your sidebar link to flight-search and passenger-search still works (something like `routerLink="/flight-booking/flight-search"`).

5. Also make sure your `Edit` Button in your `FlightCardComponent` still works (try adding two dots like `[routerLink]="['../flight-edit', ...`).

6. Find out that webpack splits off an own chunk for the `FlightBookingModule` after implementing lazy loading.
   If this works, you will see another chunk at the console (e. g.  `flight-booking-flight-booking-module.js` depending on the used version of the CLI)

7. Try it out in the browser and use the network tab within the dev tools (F12) to make sure that it is only loaded on demand.
   If it doesn't work, have a look to the console tab within the dev tools.

### Implementing Preloading

In this exercise you will implement Preloading using Angular's `PreloadAllModules` strategy.

1. Open the file `app.module.ts` and register the `PreloadAllModules` strategy when calling `RouterModule.forRoot`.

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
    @NgModule({
        imports: [
            [...],
            RouterModule.forRoot(
                APP_ROUTES,
                { preloadingStrategy: PreloadAllModules }
            ),
            [...]
        ],
        [...]        
    })
    export class AppModule {}
    ```

    </p>
    </details>

2. Make sure it works using the network tab within Chrome's dev tools. If it works, the lazy bundles are loaded **after** the app has been initializes. If this is the case, the chunks show up quite late in the water fall diagram.

### Bonus: Use ngx-quicklink for smarter Preloading  **

1. [Look at ngx-quicklink](https://www.npmjs.com/package/ngx-quicklink) on npmjs.com to get started with `ngx-quicklink`.

2. First you need to install `ngx-quicklink`:
   ```
   npm i ngx-quicklink
   ```

3. Now import the `QuicklinkModule` and replace the `PreloadAllModules` with the `QuicklinkStrategy`:

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
    @NgModule({
        imports: [
            [...],
            QuicklinkModule,
            RouterModule.forRoot(
                APP_ROUTES,
                { preloadingStrategy: QuicklinkStrategy }
            ),
            [...]
        ],
        [...]        
    })
    export class AppModule {}
    ```

    </p>
    </details>

4. Make sure it still works using the network tab within Chrome's dev tools.

### Bonus: Implementing a Custom Preloading Strategy *

1. [Here](https://www.angulararchitects.io/aktuelles/performanceoptimierung/) you find some information about creating a custom preloading strategy. Have a look at it.

2. Create a custom preloading strategy that only preloads modules that have been marked with the `data` attribute in the router configuration.

3. Configure the system to make use of it and test it.
