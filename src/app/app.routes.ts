import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { CadastroJogos } from './cadastro-jogos/cadastro-jogos';

export const routes: Routes = [
    {path: "login", component: Login },
    {path: "home", component: Home },
    {path: "", component: Home },
    {path: "cadastroJogos", component: CadastroJogos}
];
