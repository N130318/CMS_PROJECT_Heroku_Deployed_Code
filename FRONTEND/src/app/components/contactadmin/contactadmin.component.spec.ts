import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactadminComponent } from './contactadmin.component';

describe('ContactadminComponent', () => {
  let component: ContactadminComponent;
  let fixture: ComponentFixture<ContactadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
