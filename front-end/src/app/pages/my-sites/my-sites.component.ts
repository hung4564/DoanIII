import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-my-sites',
  templateUrl: './my-sites.component.html',
  styleUrls: ['./my-sites.component.scss'],
  host: { class: 'app-layout' }
})
export class MySitesComponent implements OnInit {
  @ViewChild('documentList') documentList: DocumentListComponent;
  menuItems: any[];
  constructor() {
    this.menuItems = [
      { title: 'Item 1', subject: new Subject() },
      { title: 'Item 2', subject: new Subject() },
      { title: 'Item 3', subject: new Subject() }
    ];
  }

  ngOnInit() {
    this.menuItems.forEach(l => l.subject.subscribe(item => this.commandCallback(item)));
  }

  commandCallback(item) {
    alert(`Executing ${item.title} command.`);
  }
}
