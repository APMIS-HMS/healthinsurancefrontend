import { PreloadAllModules, Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  // {
  //   path: 'auth',
  //   loadChildren: './auth/auth.module#AuthModule',
  // },
  {
    path: 'modules',
    loadChildren: './system-modules/system-modules.module#SystemModules',
  },
  {
    path: '', redirectTo: 'modules', pathMatch: 'full'
  }
];

export const appRouter = RouterModule.forRoot(appRoutes, { useHash: true });
