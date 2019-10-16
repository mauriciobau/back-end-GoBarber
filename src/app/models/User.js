// importa Sequelize e  Model do sequelize
import Sequelize, { Model } from 'sequelize';

class User extends Model {
  //metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // classe pai de Model
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // VIRTUAL - n vair existir no banco de dados
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      // passa o objeto com o sequelize
      {
        sequelize,
      }
    );
  }
}

// exporta usuário
export default User;
