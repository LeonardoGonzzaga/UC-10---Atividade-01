import { 
  Component, 
  OnInit, 
  ElementRef, 
  ViewChildren, 
  QueryList, 
  AfterViewInit 
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
export class Carrossel implements OnInit, AfterViewInit {

  slide = [
    { src: "https://i.imgur.com/6XGIfTJ.jpeg", alt: 'Promoção de um jogo' },
    { src: "https://i.imgur.com/Un857fa.jpeg", alt: 'Promoção do mês' },
    { src: "https://i.imgur.com/50SVSXK.jpeg", alt: 'Jogo do ano' }
  ];
  
  currentIndex: number = 0;
  totalItems: number = this.slide.length;

  // O nome da propriedade no ViewChildren deve corresponder ao # do template
  @ViewChildren('carouselTrack') carouselTrack!: QueryList<ElementRef>;
  
  constructor() { }

  ngOnInit(): void {
    // Inicializa o carrossel se precisar de alguma lógica inicial
  }

  ngAfterViewInit(): void {
    // Certifica-se de que o track está visível antes de aplicar o estilo inicial
    this.updateCarousel();
  }

  /**
   * Navega para o slide anterior.
   */
  prevSlide(): void {
    // Se estiver no primeiro, vai para o último. Senão, vai para o anterior.
    this.currentIndex = (this.currentIndex === 0) 
      ? this.totalItems - 1 
      : this.currentIndex - 1;
    this.updateCarousel();
  }

  /**
   * Navega para o próximo slide.
   */
  nextSlide(): void {
    // Se estiver no último, volta para o primeiro. Senão, vai para o próximo.
    this.currentIndex = (this.currentIndex === this.totalItems - 1) 
      ? 0 
      : this.currentIndex + 1;
    this.updateCarousel();
  }

  /**
   * Navega para um slide específico usando o indicador.
   * @param index O índice do slide desejado.
   */
  goToSlide(index: number): void {
    this.currentIndex = index;
    this.updateCarousel();
  }

  /**
   * Aplica a transformação CSS para mover o carrossel.
   */
  updateCarousel(): void {
    // Garante que o track foi encontrado antes de tentar manipulá-lo
    if (this.carouselTrack && this.carouselTrack.first) {
        const trackElement = this.carouselTrack.first.nativeElement as HTMLElement;
        // Move o track horizontalmente pela porcentagem do índice atual
        trackElement.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
  }
}