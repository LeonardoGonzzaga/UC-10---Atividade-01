import { 
  Component, 
  OnInit, 
  ElementRef, 
  ViewChild, 
  AfterViewInit,
  OnDestroy 
} from '@angular/core';

import { CommonModule } from '@angular/common'; 
import { JogoService } from '../services/jogos.service';

interface slide {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-carrossel',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './carrossel.html',
  styleUrls: ['./carrossel.css'],
})
export class Carrossel implements OnInit, AfterViewInit, OnDestroy { 

  slides: slide[] = [];
  currentIndex: number = 0;
  totalItems: number = this.slides.length;
  
  private intervalId: any; 
  private readonly AUTO_PLAY_INTERVAL = 6000; 

  // ViewChild para acessar a div do carrossel no HTML
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;
  
  constructor(private jogoService: JogoService) { }

  ngOnInit(): void {
    this.startAutoPlay();
    this.loadSlidesFromBackend();
  }

  ngAfterViewInit(): void {
    this.updateCarousel();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  // Carrega os jogos e transforma em slides
  private loadSlidesFromBackend(): void {
    this.jogoService.getJogos().subscribe({
      next: (jogos) => {
        // Filtra jogos com imagem e embaralha o array
        const jogosComImagem = jogos.filter(j => !!j.imagemUrl);
        for (let i = jogosComImagem.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [jogosComImagem[i], jogosComImagem[j]] = [jogosComImagem[j], jogosComImagem[i]];
        }
        
        // Pega os 3 primeiros após embaralhar
        const slides = jogosComImagem
          .slice(0, 3)
          .map(j => ({ src: j.imagemUrl, alt: j.nome } as slide));

        if (slides.length > 0) {
          this.slides = slides;
          this.totalItems = this.slides.length;
          // garante que o carousel atualize a posição caso esteja fora do range
          if (this.currentIndex >= this.totalItems) {
            this.currentIndex = 0;
          }
          // força navegador a aplicar a transformação
          setTimeout(() => this.updateCarousel(), 0);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar slides do backend', err);
      }
    });
  }

  // Métodos de Controle do Timer

  private startAutoPlay(): void {
    // Usa setInterval para chamar a função nextSlide
    this.intervalId = setInterval(() => {
      // Passa 'false' para o timer não resetar o próprio loop
      this.advanceSlide(false); 
    }, this.AUTO_PLAY_INTERVAL);
  }

  private stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  private resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
  
  /**
   * Função interna que avança o slide e é chamada pelo timer ou interação.
   * @param isUserInteraction Indica se a chamada foi por clique do usuário (true) ou pelo timer (false).
   */
  private advanceSlide(isUserInteraction: boolean): void {
      if (isUserInteraction) {
          this.resetAutoPlay(); // Reseta apenas se o usuário clicou
      }

      this.currentIndex = (this.currentIndex === this.totalItems - 1) 
        ? 0 
        : this.currentIndex + 1;
      this.updateCarousel();
  }

  // Funções de Navegação Públicas (para o HTML)

  prevSlide(): void {
    this.resetAutoPlay();
    
    this.currentIndex = (this.currentIndex === 0) 
      ? this.totalItems - 1 
      : this.currentIndex - 1;
    this.updateCarousel();
  }

  // O nextSlide agora chama a função advanceSlide com a interação do usuário.
  nextSlide(): void {
    this.advanceSlide(true); 
  }

  goToSlide(index: number): void {
    this.resetAutoPlay();
    
    this.currentIndex = index;
    this.updateCarousel();
  }

  /**
   * Aplica a transformação CSS para mover o carrossel.
   */
  updateCarousel(): void {
    
    if (this.carouselTrack) {
        const trackElement = this.carouselTrack.nativeElement as HTMLElement;
        trackElement.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
}

  // fallback simples para imagens que falharem ao carregar
  public onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://i.imgur.com/50SVSXK.jpeg'; // placeholder
    }
  }
}
