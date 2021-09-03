import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinFromDiscordComponent } from './join-from-discord.component';

describe('JoinFromDiscordComponent', () => {
  let component: JoinFromDiscordComponent;
  let fixture: ComponentFixture<JoinFromDiscordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinFromDiscordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinFromDiscordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
