import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { paths } from './app-paths';

const routes: Routes = [
  {
    path: '',
    redirectTo: paths.registration,
    pathMatch: 'full',
  },
  {
    path: paths.registration,
    loadChildren: () =>
      import('./registration/registration.module').then(
        (m) => m.RegistrationPageModule
      ),
  },
  {
    path: paths.home,
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
