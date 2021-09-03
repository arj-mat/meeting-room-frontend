import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAudioComponent } from './chat-audio.component';

describe('ChatAudioComponent', () => {
  let component: ChatAudioComponent;
  let fixture: ComponentFixture<ChatAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatAudioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
