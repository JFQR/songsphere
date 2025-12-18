from django.urls import path
from .import views

urlpatterns = [

    path('api/deezer/', views.search_deezer, name='search_deezer'),
    path("oneuser/<int:idusers>/",views.OneUsersAPIView.as_view(), name = "one_user"),
    path("user/<int:idusers>/", views.OneUsersAPIView.as_view(), name = "see_user"),
    path("delete/user/<int:idusers>/", views.DeleteUsersAPIView.as_view(), name = "see_user"),
    path("total/user/<int:idusers>/", views.UsersHomeAPIView.as_view(), name = "see_user_detail"),
    path("users/", views.UsersDetailAPIView.as_view(), name = "see_users"),
    path("comments/post/<int:fk_Posts>/", views.CommentsPostAPIView.as_view()),
    path("posts/", views.PostsListAPIView.as_view(), name = "see_posts"),
    path("post/<int:idposts>/", views.PostsDetailAPIView.as_view(), name = "see_post"),
    path("delete/post/<int:idposts>/", views.PostsDestroyAPIView.as_view(), name = "delete_post"),
    path("post/user/<int:fk_Users>/", views.PostsListUserAPIView.as_view(), name = "see_post_user"),
    path("posts/athome/", views.PostsHomeListAPIView.as_view(), name = "see_posts"),

    path('update/user/<int:idusers>/', views.UserRetrieveUpdateAPIView.as_view()),
    path("create/user/", views.UsersCreateAPIView.as_view(), name="create_user"),
    path("create/post/", views.PostsCreateAPIView.as_view(), name="create_post"),
    path("update/post/<int:idposts>/", views.PostsUpdateAPIView.as_view(), name="create_post"),
    path("create/tagsposts/", views.TagsPostsCreateAPIView.as_view(), name="create_tags_posts"),
    path("post/tagsposts/<int:fk_posts>/", views.TagsPostsDetailAPIView.as_view(),name="tags_posts_by_post"),
    path("namefromtag/<int:category>/<int:fk_tags>/", views.NameTag, name = "nametag"),
    path("update/tagsposts/<int:idtagsposts>/", views.UpdateTagsPosts.as_view(), name = "update_tagsposts"),
  #  path("update/tagsposts/", views.TagsPostsUpdateAPIView.as_view(), name="update_tags_posts"),
    path("create/comment/", views.CommentCreateAPIView.as_view(), name="create_comment"),
    path("update/post/",views.PostsDetailAPIView.as_view(), name = "update_post"),

    path("like/<int:idposts>/",views.giveLike.as_view(), name = "give_like"),
    path("bringLikes/<int:idposts>/",views.bringLikes, name = "bring_like"),

    path("dislike/<int:idposts>/",views.giveDislike, name = "give_dislike"),
    path("bringDislikes/<int:idposts>/",views.bringLikes, name = "bring_dislike"),

    path("following/<int:idusers>/", views.FollowingList, name = "see_following"),
    path("destroy/following/<int:idfollowers>/", views.destroyFollowingAPIView.as_view(), name = "destroy_following"),
    path("followed/<int:idusers>/", views.FollowedList, name = "see_follower"),
    
    path(
            "create/follower/", 
            views.FollowerCreateAPIView.as_view(), 
            name = "create_followers"
    ),

    path("feelings/", views.FeelingsListAPIView.as_view(), name = "see_feelings"),
    path("genres/", views.GenresListAPIView.as_view(), name = "see_genres"),
    path("bands/", views.BandsListAPIView.as_view(), name = "see_bands"),

    path("topusers/", views.topusers),
    path("topsongs/",views.topsongs, name = "give_dislike"),
    path("postsfromtags/<int:category>/<int:idtag>/", views.postsfromtags, name = "bring_posts_from _tags"),

#------------------------------SEARCH BAR---------------------------------------------------------------------------

    path("searchbar/posts/", views.search_post),
    path("searchbar/songs/", views.search_song),
    path("searchbar/albums/", views.search_album),
    
    path("searchbar/bands/", views.search_band),
    path("searchbar/feelings/", views.search_feeling),
    path("searchbar/genres/", views.search_genre),

]




