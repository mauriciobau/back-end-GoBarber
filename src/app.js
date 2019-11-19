// importar dotenv para carregar arquivo de variáveis de ambiente
import 'dotenv/config';

// importando o express para iniciar a aplicação
import express from 'express';

// importa o paht para o middleware de imagem do avatar
import path from 'path';

// importar cors para gerenciar conexões a api
import cors from 'cors';

// youch tratativa nas mensagem de erro para melhor visualização
import Youch from 'youch';

// importa Sentry - ferramenta para monitoramento de erros
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';

// importar async-error para que o sentry funcione - precisa ser antes das rotas
import 'express-async-errors';

// importando arquivo de routes.js para carregar as rotas da aplicação
import routes from './routes';

// importa o arquivo database para realizar a conexão com o banco de dados
import './database';

class App {
  // metodo chamado automaticamento quando a classe é instanciada
  constructor() {
    // inicia o express
    this.server = express();

    // inicia o Sentry para monitorar erros
    Sentry.init(sentryConfig);

    // chama o método middlewares da classe
    this.middlewares();

    // chama o método routes da classe
    this.routes();

    // tratamento de exceções
    this.exeptionHendler();
  }

  middlewares() {
    // É necessário colocar isso antes de todos os middlewares e rotas
    this.server.use(Sentry.Handlers.requestHandler());
    // ativa a utilização do cors
    this.server.use(cors());
    // define o formato json para trabalhar com as requisições
    this.server.use(express.json());
    // servir arquivos staticos, imagens, css, etc
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    // É necessário colocar isso depois de todas as rotas
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exeptionHendler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

// exporta uma nova instancia de App definindo apenas o server para ser acessado
export default new App().server;
