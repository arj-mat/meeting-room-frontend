import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinWithEmailComponent } from './join-with-email.component';

describe('JoinWithEmailComponent', () => {
  let component: JoinWithEmailComponent;
  let fixture: ComponentFixture<JoinWithEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinWithEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinWithEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
