// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
// importar os métodos startOfHour e parseISO, isBefore, de data-fns
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';

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
      attributes: ['id', 'date'],
      // limita em 20 para criar a paginação
      limit: 20,
      // calculo para a paginação
      offset: (page - 1) * 20,
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

    return res.json(appointment);
  }
}

// exporta o objeto AppointmentController
export default new AppointmentController();
