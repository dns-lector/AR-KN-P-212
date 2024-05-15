import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  initialState: number = 2;
  _title: string = 'basics';
  _titleClickCnt: number = 0;
  title: string = this._title;

  constructor(public router: Router) {}

  titleClick() {                     
    this._titleClickCnt++;           
    this.title = (
      [...this._title]
        .slice(0, this._titleClickCnt)
        .map(c => c.toUpperCase())
        .join('') + (
      (this._titleClickCnt <= this._title.length)
        ? this._title.substring(this._titleClickCnt, this._title.length)
        : "!".repeat(this._titleClickCnt - this._title.length)));
  }
  resetClick() {
    this.initialState = 0;
    this.initialState = 1;
  }
}
/*
(Світлофор) Доповнити секціями: біля червоного кольору 
зелена стрілка праворуч, яка включається з червоним кольором
Біля зеленого кольору також стрілка, яка включається як з 
зеленим, так і з червоним. В інших режимах стрілки не активні.
*/