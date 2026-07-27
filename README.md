# Jokenpô

Jogo de Pedra, Papel e Tesoura com interface estilo pixel art, desenvolvido com **Flask** no backend e **JavaScript puro** no frontend.

## Funcionalidades

- Cadastro do nome do jogador antes de começar a partida
- Placar em tempo real (você vs computador)
- Animação de "sorteio" nas imagens antes de revelar a jogada
- Lógica de vitória validada no servidor (evita manipulação pelo navegador)
- Partida disputada até **10 pontos**
- Botão de "Jogar novamente" ao final da partida

## Tecnologias

- Python / Flask
- Jinja2 (templates)
- JavaScript (fetch API, DOM)
- CSS (estilo pixel art)

## Como rodar

\`\`\`bash
pip install flask
python app.py
\`\`\`

Acesse `http://127.0.0.1:5000` no navegador.
