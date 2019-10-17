// importa o multer utilizado para fazer upload de arquivos
import multer from 'multer';

// importa o crypto para
import crypto from 'crypto';

// importa do path
// extname - contem a extensão do arquivo
// resolve - para percorrer dentro da estrutura da aplicação
import { extname, resolve } from 'path';

// exporta o objeto de configuração
export default {
  // como o muter vai guardas os arquivos de imagens
  storage: multer.diskStorage({
    // define destino do upload
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // define o nome do arquivo cryptografado para n ter outro arquivo com nome igual
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        // verifica se retornou algum erro
        if (err) return cb(err);

        // retorna o nome do arquivo como hexadecimal.extensao
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
