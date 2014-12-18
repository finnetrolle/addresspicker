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
### Конструктор ###
Инициализация объекта перенесена из конструктора в метод initMap(), который может принимать аргументы latitude, longitude и zoom. Ниже приводятся варианты использования метода initMap():

```
#!javascript
// инициализация по умолчанию, координаты и масштаб для первичного позиционирования
// извлекается из настроек
mapDecorator.initMap();

// инициализация, устанавливающая координаты из аргументов, а масштаб из настроек
mapDecorator.initMap(30.00, 61.00);

// инициализация, устанавливающая координаты и масштаб
mapDecorator.initMap(30.00, 61.00, 12); // init with position and zoom
```
**Координаты задаются в формате WGS84**

### События ###

* **objectSelected** - возникает при выделении объекта через строку поиска или клик на карте
* **cadasterResponse** - возникает при получении ответа от кадастрового сервиса
* **resResponse** - возникает при получении ответа от сервиса границ РЭС

### Методы ###

```
#!javascript

initMap(longitude, latitude, zoom) // инициирует карту
```

```
#!javascript

queryCadasterService() // отправляет запрос в кадастровый сервис для заполнения кадастрового номера
```



```
#!javascript

queryResService() // отправляет запрос в сервис границ РЭС для определения принадлежности к РЭС
```



```
#!javascript

getResultObject() // возвращает текущий подсвеченный объект с адресной и координатной информацией
```



```
#!javascript

setExtent(longitude, latitude, zoom) // устанавливает экстент карты с помощью задания точки центра экрана и масштаба
```



```
#!javascript

getZoom() // возвращает масштаб 
```




```
#!javascript

getCenter() // возвращает координаты центра экрана
```




```
#!javascript

getMaximalZoom() // вернуть максимальный возможный масштаб
```



```
#!javascript

getMinimalZoom() // вернуть минимальный возможный масштаб
```



```
#!javascript

highlightObjectByAddress(string_address) // подсветить маркером объект по адресу (в случае успеха метод вызовет событие objectSelected)
```



```
#!javascript

highlightObjectByPosition(latitude, longitude) // подсветить маркером объект по координатам (в случае успеха метод вызовет событие objectSelected)
```

## Формат возвращаемого объекта ##

```
#!javascript

{

}
```
