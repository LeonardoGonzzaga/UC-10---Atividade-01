import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosJogosComponent } from './comentarios-jogos';

describe('ComentariosJogos', () => {
  let component: ComentariosJogosComponent;
  let fixture: ComponentFixture<ComentariosJogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComentariosJogosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentariosJogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
