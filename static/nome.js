const input = document.getElementById('nome-jogador');

input.addEventListener('keypress', function (evento) {
    if (evento.key === 'Enter') {
        enviarNome();
    }
});

function enviarNome() {
    const nome = input.value.trim();

    if (nome === '') {
        return;
    }

    fetch('/definir-nome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome })
    })
        .then(resposta => resposta.json())
        .then(() => {
            window.location.href = '/jogo';
        });
}

