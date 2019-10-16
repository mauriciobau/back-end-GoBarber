// ARQUIVO DE ROTEAMENTO

// importa o roteamento do express para poder criar as rotas do sistema
import { Router } from "express";

// variável para criar as rotas
const routes = new Router();


routes.get('/', (req, res) => res.json({ message: 'Hello teste' }));

// exporta as rotas criadas
export default routes;
