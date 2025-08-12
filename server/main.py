import asyncio
import json
import uuid
from websockets.server import serve

# dá pra meter uma orientação a objeto bonitinha aqui né
PLAYERS = {}
SOCKET_TO_PLAYER = {}
ROOMS = {}
async def handle_register(websocket, data):
    name = str(data.get("name", "")).strip()
    
    id = str(uuid.uuid4())
    PLAYERS[id] = {"name": name}
    SOCKET_TO_PLAYER[websocket] = id

    print(f"cnovo jogadorrr: {name}")

    await websocket.send(json.dumps({
        "type": "register_success", # tem q fazer o front esperar por essa mensagme pro "login", precisa mudar lá ainda
        "id": id,
        "name": name,
    }))
    return id

async def create_room(websocket, data):
    name = str(data.get("name", "")).strip()
    print(f"criar sala -> {name}")

    id = str(uuid.uuid4())
    ROOMS[id] = { "name": name, "players": [] }
    
    await websocket.send(json.dumps({
        "type": "create_room_success", # esperar por essa mensagem no front e refazer request das salas
        "room": {
            "id": id,
            "name": name,
            "players": [],
        }
    }))

async def get_rooms(websocket):
   print("salitas ->", list(ROOMS.values()))
   await websocket.send(json.dumps({
       "type": "get_rooms_success",
       "rooms": list(ROOMS.values())
   }))

async def run(websocket):
    client = websocket.remote_address

    print(f"novo cliente: {client}")
    player_id = None
    try:
        async for raw_message in websocket:
            data = json.loads(raw_message)

            message_type = data.get("type")

            if message_type == "register":
                player_id = await handle_register(websocket, data)
                print("players: ", PLAYERS)
                continue

            if message_type == "create_room":
                await create_room(websocket, data)

            if message_type == "get_rooms":
                await get_rooms(websocket)
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
