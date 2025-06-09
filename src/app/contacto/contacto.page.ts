import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: 'contacto.page.html',
  styleUrls: ['contacto.page.scss'],
  standalone: false
})
export class ContactoPage implements OnInit {
  expandido: number | null = null;
  constructor() { }

  ngOnInit() {
  }

}
