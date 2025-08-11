import asyncio
from websockets.server import serve

async def echo(websocket):
    client = websocket.remote_address
    print(f"Novo cliente: {client}")
    try:
        async for message in websocket: # loop que recebe mensagens do cliente
            print(f"{client}: {message}")
            await websocket.send(f"ECHO: {message}")  # envia resposta
    finally:
        print(f"Cliente desconectado: {client}")

async def main():
    async with serve(echo, "0.0.0.0", 8765):
        print("server rodando em ws://localhost:8765")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
