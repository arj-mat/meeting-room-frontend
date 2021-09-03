import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectingOverlayComponent } from './connecting-overlay.component';

describe('ConnectingOverlayComponent', () => {
  let component: ConnectingOverlayComponent;
  let fixture: ComponentFixture<ConnectingOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectingOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectingOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
