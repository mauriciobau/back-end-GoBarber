// importa Sequelize e  Model do sequelize
import Sequelize, { Model } from 'sequelize';

class File extends Model {
  // metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // classe pai de Model
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      // passa o objeto com o sequelize
      {
        sequelize,
      }
    );

    // retorna o model que acabou de ser inicializado no init().
    return this;
  }
}

// exporta File
export default File;
