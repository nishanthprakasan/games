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