const urlTemplate = "https://www.icalendar37.net/lunar/api/?year=[year]&month=[month]&shadeColor=gray&size=150&texturize=true";

const moonTemplate = `
<div class="moon-widget">
    <div class="moon-container">
        <div class="day-name">{{moonData.nameDay[dayIndex]}}</div>
        <div class="widget-date">{{widgetDate.getDate()}}</div>
        <div class="widget-month">{{moonData.monthName}}</div>
        <div class="widget-year">{{moonData.year}}</div>
        <div class="widget-img" ng-bind-html="toTrusted(moonData.phase[widgetDate.getDate()].svg)"></div>
        <div class="widget-phase">{{moonData.phase[widgetDate.getDate()].npWidget}}</div>
        <div class="widget-origin">{{moonData.autor}}</div>
    </div>
    <input type="date" ng-model="selectedDate" ng-change="onDateChange()" />
</div>`;

function moonController($scope, $http, $sce) {     
    $scope.widgetDate = $scope.selectedDate = new Date();
    let year = $scope.widgetDate.getFullYear();
    let month = $scope.widgetDate.getMonth() + 1;
    let url = urlTemplate
        .replace("[year]", year)
        .replace("[month]", month);
                                                   // $sce - Strict Contextual Escaping
                                                   // спеціальний сервіс для перевірки
    $http.get(url).then( response => {             // HTML, що передається через змінні
        $scope.moonData = response.data;           // Без такої перевірки теги у HTML
                                                   // не обробляються і виводяться як є
    });                                            // "<b>Demo HTML</b>"
    
    $scope.dayIndex = ( $scope.widgetDate.getDay() + 6 ) % 7;
    $scope.onDateChange = () => {
        // console.log($scope.selectedDate);
        if($scope.selectedDate.getMonth() == $scope.widgetDate.getMonth() &&
            $scope.selectedDate.getYear() == $scope.widgetDate.getYear() ) {   // вибрана дата (selectedDate) у тому ж місяці, що й у віджеті (widgetDate)
                $scope.widgetDate = $scope.selectedDate;
        }
        else {   // необхідно робити новий запит до API

        }
    }

    $scope.demo =                                  // Для виведення HTML потрібно
        $sce.trustAsHtml("<b>Demo HTML</b>");      // 1) одержати "довіру" $sce.trustAsHtml
                                                   // 2) передати HTML в атрибут ng-bind-html
    // для можливості одержання "довіри" безпосередньо в шаблоні (розмітці)
    // перекладемо до контексту посилання на метод $sce.trustAsHtml
    $scope.toTrusted = $sce.trustAsHtml;

}

angular
.module("moonApp",[])
.component("moon", {
    template: moonTemplate,
    controller: moonController
});
/*
m t w t f s s
1 2 3 4 5 6 0  JS (new Date().getDay();)
0 1 2 3 4 5 6  API
*/