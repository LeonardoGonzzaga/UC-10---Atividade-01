import { 
  Component, 
  OnInit, 
  ElementRef, 
  ViewChild, 
  AfterViewInit,
  OnDestroy 
} from '@angular/core';

import { CommonModule } from '@angular/common'; 

interface slide {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-carrossel',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './carrossel.html',
  styleUrl: './carrossel.css',
})
export class Carrossel implements OnInit, AfterViewInit, OnDestroy { 

  slide: slide[] = [ 
    { src: "https://i.imgur.com/6XGIfTJ.jpeg", alt: 'Promoção de um jogo' },
    { src: "https://i.imgur.com/Un857fa.jpeg", alt: 'Promoção do mês' },
    { src: "https://i.imgur.com/50SVSXK.jpeg", alt: 'Jogo do ano' }
  ];
  
  currentIndex: number = 0;
  totalItems: number = this.slide.length;
  
  private intervalId: any; 
  private readonly AUTO_PLAY_INTERVAL = 5000; // 5 segundos

  // ViewChild para acessar a div do carrossel no HTML
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;
  
  constructor() { }

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngAfterViewInit(): void {
    // Garante que o track esteja na posição 0 ao carregar
    this.updateCarousel();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
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
    // CORREÇÃO ESSENCIAL: Com ViewChild, acessamos o elemento via .nativeElement
    if (this.carouselTrack) {
        const trackElement = this.carouselTrack.nativeElement as HTMLElement;
        trackElement.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
}
}