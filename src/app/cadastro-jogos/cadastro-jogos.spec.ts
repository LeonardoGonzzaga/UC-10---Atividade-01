import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroJogos } from './cadastro-jogos';

describe('CadastroJogos', () => {
  let component: CadastroJogos;
  let fixture: ComponentFixture<CadastroJogos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroJogos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroJogos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
