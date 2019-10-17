// importa a model File
import File from '../models/File';

// cria a classe FileController
class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    // salva a referência do arquivo no banco de dados
    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

// exporta o objeto FileController
export default new FileController();
