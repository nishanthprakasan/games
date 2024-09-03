from django.db import models
# Create your models here.
class UserInfo(models.Model):
    username = models.CharField(max_length=200)
    rating =  models.SmallIntegerField(default=1200)
    activity = models.CharField(default='logged out',max_length=200)

class GameInfo(models.Model):
    gameId = models.CharField(max_length=300)
    user1 = models.CharField(max_length=200)
    user2 = models.CharField(max_length=200)
    gameStatus = models.CharField(max_length=50)