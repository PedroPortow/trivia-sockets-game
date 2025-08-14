import uuid

class Room:

    def __init__(self, name, players=[], game_started=False, id=None):
        self.id = id if id is not None else str(uuid.uuid4())
        self.name = name
        self.players = players
        self.max_players = 4
        self.game_started = game_started
        self.player_scores = {player.id: 0 for player in players}
        self.questions = []

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "players": [player.to_dict() for player in self.players],
            "game_started": self.game_started,
            "questions": self.questions,
            "player_scores": self.player_scores
        }
    
    def add_player(self, player):
        self.players.append(player)

    def questions_to_dict(self):
        return self.questions

    def start_game(self):
        self.questions = [
            {
                "id": 1,
                "question": "Qual é a capital do Brasil?",
                "answers": [
                    { "name": "São Paulo", "correct": False, "id": 1 },
                    { "name": "Rio de Janeiro", "correct": False, "id": 2 },
                    { "name": "Brasília", "correct": True, "id": 3 },
                    { "name": "Belo Horizonte", "correct": False, "id": 4 }
                ]
            },
            {
                "id": 2,
                "question": "Qual é a capital do Brasil?",
                "answers": [
                    { "name": "São Paulo", "correct": False, "id": 1 },
                    { "name": "Rio de Janeiro", "correct": False, "id": 2 },
                    { "name": "Brasília", "correct": True, "id": 3 },
                    { "name": "Belo Horizonte", "correct": False, "id": 4 }
                ]
            }
        ]

        self.game_started = True

    def get_player_score(self, player_id):
        return self.player_scores.get(player_id, 0)
    
    def get_winner(self):
        return max(self.player_scores, key=self.player_scores.get)
    
    def answer_question(self, player_id, question_id, answer_id):
        # essa sintaxe do python... que isso aqui senhor
        current_question = next((q for q in self.questions if q["id"] == question_id), None)
        current_answer = next((a for a in current_question["answers"] if a["id"] == answer_id), None)

        if current_answer["correct"]:
            self.player_scores[player_id] += 1
