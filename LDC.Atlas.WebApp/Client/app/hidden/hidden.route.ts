import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityGuard } from '../shared/guards/security.guard';
import { CustomFormInputsComponent } from './ux-components/custom-form-inputs/custom-form-inputs.component';
import { UxComponentsListComponent } from './ux-components/ux-components-list/ux-components-list.component';
import { UxLayoutTemplateComponent } from './ux-components/ux-layout-template/ux-layout-template.component';
import { BackgroundInterfaceErrorsComponent } from './components/background-interface-errors/background-interface-errors.component';

export const routes: Routes = [
	{
		path: 'ux/components-list', pathMatch: 'full',
		canActivate: [SecurityGuard],
		component: UxComponentsListComponent,
	},
	{
		path: 'ux/layout-template', pathMatch: 'full',
		canActivate: [SecurityGuard],
		component: UxLayoutTemplateComponent,
	},
	{
		path: 'ux/custom-form-inputs', pathMatch: 'full',
		canActivate: [SecurityGuard],
		component: CustomFormInputsComponent,
    },
    {
        path: 'background-interface-error', pathMatch: 'full',
        canActivate: [SecurityGuard],
        component: BackgroundInterfaceErrorsComponent,
    },

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HiddenRoutingModule { }
