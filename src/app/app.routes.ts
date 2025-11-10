import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { CadastroJogos } from './cadastro-jogos/cadastro-jogos';
import { AttJogo } from './att-jogo/att-jogo';
import { DetalhesJogo } from './detalhes-jogo/detalhes-jogo';
import { authGuard } from '../guards/auth-guard';

export const routes: Routes = [
    {path: "login", component: Login },
    {path: "home", component: Home },
    {path: "", component: Home },
    {path: "cadastroJogos", component: CadastroJogos, canActivate: [authGuard] },
    {path: "attJogo", component: AttJogo, canActivate: [authGuard] },
    {path: "jogo/:id", component: DetalhesJogo },
];
