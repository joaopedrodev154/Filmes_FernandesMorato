import express from "express";
import cors from "cors";
import mysql from "mysql2"

const app = express()
app.use(express.json())
app.use(cors())

const database = mysql.createPool({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes_03MA"
})

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