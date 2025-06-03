from django.db import models

class Users(models.Model):
	idusers = models.AutoField(primary_key=True)
	name = models.CharField(max_length=50)
	password = models.CharField(max_length=120)
	description = models.CharField(max_length=1200, null=True, blank=True)
	img = models.ImageField(upload_to='media/', null=True, blank=True)

	class Meta:
		db_table = 'User'
		verbose_name='users'
		verbose_name_plural='Users'
		ordering = ['idusers']

class Followers(models.Model):
	idfollowers = models.AutoField(primary_key=True)
	fk_follower = models.ForeignKey(Users, on_delete = models.CASCADE, related_name='follower_set')
	fk_followed = models.ForeignKey(Users, on_delete = models.CASCADE, related_name='following_set')

	class Meta:
		db_table = 'Followers'
		verbose_name='Followers'
		verbose_name_plural='Followers'
		ordering = ['idfollowers']

class Posts(models.Model):
	idposts = models.AutoField(primary_key=True)
	title = models.CharField(max_length=100)
	content = models.TextField()
	link = models.TextField()
	img = models.ImageField(upload_to='media/')
	likes = models.IntegerField(null=True, blank=True, default = 0)
	dislikes = models.IntegerField(null=True, blank=True, default = 0)
	fk_Users = models.ForeignKey(Users, on_delete = models.CASCADE)

	songtitle = models.CharField(max_length=50)
	album = models.CharField(max_length=50, null=True, blank=True)
	band = models.CharField(max_length=50, null=True, blank=True)

	class Meta:
		db_table = 'Posts'
		verbose_name='Posts'
		verbose_name_plural='Posts'
		ordering = ['likes', 'idposts']

class Comments(models.Model):
	idcomments = models.AutoField(primary_key=True)
	content = models.TextField()
	date = models.DateTimeField(auto_now_add=True)
	fk_Posts = models.ForeignKey(Posts, on_delete = models.CASCADE)
	
	class Meta:
		db_table = 'Comments'
		verbose_name='Comments'
		verbose_name_plural='Comments'
		ordering = ['date']

class Tags(models.Model):
	idtags = models.AutoField(primary_key=True)
	name = models.CharField(max_length=100)

	class Meta:
		db_table = 'Tags'
		verbose_name='Tags'
		verbose_name_plural='Tags'
		ordering = ['idtags']

class TagsPosts(models.Model):
	idtagsposts = models.AutoField(primary_key=True)
	fk_posts = models.ForeignKey(Posts, on_delete = models.CASCADE)
	fk_tags = models.IntegerField()
	category = models.IntegerField()

	class Meta:
		db_table = 'TagsPosts'
		verbose_name='TagsPosts'
		verbose_name_plural='TagsPosts'
		ordering = ['category']


#-------------------------------CATALOGUES

class Bands(models.Model):
	idbands = models.AutoField(primary_key=True)
	name =  models.CharField(max_length=100)

	class Meta:
		db_table = 'Bands'
		verbose_name='Bands'
		verbose_name_plural='Bands'
		ordering = ['idbands']

class Genres(models.Model):
	idgenres = models.AutoField(primary_key=True)
	name =  models.CharField(max_length=100)

	class Meta:
		db_table = 'Genres'
		verbose_name='Genres'
		verbose_name_plural='Genres'
		ordering = ['idgenres']

class Feelings(models.Model):
	idfeelings = models.AutoField(primary_key=True)
	name =  models.CharField(max_length=100)

	class Meta:
		db_table = 'Feelings'
		verbose_name='Feelings'
		verbose_name_plural='Feelings'
		ordering = ['idfeelings']

