const url = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

angular
.module("mainApp", [])     // Компонент - директива зі спрощеним синтаксисом
.component(                // Не треба зазначати scope: {}
    "component1",          // Об'єкт іде без функції, що його повертає
    {                      // 
        controller: function($scope) {
            $scope.data = "Component1 data";
            $scope.addExclamation = () => $scope.data += "!";
        },
        template: `<div ng-click="addExclamation()">
        Це компонент 1 з даними: <i>{{data}}</i>
        </div>`
    }
)
.component("rates", {
    controller: ratesController,
    template: ratesTemplate()
});

function ratesTemplate() { return `
<div>
    <h2>Курси валют</h2>
    <table><tbody>
    <tr ng-repeat="rate in rates" class="rate-{{rate.cc | lowercase}}">
        <td>{{$index + 1}}</td>
        <td>{{rate.cc}}</td>
        <td>{{rate.r030}}</td>
        <td>{{rate.txt}}</td>
        <td>{{rate.rate}}</td>
    </tr>
    </tbody></table>
</div>`;
}

// Принцип інжекції - параметри функції зв'язуються з сервісами
// не за порядком слідування, а за іменем. Немає різниці як записати
// ($http, $scope) чи ($scope, $http), важливі лише назви
function ratesController($http, $scope) {  //     
    // Робота з мережними даними:
    // на початку закладається порожні дані (масиви, об'єкти тощо)
    $scope.rates = [] ;   // це робиться для того, щоб не було помилок
    // розмітки -- оскільки дані з мережі йдуть довго, розмітка встигає
    // опрацювати початкові дані.

    // сервіс $http - заміна fetch з рядом особливостей
    // - .then один (у fetch - два)
    // - відповідь форматується у JSON
    // - тіло відповіді передається у полі "data"
    $http.get(url).then(resp => $scope.rates = resp.data);
}

angular
.module("mainApp")
.component("rate", {
    controller: function($scope, $http, $attrs) {
        $scope.currency = $attrs.currency;
        $http.get(url).then(resp => {
            $scope.rate = resp.data.filter(r => r.cc == $scope.currency)[0].rate;
        });
    },
    template: `<div>
        Currency {{currency}}
        Rate: {{rate}}
        Img: <img ng-src="{{currency | lowercase}}.png" />
    </div>`
})
/*
Д.З. AngularJS компоненти: розширити можливості віджету курсу
валют. Додати картинки основних валют. Модифікувати дизайн
включаючи: картинку, курс, дату. Провести випробування на 
декількох варіантах віджету
<rate currency="USD"></rate>
<rate currency="EUR"></rate>
<rate currency="GBP"></rate>
*/