import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  RefresherCustomEvent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonInput,
  IonButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { MessageComponent } from '../message/message.component';
import { DataService, Message } from '../services/data.service';
import { FormsModule } from '@angular/forms';
import { Status } from '../models/Status';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonInput,
    IonButton,
    IonLabel,
    FormsModule,
    MessageComponent,
  ],
})
export class HomePage {
  private dataService = inject(DataService);
  private buttonStat = {
    status: 'Connect',
    color: 'primary',
  };

  uuid: string = '';
  statusResult: string = '';
  results: {
    status: string;
    datetime: string;
  }[] = [];
  constructor() {}

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  getMessages(): Status[] {
    return this.dataService.getMessages();
  }

  connectWs() {
    this.dataService.getLastStatus(this.uuid).subscribe((res) => {
      console.log('home.page:get:getLastStatus:subscribed', res);
    });

    this.dataService.connect(this.uuid).subscribe((res) => {
      console.log('home.page:get:connect:subscribed', res);
    });
  }

  triggerWebhook() {
    this.dataService.triggerWebhook(this.uuid).subscribe((res) => {
      console.log('home.page:triggerWebhook:subscribed', res);
    });
  }
}
