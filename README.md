# Questionados 😎

Jogo multiplayer de perguntas e respostas dividido em rodadas. O client foi feito utilizando React com Typescript, já o servidor
WebSocket foi feito utilizando Python.

## 📋 Pré-requisitos

- Python 3.8 ou superior
- pip
- Node.js 18 ou superior
- npm ou yarn

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/PedroPortow/trivia-sockets-game
cd trivia-sockets-game
```

### 2. Instale as dependências

```bash
cd server
pip install websockets
```

```bash
cd client
npm install ou yarn install
```

### 3. Execute o servidor e o client

```bash
cd server
python server.py
```

```bash
cd client
npm run dev
```

O servidor iniciará na porta **8765** e será acessível em:

- **Local**: `ws://localhost:8765`
- **Rede**: `ws://SEU_IP:8765`

## 🌐 Configuração para Rede

Para permitir conexões de outros computadores:

### Windows

```powershell
# Abrir firewall (execute como Administrador)
netsh advfirewall firewall add rule name="Quiz WebSocket Server" dir=in action=allow protocol=TCP localport=8765
```

### Linux/Ubuntu

```bash
# UFW
sudo ufw allow 8765/tcp

# ou iptables
sudo iptables -A INPUT -p tcp --dport 8765 -j ACCEPT
```

### Descobrir seu IP local

```bash
# Windows
ipconfig

# Linux/Mac
ip addr show
# ou
ifconfig
```

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos.

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
