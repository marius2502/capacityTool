import { Entry } from "../models/entry";

export class EntrySercice {

  entries: Entry[] = [
    { title: 'Streichen', startDate: new Date(2019, 6, 22), endDate: new Date(2019, 6, 31) },
    { title: 'Tapezieren', startDate: new Date(2019, 6, 2), endDate: new Date(2019, 6, 4) },
    { title: 'Anderes', startDate: new Date(2019, 6, 2), endDate: new Date(2019, 6, 8) },
    { title: 'Anderes2', startDate: new Date(2019, 6, 2), endDate: new Date(2019, 6, 8) },
    { title: 'Laminat legen', startDate: new Date(2019, 7, 2), endDate: new Date(2019, 7, 9) }
  ]

  getEntries() {
    return this.entries;

  }
}