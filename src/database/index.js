// importa o Sequelize de sequelize
import Sequelize from 'sequelize';

// importa o mongoose
import mongoose from 'mongoose';

// importa model User
import User from '../app/models/User';

// importa model File
import File from '../app/models/File';

// importa model Appointment
import Appointment from '../app/models/Appointment';

// importa configurações do banco de dados
import databaseConfig from '../config/database';

// cria um array com todos os models
const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    // inicia a conexão com o mongodb
    this.mongo();
  }

  // metodo que conecta com o banco de dados e carrega as models
  init() {
    // variável esperada pelas models dentro do método init da model
    this.connection = new Sequelize(databaseConfig);

    // percorre o arrey através do map, retornando os models passados, chamando o metodo init
    // de cada model passando a conexão
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  // conectar com o mongodb
  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

// exportar database
export default new Database();
