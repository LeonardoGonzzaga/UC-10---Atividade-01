import { Component } from '@angular/core';
import { authGuard } from '../../guards/auth-guard';
import { Usuario } from '../models/usuario.models';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Dados para Login
  public loginData: { email: string, senha: string } = { email: '', senha: '' };
  
  // Dados para Cadastro
  public registerData: Usuario = new Usuario('', '', '');
  public confirmaSenha: string = '';
  public aceitaTermos: boolean = false;

  public mensagem: string = '';
  public mensagemClasse: 'sucesso' | 'erro' | '' = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  public onLogin(): void {
    this.mensagem = '';
    this.mensagemClasse = '';

    if (!this.loginData.email || !this.loginData.senha) {
      this.setMensagem('Por favor, preencha todos os campos.', 'erro');
      return;
    }

    // 1. Busca o usuário por email e senha no json-server
    this.userService.buscarUsuarioPorCredenciais(this.loginData.email, this.loginData.senha).subscribe({
      next: (usuarios) => {
        if (usuarios && usuarios.length === 1) {
          // 2. Credenciais válidas
          this.authService.login();
          this.setMensagem('Login realizado com sucesso!', 'sucesso');
          
          // Redireciona para a página de atualização de jogos
          this.router.navigate(['/attJogo']); 
        } else {
          // 3. Usuário não encontrado ou credenciais incorretas
          this.setMensagem('E-mail ou senha inválidos.', 'erro');
        }
      },
      error: (erro) => {
        this.setMensagem('Erro de comunicação com o servidor. Verifique o json-server.', 'erro');
        console.error('Erro de Login:', erro);
      }
    });
  }

  public onRegister(): void {
    this.mensagem = '';
    this.mensagemClasse = '';

    if (!this.registerData.nome || !this.registerData.email || !this.registerData.senha || !this.confirmaSenha) {
      this.setMensagem('Preencha todos os campos obrigatórios.', 'erro');
      return;
    }

    if (this.registerData.senha !== this.confirmaSenha) {
      this.setMensagem('A confirmação de senha não confere.', 'erro');
      return;
    }
    
    if (this.registerData.senha.length < 8) {
        this.setMensagem('A senha deve ter no mínimo 8 caracteres.', 'erro');
        return;
    }
    
    // 1. Verifica se o email já existe
    this.userService.buscarUsuarioPorEmail(this.registerData.email).subscribe({
      next: (usuarios) => {
        if (usuarios.length > 0) {
          this.setMensagem('Este e-mail já está cadastrado.', 'erro');
          return;
        }

        // 2. Se o email for novo, cadastra o usuário
        this.userService.cadastrarUsuario(this.registerData).subscribe({
          next: () => {
            this.setMensagem('Cadastro realizado com sucesso! Você já pode logar.', 'sucesso');
            // Limpa o formulário após o sucesso
            this.registerData = new Usuario('', '', '');
            this.confirmaSenha = '';
          },
          error: (erro) => {
            this.setMensagem('Erro ao cadastrar usuário.', 'erro');
            console.error('Erro de Cadastro:', erro);
          }
        });
      },
      error: (erro) => {
        this.setMensagem('Erro de comunicação ao verificar e-mail.', 'erro');
        console.error('Erro de Verificação de Email:', erro);
      }
    });
  }

  // Método auxiliar para exibir mensagens
  private setMensagem(texto: string, classe: 'sucesso' | 'erro' | ''): void {
    this.mensagem = texto;
    this.mensagemClasse = classe;
    // Limpa a mensagem após 5 segundos
    setTimeout(() => {
        this.mensagem = '';
        this.mensagemClasse = '';
    }, 5000);
  }
}

