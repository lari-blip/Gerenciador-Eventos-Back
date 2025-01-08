const bcrypt = require('bcryptjs');

const gerarHashSenha = async (senha) => {
  const salt = await bcrypt.genSalt(10); 
  const hash = await bcrypt.hash(senha, salt); 
  console.log(`Senha Hash: ${hash}`);
};


gerarHashSenha('123'); 
