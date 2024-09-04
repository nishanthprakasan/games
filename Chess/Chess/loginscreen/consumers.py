import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class ChessConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs'].get('room_id')
        self.room_group_name  = f'play_{self.room_name}'
        self.accept()
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.send(text_data=json.dumps({
            'type' :'connection established',
            'message' : 'you are connected'
        }))
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        piece = text_data_json['piece']
        initial_pos = text_data_json['initial_pos']
        final_pos = text_data_json['final_pos']

        # Send the data to the room group
        self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_move',
                'piece': piece,
                'initial_pos': initial_pos,
                'final_pos': final_pos
            }
        )

    # Receive message from room group
    def game_move(self, event):
        piece = event['piece']
        initial_pos = event['initial_pos']
        final_pos = event['final_pos']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'piece': piece,
            'initial_pos': initial_pos,
            'final_pos': final_pos
        }))