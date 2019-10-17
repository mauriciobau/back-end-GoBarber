// importa Sequelize e  Model do sequelize
import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  // metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // classe pai de Model
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      // passa o objeto com o sequelize
      {
        sequelize,
      }
    );

    // retorna o model que acabou de ser inicializado no init().
    return this;
  }

  // método para associação com Users. Quando tem mais de uma associação é obrigatório
  // o uso de apelidos.
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

// exporta Appointment - Agendamento
export default Appointment;
