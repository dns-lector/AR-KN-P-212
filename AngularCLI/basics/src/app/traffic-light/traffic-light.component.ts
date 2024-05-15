import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'traffic-light',
  standalone: true,
  imports: [],
  templateUrl: './traffic-light.component.html',
  styleUrl: './traffic-light.component.css'
})
export class TrafficLightComponent  implements OnChanges {
  @Input()
  state: number = 0;
  nextState() {
    this.state = ( this.state + 1 ) % 4 ; 
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    console.log(changes["state"]);
  }
}
/*
Задача:
додати чотири кнопки які включають кожна свій режим
світлофора. Забезпечити стильове виділення тієї кнопки,
який зараз включено режим.
*/