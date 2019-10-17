// ARQUIVO DE ROTEAMENTO

// importa o roteamento do express para poder criar as rotas do sistema
import { Router } from 'express';

// importa o multer utilizado para fazer upload de arquivos
// import multer from 'multer';

// importa as configurações do multer
// import multerConfig from './config/multer';

// importa a controller de Usuário
import UserController from './app/controllers/UserController';

// importa a controlle de Seção / autenticação
import SessionController from './app/controllers/SessionController';

// importa a controlle de upload
// import FileController from './app/controllers/FileController';

// importa a controlle de Providers
// import ProviderController from './app/controllers/ProviderController';

// importa a controlle de Appointment
// import AppointmentController from './app/controllers/AppointmentController';

// importa a controlle de Appointment
// import ScheduleController from './app/controllers/ScheduleController';

// importa o middleware de autenticação
import authMiddleware from './app/middlewares/auth';

// variável para criar as rotas
const routes = new Router();

// variável para realizar o upload
// const upload = multer(multerConfig);

// rota para logar
routes.post('/sessions', SessionController.store);

// rota para criar usuário
routes.post('/users', UserController.store);

// carrega rota do middleware de autenticação, as rotas abaixo desta, só serão
// acessiveis se o usuário estiver logado.
routes.use(authMiddleware);

// rota para editar usuários
routes.put('/users', UserController.update);

// rota para carregar Providers
// routes.get('/providers', ProviderController.index);

// rota para buscar Appointment - agendamento
// routes.get('/appointments', AppointmentController.index);
// rota para criar Appointment - agendamento
// routes.post('/appointments', AppointmentController.store);

// rota para buscar Schedule - agenda do provedor
// routes.get('/schedule', ScheduleController.index);

// rota para realizar upload da imagem do avatar, com o middleware para fazer upload de apenas um arquivo
// routes.post('/files', upload.single('file'), FileController.store);

// exporta as rotas criadas
export default routes;
