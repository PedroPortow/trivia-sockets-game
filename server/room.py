import uuid
import json
import random

class Room:

    def __init__(self, name, game_started=False, id=None):
        self.id = id if id is not None else str(uuid.uuid4())
        self.name = name
        self.players = []
        self.max_players = 4
        self.game_started = game_started
        self.player_scores = {player.id: 0 for player in self.players}
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
        self.player_scores[player.id] = 0

    def questions_to_dict(self):
        return self.questions

    def _load_questions_from_json(self, file_path):
       with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data["questions"]

    def start_game(self):
        self.questions = random.sample(self._load_questions_from_json("data.json"), 5)

    def get_player_score(self, player_id):
        return self.player_scores.get(player_id, 0)

    def get_winner(self):
        return max(self.player_scores, key=self.player_scores.get)


    def set_game_started(self):
      self.game_started = True

    def answer_question(self, player_id, question_id, answer_id):
        print(f"resposta do player {player_id} para a pergunta {question_id} com a resposta {answer_id}")

        current_question = next((q for q in self.questions if str(q["id"]) == str(question_id)), None)

        print(self.questions)

        if current_question is None:
            print(f"Pergunta com ID {question_id} não encontrada")
            return False

        print(f"Pergunta encontrada: {current_question}")

        current_answer = next((a for a in current_question["answers"] if str(a["id"]) == str(answer_id)), None)

        if current_answer is None:
            print(f"Resposta com ID {answer_id} não encontrada")
            return False

        print(f"Resposta encontrada: {current_answer}")

        if current_answer["correct"]:
            self.player_scores[player_id] += 1
            print(f"Resposta corretaa!!! {player_id}: {self.player_scores[player_id]}")
            return True
        else:
            print(f"Resposta incorreta :( {player_id}: {self.player_scores[player_id]}")
            return False
