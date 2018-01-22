import { Observable } from 'rxjs/Observable';
import { CommunicationDataModel } from '../models/communication-data.model';

export abstract class BaseCommunicationService {
  abstract send(data: CommunicationDataModel): void;
  abstract listenToChannel(channel: string): Observable<any>;
}
