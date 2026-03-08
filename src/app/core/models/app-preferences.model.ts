export type AppDensity = 'comfortable' | 'compact';
export type AppPageSize = 6 | 10 | 12 | 20;

export interface AppPreferences {
  themeMode: 'light' | 'dark';
  density: AppDensity;
  productsPageSize: AppPageSize;
}
