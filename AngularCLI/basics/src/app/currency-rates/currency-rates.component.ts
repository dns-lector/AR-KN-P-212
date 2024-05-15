import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-currency-rates',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './currency-rates.component.html',
  styleUrl: './currency-rates.component.css'
})
export class CurrencyRatesComponent {
  searchControl = new FormControl('');
  searchClick() {
    console.log(this.searchControl.value);
    if(!this.searchControl.value) {
      this.shownRates = this.rates;
    }
    else {
    this.shownRates = this.rates.filter( r => 
      r.cc.toLowerCase().includes(this.searchControl.value!.toLowerCase()));
    }
  }
  nbuUrl = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";
  rates: Array<NbuRate> = [];  // масив даних про курси, початково порожній
  shownRates: Array<NbuRate> = [];
  
  hashes: Array<Hash> = [];
  title: string = "";
/* Інжекція - "запит" на використання сервісу у провайдерів (див. app.config.ts)
Найбільш традиційна форма інжекції - через конструктор об'єкту.
Це, зокрема, унеможливлює створення об'єкту без передачі йому сервісу.
*/
  constructor( private http: HttpClient ) {   // синтаксис ОГОЛОШЕННЯ поля через конструктор ...
    // ... тому http доступний не як параметр "http", а як поле "this.http"
    this.http.get<Array<NbuRate>>(this.nbuUrl)
    .subscribe( data => this.rates = this.shownRates = data );

    this.http.get("https://localhost:7038/Home/Ioc?format=json")
      .subscribe( (data:any) => {
        this.hashes = Object.keys(data.hashes).map(k => { 
          return {input: k, digest: data.hashes[k]} as Hash;
        });
        this.title = data.title;
      });
  }
}
/* Інтерфейс даних, що одержуються з ASP */
interface Hash {
  input: string,
  digest: string
}
/* Інтерфейс для типізації даних, що одержуються по API НБУ
https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json
{
    "r030": 36,
    "txt": "Австралійський долар",
    "rate": 25.5135,
    "cc": "AUD",
    "exchangedate": "29.03.2024"
  },
*/
interface NbuRate {
  r030: number,
  txt: string,
  rate: number,
  cc: string,
  exchangedate: string
}
/* Д.З.
 - шаблонізація: додати footer, який буде відображатись на 
    усіх сторінках сайту.
 - створити "віджет" популярних валют, вивести його на сторінці
     /rates. У віджеті використати ті ж дані, що й таблиця, але
     відобразити лише заданий набір валют
     | Є = 42.1 ₴ |   
     | $ = 38.9 ₴ |
 */