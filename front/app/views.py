from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from .serializers import *
from .models import *
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from collections import Counter

from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator

def search_deezer(request):
    query = request.GET.get('q', '')
    if not query:
        return JsonResponse({'error': 'No query provided'}, status=400)

    url = f'https://api.deezer.com/search?q={query}'
    response = requests.get(url)

    if response.status_code == 200:
        return JsonResponse(response.json(), safe=False)
    else:
        return JsonResponse({'error': 'Failed to fetch from Deezer'}, status=response.status_code)

class UsersDetailAPIView(generics.ListAPIView):
    #lookup_field="idusers"
    queryset = Users.objects.all()
    serializer_class = UsersDetailSerializer

class UsersHomeAPIView(generics.ListAPIView):
    lookup_field="idusers"
    queryset = Users.objects.all()
    serializer_class = UsersHomeSerializer

class OneUsersAPIView(generics.RetrieveAPIView):
    lookup_field="idusers"
    queryset = Users.objects.all()
    serializer_class = UsersDetailSerializer

class UsersListAPIView(generics.ListAPIView):
    lookup_field="idusers"
    queryset = Users.objects.all()
    serializer_class = UsersListSerializer

class DeleteUsersAPIView(generics.DestroyAPIView):
    lookup_field = "idusers"
    queryset = Users.objects.all()
    serializer_class = UsersDetailSerializer

class PostsListAPIView(generics.ListAPIView):
    queryset = Posts.objects.all()
    serializer_class = PostsDetailSerializer

class PostsDestroyAPIView(generics.DestroyAPIView):
    lookup_field = "idposts" 
    queryset = Posts.objects.all()
    serializer_class = PostsDetailSerializer
class destroyFollowingAPIView(generics.DestroyAPIView):
    lookup_field = "idfollowers"
    queryset = Followers.objects.all()
    serializer_class = FollowDetailSerializer
class PostsUpdateAPIView(generics.RetrieveUpdateAPIView):
    lookup_field = "idposts"
    queryset = Posts.objects.all()
    serializer_class = PostsDetailSerializer

class PostsDetailAPIView(generics.RetrieveAPIView):
    lookup_field = 'idposts'
    queryset = Posts.objects.all()
    serializer_class = PostsDetailSerializer

class PostsListUserAPIView(generics.ListAPIView):
    serializer_class = PostsDetailSerializer

    def get_queryset(self):
        user_id = self.kwargs['fk_Users']
        return Posts.objects.filter(fk_Users=user_id)

class PostsHomeListAPIView(generics.ListAPIView):

    serializer_class = PostsHomeSerializer

    def get_queryset(self):
        return Posts.objects.all()[:5]

class UsersCreateAPIView(generics.CreateAPIView):
    queryset=Users.objects.all()
    serializer_class=UsersDetailSerializer

class UserRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    lookup_field="idusers"
    queryset=Users.objects.all()
    serializer_class=UsersDetailSerializer

class TagsPostsDetailAPIView(generics.ListAPIView):
    serializer_class = TagsPostsDetailSerializer

    def get_queryset(self):
        fk_posts = self.kwargs['fk_posts']
        return TagsPosts.objects.filter(fk_posts=fk_posts)

class UpdateTagsPosts(generics.RetrieveUpdateAPIView):
    lookup_field="idtagsposts"
    queryset=TagsPosts.objects.all()
    serializer_class=TagsPostsDetailSerializer

class TagsPostsCreateAPIView(generics.CreateAPIView):

    queryset=TagsPosts.objects.all()
    serializer_class=TagsPostsDetailSerializer

def NameTag(request, category, fk_tags):

    if category == 1:
        name = Bands.objects.filter(idbands = fk_tags).values_list('name',flat = True).first()
        print(type(name))
        return JsonResponse({'name': name})

    if category == 2:
        name = Genres.objects.filter(idgenres = fk_tags).values_list('name',flat = True).first()
        print(type(name))
        return JsonResponse({'name': name})

    if category == 3:
        name = Feelings.objects.filter(idfeelings = fk_tags).values_list('name',flat = True).first()
        print(type(name))
        return JsonResponse({'name': name})

def postsfromtags(request, category, idtag):

    posts = TagsPosts.objects.filter(category = category, fk_tags = idtag).values_list('fk_posts',flat=True)

    return JsonResponse(list(posts), safe=False)

class PostsCreateAPIView(generics.CreateAPIView):
    queryset=TagsPosts.objects.all()
    serializer_class=PostsDetailSerializer

class FeelingsListAPIView(generics.ListAPIView):
    queryset = Feelings.objects.all()
    serializer_class = FeelingsListSerializer

