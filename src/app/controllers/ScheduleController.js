// importa a model Appointment
// importar os métodos startOfHour e parseISO, isBefore, de data-fns
// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
import * as Yup from 'yup';

import { startOfDay, parseISO, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

import User from '../models/User';
import File from '../models/File';

// cria a classe ScheduleController
class ScheduleController {
  async index(req, res) {
    // verificar se o usuário é um provider
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    // ajusta a data para pegar todos os agendamentos do inicio do dia atual ate o final do dia
    const parseDate = parseISO(date);

    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointment);
  }
}

// exporta o objeto ScheduleController
export default new ScheduleController();
