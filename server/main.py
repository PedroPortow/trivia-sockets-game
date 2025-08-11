import asyncio
import json
import uuid
from websockets.server import serve

PLAYERS = {}
SOCKET_TO_PLAYER = {}

async def handle_register(websocket, data):
    name = str(data.get("name", "")).strip()
    
    id = str(uuid.uuid4())
    PLAYERS[id] = {"name": name}
    SOCKET_TO_PLAYER[websocket] = id

    print(f"cnovo jogadorrr: {name}")

    await websocket.send(json.dumps({
        "type": "registered",
        "id": id,
        "name": name,
    }))
    return id

async def run(websocket):
    client = websocket.remote_address

    print(f"novo cliente: {client}")
    player_id = None
    try:
        async for raw_message in websocket:
            try:
                data = json.loads(raw_message)
            except Exception:
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": "invalid json",
                }))
                continue

            message_type = data.get("type")

            if message_type == "register":
                player_id = await handle_register(websocket, data)
                continue

            await websocket.send(json.dumps({
                "type": "echo",
                "data": data,
            }))
    finally:
        if player_id is not None:
            PLAYERS.pop(player_id, None)
        SOCKET_TO_PLAYER.pop(websocket, None)
        print(f"cliente desconectado: {client}")

async def main():
    async with serve(run, "0.0.0.0", 8765):
        print("server rodando em ws://localhost:8765")
        await asyncio.Future()  # fica rodando

if __name__ == "__main__":
    asyncio.run(main())
