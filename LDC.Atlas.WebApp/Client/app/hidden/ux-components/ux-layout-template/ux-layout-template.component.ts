import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'atr-ux-layout-template',
    templateUrl: './ux-layout-template.component.html',
    styleUrls: ['./ux-layout-template.component.scss']
})
export class UxLayoutTemplateComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}


// <mat-tab label="Layout with row wrap">
// <!-- Layout by row wrap -->
// <div fxLayout="row wrap ">
//     <div fxFlex="100" fxFlex.gt-sm="45" fxFlex.gt-xs="100" fxFlexOffset.gt-sm="2" fxFlexOffset="0">
//         <mat-card>
//             <mat-card-header>
//                 <mat-card-title>
//                     <h2>Counterparty</h2>
//                 </mat-card-title>
//             </mat-card-header>
//             <mat-card-content>
//                 <p>
//                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae illo repellendus voluptas quasi deleniti asperiores eius tempore eos, suscipit doloribus laudantium temporibus eaque possimus accusantium praesentium. Quaerat quod nemo rem.
//                 </p>
//                 <mat-form-field class="mat-form-field ">
//                     <input matInput placeholder="Input " placeholder="Field with ">
//                     <mat-icon matSuffix matTooltip="This is a tooltip ">error</mat-icon>
//                 </mat-form-field>
//             </mat-card-content>
//         </mat-card>
//     </div>
//     <div fxFlex="100" fxFlex.gt-sm="45" fxFlex.gt-xs="100" fxFlexOffset.gt-sm="5" fxFlexOffset="0">
//         <mat-card>
//             <mat-card-header>
//                 <mat-card-title>
//                     <h2>Commodity</h2>
//                 </mat-card-title>
//             </mat-card-header>
//             <mat-card-content>
//                 <p>
//                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad doloremque maxime inventore quo nulla doloribus dolore, veritatis ipsam nisi quae, incidunt animi repudiandae dolorum? Molestiae illo odio quis placeat rerum.
//                 </p>
//             </mat-card-content>
//         </mat-card>
//     </div>
//     <div fxFlex="100" fxFlex.gt-sm="45" fxFlex.gt-xs="100" fxFlexOffset.gt-sm="2" fxFlexOffset="0">
//         <mat-card>
//             <mat-card-header>
//                 <mat-card-title>
//                     <h2>Quantity</h2>
//                 </mat-card-title>
//             </mat-card-header>
//             <mat-card-content>
//                 <p>
//                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae illo repellendus voluptas quasi deleniti asperiores eius tempore eos, suscipit doloribus laudantium temporibus eaque possimus accusantium praesentium. Quaerat quod nemo rem.
//                 </p>
//                 <mat-form-field class="mat-form-field ">
//                     <input matInput placeholder="Input " placeholder="Field with ">
//                     <mat-icon matSuffix matTooltip="This is a tooltip ">error</mat-icon>
//                 </mat-form-field>
//             </mat-card-content>
//         </mat-card>
//     </div>
//     <div fxFlex="100" fxFlex.gt-sm="45" fxFlex.gt-xs="100" fxFlexOffset.gt-sm="5" fxFlexOffset="0">
//         <mat-card>
//             <mat-card-header>
//                 <mat-card-title>
//                     <h2>Test</h2>
//                 </mat-card-title>
//             </mat-card-header>
//             <mat-card-content>
//                 <p>
//                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae illo repellendus voluptas quasi deleniti asperiores eius tempore eos, suscipit doloribus laudantium temporibus eaque possimus accusantium praesentium. Quaerat quod nemo rem.
//                 </p>
//                 <mat-form-field class="mat-form-field ">
//                     <input matInput placeholder="Input " placeholder="Field with ">
//                     <mat-icon matSuffix matTooltip="This is a tooltip ">error</mat-icon>
//                 </mat-form-field>
//             </mat-card-content>
//         </mat-card>
//     </div>
// </div>
// </mat-tab>
// <mat-tab label="Flex Order Layout">
// <!-- Layout with card order -->
// <div fxLayout="row" fxLayout.xs="column" class="container-lg" fxLayoutGap="5%">
//     <div fxFlex="20" fxFlexOrder.xs="2">
//         <mat-card>
//             <mat-card-header>
//                 <h2>1</h2>
//             </mat-card-header>
//             <mat-card-content>
//                 <p> fxFlex="20" </p>
//             </mat-card-content>
//         </mat-card>
//     </div>
//     <div fxFlex="30">
//         <mat-card>
//             <mat-card-header>
//                 <h2>2</h2>
//             </mat-card-header>
//             <mat-card-content>
//                 <p> fxFlex="30" </p>
//             </mat-card-content>
//         </mat-card>
//     </div>
//     <div fxFlex="50">
//         <mat-card>
//             <mat-card-header>
//                 <h2>3</h2>
//             </mat-card-header>
//             <mat-card-content>
//                 <p> fxFlex="50" </p>
//             </mat-card-content>
//         </mat-card>
//     </div>
// </div>
// </mat-tab>
