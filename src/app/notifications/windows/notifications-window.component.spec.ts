import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsWindowComponent } from './notifications-window.component';

describe('NotificationsComponent', () => {
  let component: NotificationsWindowComponent;
  let fixture: ComponentFixture<NotificationsWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
