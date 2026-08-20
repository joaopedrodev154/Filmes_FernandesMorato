require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// Pool de conexões: reconecta sozinho e evita esgotar conexões (mais robusto
// do que uma única conexão com createConnection).
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

app.get("/filmes", (req, res) => {
    pool.query("SELECT * FROM filmes_JoaoPedroFR", (erro, resultado) => {
        if (erro) {
            console.error(erro);
            return res.status(500).json({ erro: "Erro ao buscar filmes" });
        }

        res.status(200).json(resultado);
    });
});

app.post("/adicionar-filmes", (req, res) => {
    const { titulo, genero, duracao, classificacao } = req.body;

    if (!titulo || !genero || !duracao || !classificacao) {
        return res.status(400).json({ erro: "Preencha todos os campos: titulo, genero, duracao, classificacao" });
    }

    pool.query(
        "INSERT INTO filmes_JoaoPedroFR VALUES (NULL, ?, ?, ?, ?)",
        [titulo, genero, duracao, classificacao],
        (erro) => {
            if (erro) {
                console.error(erro);
                return res.status(500).json({ erro: "Erro ao cadastrar filme" });
            }

            res.status(201).json({ mensagem: "Filme cadastrado" });
        }
    );
});

app.put("/editar-filmes/:id", (req, res) => {
    const { titulo, genero, duracao, classificacao } = req.body;

    if (!titulo || !genero || !duracao || !classificacao) {
        return res.status(400).json({ erro: "Preencha todos os campos: titulo, genero, duracao, classificacao" });
    }

    pool.query(
        "UPDATE filmes_JoaoPedroFR SET titulo=?, genero=?, duracao=?, classificacao=? WHERE id=?",
        [titulo, genero, duracao, classificacao, req.params.id],
        (erro, resultado) => {
            if (erro) {
                console.error(erro);
                return res.status(500).json({ erro: "Erro ao atualizar filme" });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ erro: "Filme não encontrado" });
            }

            res.status(200).json({ mensagem: "Filme atualizado" });
        }
    );
});

app.delete("/deletar-filmes/:id", (req, res) => {
    pool.query(
        "DELETE FROM filmes_JoaoPedroFR WHERE id=?",
        [req.params.id],
        (erro, resultado) => {
            if (erro) {
                console.error(erro);
                return res.status(500).json({ erro: "Erro ao apagar filme" });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ erro: "Filme não encontrado" });
            }

            res.status(200).json({ mensagem: "Filme apagado" });
        }
    );
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});