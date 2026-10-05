import { defineConfig } from 'vite';

// index.html — production homepage (src/homepage, TypeScript).
// first-screen.html and directions.html — earlier discussion prototypes, kept as history.
export default defineConfig({
  base: '/home/',
  build: {
    outDir: '../product-map/home',
    emptyOutDir: false,
    assetsDir: 'bundle',
    rollupOptions: {
      input: {
        homepage: 'index.html',
        home: 'first-screen.html',
        directions: 'directions.html',
      },
    },
  },
});
