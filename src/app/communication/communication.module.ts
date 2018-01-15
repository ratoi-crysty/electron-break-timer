import { NgModule } from '@angular/core';
import { CommunicationService } from './services/communication.service';
import { NgxElectronModule } from 'ngx-electron';

@NgModule({
  imports: [
    NgxElectronModule
  ],
  declarations: [],
  providers: [ CommunicationService ]
})
export class CommunicationModule {

}
