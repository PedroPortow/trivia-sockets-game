import asyncio
import json
from websockets.legacy.server import serve, broadcast as ws_broadcast # tá uma bagunça mas ta funcionando
from player import Player
from room import Room

PLAYERS = {} # dict de instancias de player indexada pelo id do player
ROOMS = {} # dict de instancias de room indexada pelo id da room
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

    ws_broadcast(target_sockets, json.dumps(message))

async def handle_register(websocket, data):
    name = str(data.get("name", "")).strip()
    player = Player(name=name, websocket=websocket)

    PLAYERS[player.id] = player

    await websocket.send(json.dumps({
        "type": "REGISTER_SUCCESS",
        "player": player.to_dict()
    }))

async def create_room(websocket, data):
    name = str(data.get("name", "")).strip()
    room = Room(name=name)

    ROOMS[room.id] = room

    broadcast({
        "type": "GET_ROOMS_SUCCESS",
        "rooms": [room.to_dict() for room in ROOMS.values()]
    })

async def game_finished(websocket, data):
    room_id = str(data.get("room_id", "")).strip()
    room = ROOMS.get(room_id)

    for player in room.players:
        player.ready = False

    try:
        ROOMS.pop(room_id)
    except KeyError: # se já tiver popado, só ignora o erro
        pass

    broadcast({
        "type": "GET_ROOMS_SUCCESS",
        "rooms": [room.to_dict() for room in ROOMS.values()]
    })

async def join_room(websocket, data):
    room_id = str(data.get("room_id", "")).strip()
    player_id = str(data.get("player_id", "")).strip()

    room = ROOMS.get(room_id)
    player = PLAYERS.get(player_id)

    print(f"jogador {player.name} entrou na sala -> {room.name}")

    room.add_player(player)

    # manda confirmação pro jogador
    await websocket.send(json.dumps({
        "type": "JOIN_ROOM_SUCCESS",
        "room": room.to_dict()
    }))

    # pro pessoal da sala, também precisa atualizar a UI com o novo player que entrou
    broadcast_to_room(room_id, {
        "type": "ROOM_STATUS_UPDATED",
        "room": room.to_dict()
    })

async def get_rooms(websocket):
   await websocket.send(json.dumps({
       "type": "GET_ROOMS_SUCCESS",
       "rooms": [room.to_dict() for room in ROOMS.values()]
   }))


async def player_ready(websocket, data):
    player_id = str(data.get("player_id", "")).strip()
    room_id = str(data.get("room_id", "")).strip()

    player = PLAYERS.get(player_id)
    room = ROOMS.get(room_id)

    player.ready = True

    print(f"jogador {player.name} confirmou partida")


    if all(player.ready for player in room.players):
      room.set_game_started()

    broadcast_to_room(room_id, {
        "type": "ROOM_STATUS_UPDATED",
        "room": room.to_dict()
    })

async def start_game(websocket, data):
    room_id = str(data.get("room_id", "")).strip()
    room = ROOMS.get(room_id)

    room.start_game()

    broadcast_to_room(room_id, {
        "type": "START_GAME_SUCCESS",
        "room": room.to_dict()
    })

async def answer_question(websocket, data):
    player_id = str(data.get("player_id", "")).strip()
    room_id = str(data.get("room_id", "")).strip()
    question_id = str(data.get("question_id", "")).strip()
    answer_id = str(data.get("answer_id", "")).strip()

    room = ROOMS.get(room_id)

    room.answer_question(player_id, question_id, answer_id)

async def get_results(websocket, data):
    room_id = str(data.get("room_id", "")).strip()
    room = ROOMS.get(room_id)

    player_scores = room.get_player_scores()

    broadcast_to_room(room_id, {
        "type": "GET_RESULTS_SUCCESS",
        "results": player_scores
    })

    # await websocket.send(json.dumps({
    #     "type": "GET_RESULTS_SUCCESS",
    #     "results": player_scores
    # }))

async def run(websocket):
    client = websocket.remote_address

    player_id = None
    CONNECTIONS.add(websocket)

    try:
        async for raw_message in websocket:
            data = json.loads(raw_message)
            message_type = data.get("type")

            if message_type == "REGISTER":
                await handle_register(websocket, data)

            if message_type == "CREATE_ROOM":
                await create_room(websocket, data)

            if message_type == "JOIN_ROOM":
                await join_room(websocket, data)

            if message_type == "GET_ROOMS":
                await get_rooms(websocket)

            if message_type == "PLAYER_READY":
                await player_ready(websocket, data)

            if message_type == "START_GAME":
                await start_game(websocket, data)

            if message_type == "ANSWER_QUESTION":
                await answer_question(websocket, data)

            if message_type == "GET_RESULTS":
                await get_results(websocket, data)

            if message_type == "GAME_FINISHED":
                await game_finished(websocket, data)
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
