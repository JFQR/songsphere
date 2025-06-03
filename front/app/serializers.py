from rest_framework import serializers
from .models import *

class UsersDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model=Users
        fields=[
            'idusers',
            'name',
            'password',
            'img',
            'description',
        ]

class FollowersDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model=Followers
        fields=[
            'idfollowers',
            'fk_follower',
            'fk_followed',
        ]
class UsersListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Users
        fields=[
            'idusers',
            'name',
            'img',
        ]

class UsersHomeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Users
        fields=[
            'idusers',
            'name',
            'img',
        ]

class FeelingsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feelings
        fields = [
            'idfeelings',
            'name',
        ]

class GenresListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genres
        fields = [
            'idgenres',
            'name',
        ]

class BandsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bands
        fields = [
            'idbands',
            'name',
        ]

class TagsPostsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TagsPosts
        fields = [
            'idtagsposts',
            'fk_posts',
            'fk_tags',
            'category',
        ]

class PostsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = [
            'idposts',
            'title',
            'content',
            'link',
            'img',
            'likes',
            'dislikes',
            'songtitle',
            'album',
            'band',
            'fk_Users',
        ]

class PostsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = [
            'idposts',
            'title',
            'content',
            'link',
            'img',
            'songtitle',
            'album',
            'band',
            'fk_Users',
        ]
class FollowDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Followers
        fields = [
            'idfollowers',
            'fk_follower',
            'fk_followed',
        ]
class PostsHomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = [
            'idposts',
            'title',
            'fk_Users',
            'img',
        ]

class CommentsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = [
            'idcomments',
            'content',
            'fk_Posts',
        ]