import asyncio
import json
from websockets.legacy.server import serve, broadcast as ws_broadcast # tá uma bagunça mas ta funcionando
from player import Player
from room import Room

PLAYERS = {} # dict de instancias de player indexada pelo id do player
ROOMS = {} # dict de instancias de room indexada pelo id da room
# GAME_ROOMS = {} # dict de instancias de room indexada pelo id da room
CONNECTIONS = set()

def broadcast(message, exclude=None):
    data = json.dumps(message)
    
    if exclude is None:
        targets = CONNECTIONS
    else:
        targets = {ws for ws in CONNECTIONS if ws is not exclude}

    ws_broadcast(targets, data)

def broadcast_to_room(room_id, message):
    room = ROOMS.get(room_id)
    if not room or not room.players:
        return
    
    target_sockets = [player.websocket for player in room.players]
    
    print(f"broadcast para sala {room_id} -> {message}")
    ws_broadcast(target_sockets, json.dumps(message))

async def handle_register(websocket, data):
    name = str(data.get("name", "")).strip()
    player = Player(name=name, websocket=websocket)
    
    PLAYERS[player.id] = player

    await websocket.send(json.dumps({
        "type": "register_success",
        "player": player.to_dict()
    }))

async def create_room(websocket, data):
    name = str(data.get("name", "")).strip()
    room = Room(name=name)

    ROOMS[room.id] = room

    await websocket.send(json.dumps({
        "type": "create_room_success",
        "room": room.to_dict()
    }))
    
    broadcast({
        "type": "get_rooms_success",
        "rooms": [room.to_dict() for room in ROOMS.values()]
    })

async def join_room(websocket, data):
    room_id = str(data.get("room_id", "")).strip()
    player_id = str(data.get("player_id", "")).strip() 

    room = ROOMS.get(room_id)
    player = PLAYERS.get(player_id)

    if room.max_players <= len(room.players):
        await websocket.send(json.dumps({
            "type": "join_room_error",
            "error": "Sala cheia!"
        }))
        return

    print(f"jogador {player.name} entrou na sala -> {room.name}")

    room.add_player(player)

    # manda confirmação pro jogador
    await websocket.send(json.dumps({
        "type": "join_room_success",
        "room": room.to_dict()
    })) 

    # quem tá no lobby precisa atualizar a UI porque mais um player entrou na sala
    broadcast({
        "type": "get_rooms_success",
        "rooms": [room.to_dict() for room in ROOMS.values()]
    })

    # pro pessoal da sala, também precisa atualizar a UI com o novo player que entrou
    broadcast_to_room(room_id, {
        "type": "room_status_updated",
        "room": room.to_dict()
    })

async def get_rooms(websocket):
   await websocket.send(json.dumps({
       "type": "get_rooms_success",
       "rooms": [room.to_dict() for room in ROOMS.values()]
   }))


async def player_ready(websocket, data):
    player_id = str(data.get("player_id", "")).strip()
    room_id = str(data.get("room_id", "")).strip()

    player = PLAYERS.get(player_id)
    room = ROOMS.get(room_id)

    player.ready = True

    print(f"jogador {player.name} confirmou partida")

    broadcast_to_room(room_id, {
        "type": "room_status_updated",
        "room": room.to_dict()
    })

    # if all(player.ready for player in room.players):
    #     room.start_game()

    # if room.game_started: 
    #     broadcast_to_room(room_id, {
    #         "type": "room_status_updated",
    #         "room": room.to_dict()
    #     })

async def start_game(websocket, data):
    room_id = str(data.get("room_id", "")).strip()
    room = ROOMS.get(room_id)

    room.start_game()
    
    await websocket.send(json.dumps({
        "type": "start_game_success",
        "room": room.to_dict()
    }))

    # precisa disso?
    broadcast_to_room(room_id, {
        "type": "room_status_updated",
        "room": room.to_dict()
    })

async def get_questions(websocket, data):
    room_id = str(data.get("room_id", "")).strip()
    room = ROOMS.get(room_id)

    questions = room.questions


    print(f"perguntas: {questions}")

    await websocket.send(json.dumps({
        "type": "get_questions_success",
        "questions": questions
    }))

async def run(websocket):
    client = websocket.remote_address

    player_id = None
    CONNECTIONS.add(websocket)

    try:
        async for raw_message in websocket:
            data = json.loads(raw_message)
            message_type = data.get("type")

            if message_type == "register":
                await handle_register(websocket, data)

            if message_type == "create_room":
                await create_room(websocket, data)

            if message_type == "join_room":
                await join_room(websocket, data)

            if message_type == "get_rooms":
                await get_rooms(websocket)

            if message_type == "player_ready":
                await player_ready(websocket, data)

            if message_type == "start_game":
                await start_game(websocket, data)

            # if message_type == "get_questions":
            #     await get_questions(websocket, data)
    finally:
        CONNECTIONS.discard(websocket)
        if player_id is not None:
            PLAYERS.pop(player_id, None)
            print(f"cliente desconectado: {client}")

async def main():
    async with serve(run, "0.0.0.0", 8765):
        print("server rodando em ws://localhost:8765")
        await asyncio.Future()  # fica rodando

if __name__ == "__main__":
    asyncio.run(main())
