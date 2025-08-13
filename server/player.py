import uuid

class Player:
    def __init__(self, name, websocket, id=None):
        self.id = id if id is not None else str(uuid.uuid4())
        self.name = name
        self.websocket = websocket
        self.ready = False

    def to_dict(self):
        return { 
            "id": self.id, 
            "name": self.name, 
            "ready": self.ready 
        }
