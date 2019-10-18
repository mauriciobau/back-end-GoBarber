// importa schema de Notification
import Notification from '../schemas/Notification';

// importa model de usuarios
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    // verifica se usuário é um provider
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications' });
    }

    // procura notificações do provedor ordenado por data decrescente
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    // retorna notificações encontradas
    return res.json(notifications);
  }

  async update(req, res) {
    // buscar notificação no banco de dados
    // const notification = await Notification.findById(req.params.id)
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
