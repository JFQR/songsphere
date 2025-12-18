> --------------------------Spanish
# Songsphere

## Un proyecto de práctica, un sitio web para compartir interpretaciones de canciones.

En esta página, el usuario puede añadir su interpretación sobre una canción, agregar información
como el album al que pertence, por ejemplo, además de ver otras interpretaciones, comentarlas o darles like
(o dislike).

Como se mencionó, es un proyecto para practicar hecho para implementar nuevas cosas para el desarrollador, como por ejemplo:

* Uso de diversos hooks en react (useLocation o useNavigation)
* Uso del concepto de mode
* Trabajo con imágenes

# Cómo empezar a usarlo.
El primer paso sería clonar el proyecto desde github y seguir:
* Instalar Node js: https://nodejs.org/es
* Instalar Python: https://www.python.org/downloads/
* Instalar y configurar appServ y con phpmyadmin crear una base de datos llamada songsphere
* Crear un entorno virtual de python dentro de la carpeta backend
* Ir a la carpeta Scripts del entorno virtual y ejecutar activate
* Regresar a la carpeta back y ejecutar pip install -r requirements.txt, después ejecutar python manage.py makemigrations y python manage.py migrate

* Ejecutar python manage.py runserver
* Ir a front y ejecutar npm install y luego npm run dev
* Ir a http://localhost:5173 en un navegador

# Trabajo en progreso
* se necesita una forma más segura que usar un mode en algunos componentes como ViewPost.jsx
* se necesita una manera más segura de trabajar con los id de los usuarios

> --------------------------English
# Songsphere

## A practice project, a website to share intepretations of songs.

On this website, the user can add their interpretation about a song, add information like 
the album of the song, for example or see more interpretations, comment them or like or dislike them

Like menctioned, is a practice project, made to implement new stuff for the developer, for example:


* Usage of different react hooks (useLocation o useNavigation)
* Usage of the mode concept
* Work with images

# Getting started.
The first step is to clone the project from github and then:

* Install Node js: https://nodejs.org/es
* Install Python: https://www.python.org/downloads/
* Install and configure appServ and with phpmyadmin create a database with the name songsphere
* Create a virtual enviroment in the  backend folder
* execute activate in the Scripts folder (wich is in the virtual enviroment folder)
* Go back to the back folder and execute pip install -r requirements.txt, then execute python manage.py makemigrations y python manage.py migrate


* Execute python manage.py runserver
* Go to front and execute npm install then execute npm run dev
* Go to http://localhost:5173 on a browser

# Work in progress
* A safer way to use mode in components like ViewPost.jsx is needed
* A safer way to work with the users IDs
