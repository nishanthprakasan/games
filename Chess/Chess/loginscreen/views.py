import random
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login,logout
from .forms import RegisterForm, LoginForm
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import UserInfo , GameInfo
from django.contrib import messages

def defaultpage(request):
    return redirect('/accounts/login')

def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            UserInfo.objects.create(username = form.cleaned_data['username'])
            messages.success(request, 'You have registered successfully!')
            return redirect('/accounts/login')  
    else:
        form = RegisterForm()
    return render(request, 'accounts/register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            userinfo = UserInfo.objects.get(username = user.username)
            userinfo.activity = 'logged in'
            userinfo.save()
            login(request, user)
            return redirect('/accounts/play')  
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form})

@login_required
def user_logout(request):
    userinfo = UserInfo.objects.get(username=request.user.username)
    userinfo.activity = 'logged out'
    userinfo.save()
    logout(request)
    return redirect('/accounts/login')  

@login_required
def play(request , room_id = None):
    username = request.user.username
    if room_id:
        return render(request, 'home.html',{'username' : username , 'room_id' : room_id})
    else:
        return render(request, 'home.html',{'username' : username })

@csrf_exempt
@login_required
def update_action(request):
    username = request.user.username
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'new_game':
            userinfo = UserInfo.objects.get(username=request.user.username)
            userinfo.activity = 'looking for new game'  
            opponent , room_id = findingOpponent(username)
            userinfo.save()
            opponent, room_id = findingOpponent(username)
            print(room_id,opponent)
            if opponent and userinfo.activity != 'in game':
                GameInfo.objects.create(gameId = room_id, user1 = opponent,user2 = username,gameStatus = 'ongoing')
                userinfo.activity = 'in game'
                userinfo.save()
                print('user2',request.user.username , 'black')
                return JsonResponse({'status': 'redirect', 'room_id': room_id , 'opponent' :GameInfo.objects.get(user2 = username).user1 , 'user' : username,
                                     'colour' : 'black'})
            else:
                return JsonResponse({'status': 'waiting_for_opponent' , 'room_id' : None})
        elif action == 'game_end':
            userinfo = UserInfo.objects.get(username=request.user.username)
            userinfo.activity = 'logged in'  
            userinfo.save()
            return JsonResponse({'status': 'success'})
    return render(request, 'home.html', {'username': username})

@csrf_exempt
@login_required
def checkOpp(request):#user 1 is black user 2 is white
    if GameInfo.objects.filter(user1=request.user.username).exists():#user1 contians opponents name
        if GameInfo.objects.get(user1 = request.user.username).gameStatus == 'ongoing' and UserInfo.objects.get(username = request.user.username).activity != 'in game':
            print('user1',request.user.username , 'white')
            userinfo = UserInfo.objects.get(username=request.user.username)
            userinfo.activity = 'in game'
            userinfo.save()
            return JsonResponse({'status': 'redirect', 'room_id': GameInfo.objects.get(user1 = request.user.username).gameId , 'user' : request.user.username,
                                 'opponent' :GameInfo.objects.get(user1 = request.user.username).user2 , 'colour' : 'white'})
    return render(request, 'home.html', {'username': request.user.username })



def findingOpponent(username):
    opponents = list(UserInfo.objects.filter(activity = 'looking for new game').exclude(username = username).values_list('username', flat=True))
    if len(opponents) == 0:    return None , None
    opponent = opponents[0]
    if opponent:
        existingRoomId = list(GameInfo.objects.values_list('gameId' , flat = True))
        while True:
            room_id = random.randint(0,9999999)
            if room_id not in existingRoomId :
                break
        return opponent , room_id


@login_required
def chatApp(request):
    return render(request,'chat.html',{'username' : request.user.username})
     