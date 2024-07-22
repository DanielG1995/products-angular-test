import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnChanges {
  @Input() message: string = ''

  ngOnChanges(changes: SimpleChanges) {
    if (changes['message']) {
      setTimeout(() => {
        this.message = ''
      }, 3000);
    }
  }

}
