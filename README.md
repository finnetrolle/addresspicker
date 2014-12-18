## Добавление компонента на вашу web-страницу ##
Пример добавления находится в файле index.html. Вкратце, процесс происходит следующим образом:

```
#!javascript
require([
            'AddressPicker/MapDecorator', 'dojo/on'
        ], function (MapDecorator, on) {
            var mapDecorator = new MapDecorator();
            mapDecorator.initMap(); // init default values
        });
```

## Подключение к событиям ##
Для того, чтобы подключиться к событиям, можно использовать dojo/on следующим образом:

```
#!javascript
on(mapDecorator, "objectSelected", function(){
// обработчик события
});
```

## Сторонние библиотеки ##
Для того чтобы проект заработал необходимо скачать библиотеки dojo и esri ArcGIS JavaScript SDK либо с офсайта либо отсюда - http://188.226.222.97/aplibs.tar.gz


## API адресной компоненты ##
[Описание API](https://bitbucket.org/finnetrolle/addresspicker/wiki/API%20%D0%B0%D0%B4%D1%80%D0%B5%D1%81%D0%BD%D0%BE%D0%B9%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D1%8B)

## Поддержка парсинга номера дома ##
Описание парсинга можно найти [тут](https://bitbucket.org/finnetrolle/addresspicker/wiki/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%D0%B0%20%D0%B4%D0%BE%D0%BC%D0%B0) 

## Патчноуты ##
[https://bitbucket.org/finnetrolle/addresspicker/wiki/Patch%20notes](https://bitbucket.org/finnetrolle/addresspicker/wiki/Patch%20notes)