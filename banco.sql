CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE solicitacoes (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,

    tipo_maquina VARCHAR(50) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(100),
    defeito TEXT NOT NULL,

    status VARCHAR(20) DEFAULT 'Pendente',

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

