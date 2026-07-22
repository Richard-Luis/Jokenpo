const imgJogador = document.getElementById('imagem-jogador');
const imgComputador = document.getElementById('imagem-computador');
const resultadoEl = document.getElementById('resultado');
const pontosJogadorEl = document.getElementById('pontos-jogador');
const pontosComputadorEl = document.getElementById('pontos-computador');
const botoes = document.querySelectorAll('.opcao');
const botaoJogarNovamente = document.getElementById('jogar-novamente');
const botoesContainer = document.getElementById('botoes');

const opcoes = ['pedra', 'papel', 'tesoura'];
let indiceJogador = 0;
let indiceComputador = 0;
let intervaloGiroJogador = null;
let intervaloGiroComputador = null;
let jogoTravado = false;

function iniciarGiroJogador() {
    intervaloGiroJogador = setInterval(() => {
        indiceJogador = (indiceJogador + 1) % opcoes.length;
        imgJogador.src = imagens[opcoes[indiceJogador]];
    }, 100);
}

function iniciarGiroComputador() {
    intervaloGiroComputador = setInterval(() => {
        indiceComputador = (indiceComputador + 1) % opcoes.length;
        imgComputador.src = imagens[opcoes[indiceComputador]];
    }, 100);
}

function pararGiroJogador() {
    clearInterval(intervaloGiroJogador);
}

function pararGiroComputador() {
    clearInterval(intervaloGiroComputador);
}

iniciarGiroJogador();
iniciarGiroComputador();

botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        if (jogoTravado) {
            return;
        }
        selecionarOpcao(botao.id);
    });
});

botaoJogarNovamente.addEventListener('click', reiniciarPartida);

function selecionarOpcao(escolhaJogador) {
    jogoTravado = true;
    resultadoEl.textContent = '';

    // a imagem do jogador para imediatamente na escolha feita
    pararGiroJogador();
    imgJogador.src = imagens[escolhaJogador];

    // a imagem do computador continua girando até a resposta chegar
    jogarContraComputador(escolhaJogador);
}

function jogarContraComputador(escolhaJogador) {
    fetch('/api/jogar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escolha: escolhaJogador })
    })
        .then(resposta => resposta.json())
        .then(dados => {
            pararGiroComputador();
            imgComputador.src = imagens[dados.escolha_computador];
            pontosJogadorEl.textContent = dados.pontos_jogador;
            pontosComputadorEl.textContent = dados.pontos_computador;

            if (dados.resultado === 'jogador') {
                resultadoEl.textContent = 'Você venceu!';
            } else if (dados.resultado === 'computador') {
                resultadoEl.textContent = 'Computador venceu!';
            } else {
                resultadoEl.textContent = 'Empate!';
            }

            if (dados.fim_de_jogo) {
                mostrarFimDeJogo(dados.vencedor_final);
            } else {
                setTimeout(() => {
                    resultadoEl.textContent = '';
                    jogoTravado = false;
                    iniciarGiroJogador();
                    iniciarGiroComputador();
                }, 2000);
            }
        });
}

function mostrarFimDeJogo(vencedorFinal) {
    setTimeout(() => {
        if (vencedorFinal === 'jogador') {
            resultadoEl.textContent = 'Parabéns, você venceu a partida!';
        } else {
            resultadoEl.textContent = 'O computador venceu a partida!';
        }

        botoesContainer.style.display = 'none';
        botaoJogarNovamente.style.display = 'block';
    }, 1000);
}

function reiniciarPartida() {
    fetch('/reiniciar', { method: 'POST' })
        .then(resposta => resposta.json())
        .then(() => {
            window.location.reload();
        });
}