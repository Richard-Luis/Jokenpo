from flask import Flask, render_template, request, jsonify, session
import random
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

OPCOES = ['pedra', 'papel', 'tesoura']
PONTOS_PARA_VENCER = 10

VENCE = {
    'pedra': 'tesoura',
    'papel': 'pedra',
    'tesoura': 'papel'
}


def determinar_vencedor(escolha_jogador, escolha_computador):
    if escolha_jogador == escolha_computador:
        return 'empate'
    if VENCE[escolha_jogador] == escolha_computador:
        return 'jogador'
    return 'computador'


@app.route('/')
def nome():
    return render_template('nome.html')


@app.route('/definir-nome', methods=['POST'])
def definir_nome():
    dados = request.get_json()
    nome_recebido = (dados.get('nome') or '').strip()

    if not nome_recebido:
        nome_recebido = 'Jogador'

    session['nome'] = nome_recebido
    session['pontos_jogador'] = 0
    session['pontos_computador'] = 0

    return jsonify({'ok': True})


@app.route('/jogo')
def jogo():
    nome_jogador = session.get('nome', 'Jogador')
    pontos_jogador = session.get('pontos_jogador', 0)
    pontos_computador = session.get('pontos_computador', 0)

    return render_template(
        'index.html',
        nome=nome_jogador,
        pontos_jogador=pontos_jogador,
        pontos_computador=pontos_computador
    )


@app.route('/api/jogar', methods=['POST'])
def jogar():
    pontos_jogador_atual = session.get('pontos_jogador', 0)
    pontos_computador_atual = session.get('pontos_computador', 0)

    # impede novas jogadas se a partida já foi decidida
    if pontos_jogador_atual >= PONTOS_PARA_VENCER or pontos_computador_atual >= PONTOS_PARA_VENCER:
        return jsonify({'erro': 'A partida já terminou'}), 400

    dados = request.get_json()
    escolha_jogador = dados.get('escolha')

    if escolha_jogador not in OPCOES:
        return jsonify({'erro': 'Escolha inválida'}), 400

    escolha_computador = random.choice(OPCOES)
    resultado = determinar_vencedor(escolha_jogador, escolha_computador)

    if resultado == 'jogador':
        session['pontos_jogador'] = session.get('pontos_jogador', 0) + 1
    elif resultado == 'computador':
        session['pontos_computador'] = session.get('pontos_computador', 0) + 1

    pontos_jogador = session.get('pontos_jogador', 0)
    pontos_computador = session.get('pontos_computador', 0)

    fim_de_jogo = pontos_jogador >= PONTOS_PARA_VENCER or pontos_computador >= PONTOS_PARA_VENCER
    vencedor_final = None

    if fim_de_jogo:
        vencedor_final = 'jogador' if pontos_jogador >= PONTOS_PARA_VENCER else 'computador'

    return jsonify({
        'escolha_computador': escolha_computador,
        'resultado': resultado,
        'pontos_jogador': pontos_jogador,
        'pontos_computador': pontos_computador,
        'fim_de_jogo': fim_de_jogo,
        'vencedor_final': vencedor_final
    })


@app.route('/reiniciar', methods=['POST'])
def reiniciar():
    session['pontos_jogador'] = 0
    session['pontos_computador'] = 0
    return jsonify({'ok': True})


if __name__ == '__main__':
    app.run(debug=True)