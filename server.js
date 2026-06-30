import Fastify from 'fastify';
import { Pool } from 'pg';
import cors from '@fastify/cors';

const sql = new Pool({
    user: "postgres",
    password: "senai",
    host: "localhost",
    port: 5432,
    database: "LAVTEC"
})
 

const servidor = Fastify()
servidor.register(cors, {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
})

servidor.get('/usuarios', async () => {
   const resultado = await sql.query("SELECT * FROM usuarios")
    return resultado.rows
})

servidor.delete('/usuarios/:id', async (request, reply) => {
    const id = request.params.id

    await sql.query(
        "DELETE FROM usuarios WHERE id = $1",
        [id]
    )

    return reply.send({
        mensagem: "Usuário deletado com sucesso"
    })
})

servidor.put('/usuarios/:id', async (request, reply) => {
    const body = request.body;  
    const id = request.params.id;

    if (!body || !body.nome || !body.senha || !body.telefone || !body.endereco) {
        return reply.status(400).send({
            error: "nome, telefone, endereco e senha são obrigatórios"
        })
    }

    if (!id) {
        return reply.status(400).send({
            error: "Faltou o ID"
        })
    }

    const resultado = await sql.query(
        'UPDATE usuarios SET nome = $1, telefone = $2, senha = $3, endereco = $4 WHERE id = $5',
        [body.nome, body.telefone, body.senha, body.endereco, id]
    )

    return reply.send({
        mensagem: "Usuário atualizado com sucesso"
    })
})


servidor.post("/usuarios", async (request, reply) => {
    const { nome, senha, telefone, endereco } = request.body
    const usuarioExistente = await sql.query(
        "SELECT * FROM usuarios WHERE telefone = $1",
        [telefone]
    )
    if (usuarioExistente.rows.length > 0) {
        return reply.status(400).send({
            error: "Telefone já cadastrado"
        })
    }
    await sql.query(
        "INSERT INTO usuarios (nome, senha, telefone, endereco) VALUES ($1, $2, $3, $4)",
        [nome, senha, telefone, endereco]
    )
    return reply.send({
        mensagem: "Usuário criado com sucesso"
    })
})

servidor.post("/login", async (request, reply) => {
    const body = request.body;
    const resultado = await sql.query('SELECT * FROM usuarios WHERE telefone = $1 AND senha = $2',
    [body.telefone, body.senha])
    if(resultado.rows.length === 0){
        return reply.status(401).send({
            error: "telefone ou senha invalido"
        })   
    } 
    reply.status(200).send({
        mensagem: "Login realizado com sucesso", ok: true
    })
})

servidor.get('/solicitacoes', async () => {
    const resultado = await sql.query("SELECT * FROM solicitacoes")
    return resultado.rows
})

servidor.post('/solicitacoes', async (request, reply) => {
    const {tipo_maquina, marca, modelo, defeito, id_usuario} = request.body
    const resultado = await sql.query(
        "INSERT INTO solicitacoes (tipo_maquina, marca, modelo, defeito, id_usuario) VALUES ($1, $2, $3, $4, $5)",
        [tipo_maquina, marca, modelo, defeito, id_usuario]
    )
    if (resultado.rowCount === 0) {
        return reply.status(500).send({
            error: "Erro ao criar solicitação"
        })
    }
    return reply.send({
        mensagem: "Solicitação criada com sucesso"
    })
})

servidor.listen({ port: 3000 }); 