import { Component } from '@angular/core';
import { Carrossel } from "../carrossel/carrossel";
import { Cards } from "../cards/cards";

@Component({
  selector: 'app-home',
  imports: [Carrossel, Cards],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
