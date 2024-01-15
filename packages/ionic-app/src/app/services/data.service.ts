import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Status } from '../models/Status';

export interface Message {
  fromName: string;
  subject: string;
  date: string;
  id: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public messages: Status[] = [];
  private socket: Socket;
  private socketUrl = 'ws://localhost:3003';
  private FINISH_STATUS = 'Finish';

  constructor(private http: HttpClient) {}

  public getMessages(): Status[] {
    return this.messages;
  }

  public getLastStatus(uuid: string) {
    console.log('data.service:getLastStatus: ' + uuid);
    return this.http.post('http://localhost:3000', { uuid: uuid }).pipe(
      map((res: Status) => {
        console.log('data.service:getLastStatus:map: ', res);
        this.messages.push(res);
      })
    );
  }

  public connect(uuid: string): Subject<MessageEvent> {
    this.socket = io(this.socketUrl, {
      transports: ['websocket'],
      path: '/socket.io',
    });
    console.log('data.service:connect: ' + this.socketUrl);

    let observable = new Observable((observer) => {
      this.socket.on(`user.uuid.${uuid}`, (data: Status) => {
        console.log('data.service:connect:message: ', data);
        this.messages.push(data);
        observer.next(data);
        if (data.status === this.FINISH_STATUS) {
          observer.complete();
        }
      });

      return () => {
        console.log('data.service:connect:disconnect');
        this.socket.disconnect();
      };
    });

    let observer = {
      next: (data: Status) => {
        console.log('data.service:connect:observer: ', data);
      },
    };

    return Subject.create(observer, observable);
  }

  public triggerWebhook(uuid: string) {
    console.log('data.service:triggerWebhook: ' + uuid);
    return this.http.post('http://localhost:3000/triggerWebhook', {
      uuid: uuid,
    });
  }
}
