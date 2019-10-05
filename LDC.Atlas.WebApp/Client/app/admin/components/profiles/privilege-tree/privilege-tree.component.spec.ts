import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivilegeNode } from '../../../../shared/entities/privilege-node.entity';
import { Privilege } from '../../../../shared/entities/privilege.entity';
import { PrivilegeTreeComponent } from './privilege-tree.component';

describe('PrivilegeTreeComponent', () => {
    let component: PrivilegeTreeComponent;
    let fixture: ComponentFixture<PrivilegeTreeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PrivilegeTreeComponent],
            imports: [],
            providers: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrivilegeTreeComponent);
        component = fixture.componentInstance;

        component.privilege = new PrivilegeNode();
        component.privilege.privilege = new Privilege();
        component.privilege.children = [];

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
