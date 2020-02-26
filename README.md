# Rover Marte
Resolver un pequeño problema de Nodejs. Aunque en el problema habla de robots, los he llamado rovers para darle un toque personal

https://github.com/guidesmiths/interview-code-challenges/blob/master/node/martian-robots/instructions.md

Descargar o clonar el repositorio
```
Clonar con HTTPS: https://github.com/ovimax/marte-rover.git
Clonar con SSH: git@github.com:ovimax/marte-rover.git
```
Lanzar los siguiente comandos para iniciar la prueba:
```
$ cd marte-rover
$ npm install
$ npm start
```

Abre [http://localhost:3000/](http://localhost:3000/) para ver los resultados de la prueba
Para interaccionar con diferentes resultado de la prueba simplemente edite el archivo *route_sheet.txt*, respetando las reglas estipulados en el problema. En el caso de el documentos no esta bien definido se muestra un mensaje de error en formato JSON:

> {"errorCode":400,"error":"El tamaño del mapa no esta definido en la hoja de rutas"}