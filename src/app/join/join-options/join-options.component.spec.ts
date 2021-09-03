import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinOptionsComponent } from './join-options.component';

describe('JoinOptionsComponent', () => {
  let component: JoinOptionsComponent;
  let fixture: ComponentFixture<JoinOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
