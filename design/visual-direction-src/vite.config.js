import { defineConfig } from 'vite';

// index.html — homepage 3.0 (src/site, TypeScript): HH/Enbek-style portal, Impeccable process.
// v1.html — homepage v1 (src/homepage), kept as history and data source.
// concepts.html — three homepage directions 2.0 for comparison (src/concepts, TypeScript).
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
        v1: 'v1.html',
        concepts: 'concepts.html',
        home: 'first-screen.html',
        directions: 'directions.html',
      },
    },
  },
});
