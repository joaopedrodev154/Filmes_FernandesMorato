const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const conexao = mysql.createConnection({
    host: "benserverplex.ddns.net",
    port: 3306,
    user: "alunos",
    password: "senhaAlunos",
    database: "filmes_JoaoPedroFR"
});

app.get("/filmes", (req, res) => {
    conexao.query(
        "SELECT * FROM filmes_JoaoPedroFR",
        (erro, resultado) => {
            if (erro) {
                return res.status(500).send(erro);
            }

            const filmes = resultado.map((filme) => ({
                title: filme.titulo,
                gender: filme.genero,
                duration: filme.duracao,
                ageLimit: filme.classificacao
            }));

            res.send(filmes);
        }
    );
});

app.post("/filmes", (req, res) => {
    const { titulo, genero, duracao, classificacao } = req.body;

    conexao.query(
        "INSERT INTO filmes_JoaoPedroFR VALUES (NULL, ?, ?, ?, ?)",
        [titulo, genero, duracao, classificacao],
        (erro) => {
            if (erro) {
                return res.status(500).send(erro);
            }

            res.send("Filme cadastrado");
        }
    );
});


app.put("/filmes/:id", (req, res) => {
    const { titulo, genero, duracao, classificacao } = req.body;

    conexao.query(
        "UPDATE filmes_JoaoPedroFR SET titulo=?, genero=?, duracao=?, classificacao=? WHERE id=?",
        [titulo, genero, duracao, classificacao, req.params.id],
        (erro) => {
            if (erro) {
                return res.status(500).send(erro);
            }

            res.send("Filme atualizado");
        }
    );
});

app.delete("/filmes/:id", (req, res) => {
    conexao.query(
        "DELETE FROM filmes_JoaoPedroFR WHERE id=?",
        [req.params.id],
        (erro) => {
            if (erro) {
                return res.status(500).send(erro);
            }

            res.send("Filme apagado");
        }
    );
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});