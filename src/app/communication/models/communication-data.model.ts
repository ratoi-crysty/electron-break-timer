export class CommunicationDataModel {
  constructor(public readonly channel: string, public readonly value: any, public readonly toRenderer: boolean = true) {
  }
}
