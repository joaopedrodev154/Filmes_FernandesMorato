async function buscarFilmes() {

    const resposta = await fetch("https://filmes-fernandes-morato-backend.vercel.app/filmes")
    const filmes = await resposta.json()
    const sectionFilmes = document.querySelector(".filmes")

    filmes.forEach((filme) => {
        sectionFilmes.innerHTML += `
            <div>
                <h2>${filme.titulo}</h2>
                <p><strong>Gênero:</strong> ${filme.genero}</p>
                <p><strong>Duração:</strong> ${filme.duracao}</p>
                <p><strong>Classificação indicativa:</strong> ${filme.classificacao > 0 ? filme.classificacao + ' anos' : 'Livre'}</p>
            </div>
        `
    })
}

buscarFilmes()
