const bcrypt = require('bcryptjs');

const senha = 'minhaSenha123';

bcrypt.hash(senha, 10, (err, hash) => {
  if (err) {
    console.error('Erro ao criptografar a senha:', err);
  } else {
    console.log('Senha criptografada:', hash);
  }
});
