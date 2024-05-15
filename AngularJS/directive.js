angular
.module("mainApp", [])
.directive(           // Директиви - як контролери, тільки з розміткою
    "directive1",     // Ф-ція ініціалізації повертає об'єкт-налаштування
    function() {      // із необхідною розміткою (template) та формою вбудови        
        return {      // restrict: "A" - через Атрибут
            template: "<b>Я директива 1</b>",
            restrict: "A"
        }
    }
)
.directive(
    "directive2",
    function() {
        return {
            scope: {},     // ізольований окіл (свій, власний)
            controller: function($scope) {
                $scope.data = "Дані директиви 2"
            },
            template: "<i>Я директива 2 з даними: {{data}}</i>",
            restrict: "C"  // C - через стильовий клас
        }
    }
)
.directive(
    "directive3",
    function() {
        return {
            restrict: "E",   // Е - через тег (Element)
            replace: true,   // заміняти батьківський блок
            scope: {},
            template: `<div style="border:1px solid gray">
                Це директива 3
                <p>{{data}}</p>
                <button ng-click="addExclamation()">ADD</button>
            </div>`,
            controller: function($scope) {
                $scope.data = "Hello, world";
                $scope.addExclamation = () => $scope.data += "!";
            }
        }
    }
)
.directive(
    "directive4",
    function() {
        return {
            restrict: "M",   // через коментар
            template: `<b>Я директива 4 <calc initial="30" step="1"></calc> </b>`,
            replace: true    // для коментаря - це необхідно
        }
    }
)
.directive("calc", function(){ return {
    restrict: "E",
    replace: true,
    scope: {},
    template: `<div>
        <button ng-click="dec()">--</button>
        <b>{{num}}</b>
        <button ng-click="inc()">++</button>
    </div>`,
    controller: function($scope) {
        $scope.dec = () => $scope.num -= $scope.step;
        $scope.inc = () => $scope.num = Number($scope.num) + Number($scope.step);
    },
    link: function(scope, element, attr) {
        /* link - подія життєвого циклу коли директива
        вбудовується у DOM і стає його елементом. Це функція,
        її параметри - це таки параметри, відповідно їх порядок
        має значення:
        scope - посилання на лекс.окіл,
        element - посилання на DOM елемент, яким стає директива
        attr - об'єкт з атрибутами тегу HTML у який вбудовується директива */
        scope.num = attr.initial;  // <calc initial="10"></calc>
        scope.step = attr.step;
    }
}})