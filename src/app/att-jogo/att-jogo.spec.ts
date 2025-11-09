import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttJogo } from './att-jogo';

describe('AttJogo', () => {
  let component: AttJogo;
  let fixture: ComponentFixture<AttJogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttJogo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttJogo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
