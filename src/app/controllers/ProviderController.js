// importar model User
import User from '../models/User';

// importar model File
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    // busca os Providers
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      // inclui o File para carregar o avatar do Provider
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });

    return res.json(providers);
  }
}

// exporta um objeto Provider
export default new ProviderController();
