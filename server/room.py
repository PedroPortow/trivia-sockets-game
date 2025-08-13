import uuid

class Room:
    def __init__(self, name, players=[], started=False, id=None):
        self.id = id if id is not None else str(uuid.uuid4())
        self.name = name
        self.players = players
        self.max_players = 4
        self.started = started

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "players": [player.to_dict() for player in self.players],
            "started": self.started
        }
    
    def add_player(self, player):
        self.players.append(player)