class GenresListAPIView(generics.ListAPIView):
    queryset = Genres.objects.all()
    serializer_class = GenresListSerializer


class BandsListAPIView(generics.ListAPIView):
    queryset = Bands.objects.all()
    serializer_class = BandsListSerializer

class CommentsListAPIView(generics.ListAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsListSerializer

class CommentsPostAPIView(generics.ListAPIView):
    serializer_class = CommentsListSerializer

    def get_queryset(self):
        post_id = self.kwargs['fk_Posts']
        return Comments.objects.filter(fk_Posts=post_id)

class CommentCreateAPIView(generics.CreateAPIView):
    queryset=Comments.objects.all()
    serializer_class=CommentsListSerializer

class PostsDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Posts.objects.all()
    serializer_class = PostsDetailSerializer
    lookup_field = 'idposts'

#A QUIÉN ESTOY SIGUIENDO:
def FollowingList(request, idusers):
    following = Followers.objects.filter(fk_follower = idusers).values_list('fk_followed')
    ids = Followers.objects.filter(fk_follower = idusers).values_list('idfollowers')
    return JsonResponse({
        'following': list(following),
        'ids': list(ids)
    })

#QUIÉN ME ESTÁ SIGUIENDO:
def FollowedList(request, idusers):
    followed = Followers.objects.filter(fk_followed = idusers).values_list('fk_follower',flat = True)
    return JsonResponse({'followed': list(followed)})

class FollowerCreateAPIView(generics.CreateAPIView):
    queryset=Followers.objects.all()
    serializer_class=FollowersDetailSerializer 


def topusers(request):
    ids = list(Posts.objects.values_list('fk_Users', flat=True))
    
    userName = []
    for idx in ids:
        userName += Users.objects.filter(idusers = idx).values_list('name', 'img', 'idusers')

    counter = Counter(userName)
    
    ordered_names = counter.most_common()

    result = [
        {'name': name, 'img': img, 'idusers': idusers}
        for (name, img, idusers), count in counter.most_common()
   ]

    return JsonResponse(result, safe=False)

def topsongs(request):
    songs = list(Posts.objects.values_list('songtitle',flat=True))

    counter = Counter(songs)
    
    ordered_songs = counter.most_common()
    print("OMCOMOCRMOMERCOEMRVOMEROVMEROIM: ",ordered_songs)

    result = [
        {'songtitle': songtitle}
        for (songtitle), count in counter.most_common()
   ]

    return JsonResponse(result, safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class giveLike(APIView):
    def patch(self, request, idposts):

        currentPost = Posts.objects.get(idposts = idposts)
        currentPost.likes += 1
        currentPost.save()

        return Response({'message': 'Like received'})

def bringLikes(request, idposts):
    post = Posts.objects.get(idposts = idposts)

    return JsonResponse ({'likes':post.likes})   

@csrf_exempt
def giveDislike(request, idposts):
    if request.method == 'PATCH':
        try:
            post = Posts.objects.get(idposts=idposts)
            post.likes -= 1
            post.save()
            return JsonResponse({'likes': post.likes})
        except Posts.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def bringDisikes(request, idposts):
    post = Posts.objects.get(idposts = idposts)

    return JsonResponse ({'likes':post.likes}) 

#----------------------------SEARCH BAR----------------------------
def search_post(request):
    query = request.GET.get('q', '')
    results = Posts.objects.filter(title__icontains=query)
    data = list(results.values('idposts','fk_Users','title'))
    return JsonResponse({'posts': data})

def search_song(request):
    query = request.GET.get('q', '')
    results = Posts.objects.filter(songtitle__icontains=query)
    data = list(results.values('idposts','fk_Users','songtitle'))
    return JsonResponse({'songs': data})

def search_album(request):
    query = request.GET.get('q', '')
    results = Posts.objects.filter(album__icontains=query)
    data = list(results.values('idposts','fk_Users','album'))
    return JsonResponse({'albums': data})

def search_band(request):
    query = request.GET.get('q', '')
    results = Posts.objects.filter(band__icontains=query)
    data = results.values('idposts','fk_Users','band')

    results_table = Bands.objects.filter(name__icontains=query)
    data_table = results.values('idbands','name')
    return JsonResponse({'bands': list(data),'table_bnds':data_table})

def search_feeling(request):
    query = request.GET.get('q', '')
    results = Feelings.objects.filter(name__icontains=query)
    data = list(results.values('idfeelings','name'))
    return JsonResponse({'feelings': data})

def search_genre(request):
    query = request.GET.get('q', '')
    results = Genres.objects.filter(name__icontains=query)
    data = list(results.values('idgenres','name'))
    return JsonResponse({'genres': data})
