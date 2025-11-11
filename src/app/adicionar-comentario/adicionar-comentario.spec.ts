import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarComentarioComponent } from './adicionar-comentario';

describe('AdicionarComentario', () => {
  let component: AdicionarComentarioComponent;
  let fixture: ComponentFixture<AdicionarComentarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionarComentarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarComentarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
