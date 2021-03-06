// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
// importar os métodos de date-fns
// importa tradução do date-fns
// impota notificações
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

import User from '../models/User';
import File from '../models/File';

// cria a classe AppointmentController
class AppointmentController {
  async index(req, res) {
    // variável usada para paginação
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      // limita em 20 para criar a paginação
      limit: 20,
      // calculo para a paginação
      offset: (page - 1) * 20,
      // incluir o relacionamento do provedor
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    // cria o schema e recebe o objeto Yup com a estrutura de verificação
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    // verifica os dados passados
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // verificar se provider_id é um provider
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointment with providers' });
    }

    if (req.userId == provider_id) {
      return res
        .status(401)
        .json({ error: 'You cant create appointment with yourself' });
    }

    // parseISO - transforma a string date em um objeto date javascript
    // startOfHour - vai pegar apenas o início da hora, sem os minutos e segundos
    const hourStart = startOfHour(parseISO(date));

    // verifica se a data informada é um data futura
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // verificar se o Provider tem horário disponível
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    const user = await User.findByPk(req.userId);

    const formatedDate = format(hourStart, "'dia' dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });

    // notificar agendamento ao provedor
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    // buscar dados do agendamento
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    // verifica se o usuário que esta logado é o dono do agendamento
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    // remove 2 horas do horário para verificar se pode cancelar
    const dataWithSub = subHours(appointment.date, 2);

    if (isBefore(dataWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

// exporta o objeto AppointmentController
export default new AppointmentController();
