import { GridEntry } from './../models/gridEntry';
import { Entry } from './../models/entry';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

const componentCSS = require('./app.component.scss');

/**
 * This web component easily produces icons
 * @cssprop --color - Color of the icon
 * @cssprop --size - Size of the icon
 */
@customElement('bronco-calendar')
export class BroncoCalendar extends LitElement {

  static styles = css`${unsafeCSS(componentCSS)}`;

  @property() currentDate!: Date;

  @property() loaded = false;

  /**
   * Maximum of days in selected month
   * @type {number}
   * @memberof BroncoCalendar
   */
  @property() maxDays!: number;

  @property()
  monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  @property()
  dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  @property()
  entries: Entry[] = [];

  @property()
  gridEntries: GridEntry[] = [];

  async firstUpdated() {
    this.currentDate = new Date(2019, 4, 2);
    this.maxDays = this.getMaxDaysofMonth(this.currentDate);

    // MockData
    const endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + 12);
    this.entries.push({ title: 'Urlaub', color: 'success', startDate: this.currentDate, endDate: endDate });
    // MockData end

    this.entries.forEach(entry => {
      let length = entry.endDate.getDate() - entry.startDate.getDate();
      let gridRow = Math.round(2 + (entry.startDate.getDate() / 7));
      let columnStart = (entry.startDate.getDate() + this.getWeekdaysOfLastMonth().length) % 7;

      let columnEnd = entry.startDate.getMonth() === entry.endDate.getMonth() ?
      entry.endDate.getDate() - entry.startDate.getDate() + 3 :
      9 - this.getWeekdaysOfNextMonth().length - 1 + entry.endDate.getDate();
      console.log('length: ' + length);

      while (length > 0) {

        const gridEntry: GridEntry = {
          title: entry.title,
          color: entry.color,
          startDate: entry.startDate,
          endDate: entry.endDate,
          gridRow: gridRow,
          gridColumnStart: columnStart,
          gridColumnEnd: columnEnd
        }
        console.log(entry.endDate.getDate() - entry.startDate.getDate() + 2);
        this.gridEntries.push(gridEntry);

        length = length - 5;
        gridRow++;
        columnStart = 1;
        length < 7 ? columnEnd = length : '';
      }

    });

    this.loaded = true;
  }

  getMaxDaysofMonth(date: Date): number {
    const lastDayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDayInMonth.getDate();
  }

  getNumberArray(): number[] {
    const numberArr: number[] = [];
    for (let i = 1; i <= this.maxDays; i++) {
      numberArr.push(i);
    }
    return numberArr;
  }

  /**
   *
   * The calender always begins with monday so that weekdays from last month are shown. This method returns them if first day of month is no Monday
   * @returns {number[]}
   * @memberof BroncoCalendar
   */
  getWeekdaysOfLastMonth(): number[] {
    // Gives back the last month
    const previousMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0);

    // Weekday of first day in this month
    let weekDayThisMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay() - 1;
    weekDayThisMonth === -1 ? weekDayThisMonth = 6 : '';

    const maxDaysOfPreviousMonth = this.getMaxDaysofMonth(previousMonth);
    const numberArr = [];
    // TODO
    for (let i = maxDaysOfPreviousMonth; i > maxDaysOfPreviousMonth - weekDayThisMonth; i--) {
      numberArr.push(i);
    }
    return numberArr.reverse();
  }

  getWeekdaysOfNextMonth(): number[] {
    // TODO
    // Weekday of last day in this month
    let weekDayThisMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.maxDays).getDay() - 1;
    weekDayThisMonth === -1 ? weekDayThisMonth = 6 : '';
    const numberArr = [];
    for (let i = 1; i < 7 - weekDayThisMonth; i++) {
      numberArr.push(i);
    }
    return numberArr;
  }

  nextMonth() {
    const newDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 2, 0);
    this.updateDate(newDate);
  }

  previousMonth() {
    const newDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0);
    this.updateDate(newDate);
  }

  updateDate(newDate: Date) {
    this.currentDate = newDate;
    this.maxDays = this.getMaxDaysofMonth(newDate);
  }

  getStyleMap(gridEntry: GridEntry) {
    return {
      gridRow: gridEntry.gridRow,
      gridColumnStart: gridEntry.gridColumnStart,
      gridColumnEnd: gridEntry.gridColumnEnd,
    };

  }

  render() {
    return html`
    ${this.loaded ?
        html`
    <div class="calendar-container">
      <div class="calendar-header">
        <div class="icon">
          <bronco-icon iconName="keyboard_arrow_left" @click=${() => this.previousMonth()}></bronco-icon>
        </div>

        <div class="monthYear">
          <span>${this.monthNames[this.currentDate.getMonth()]}</span>
          <br>
          <span>${this.currentDate.getFullYear()}</span>
        </div>

        <div class="icon">
          <bronco-icon iconName="keyboard_arrow_right" @click=${() => this.nextMonth()}></bronco-icon>
        </div>


      </div>
      <div class="calendar"><span class="day-name">Mon</span><span class="day-name">Tue</span><span class="day-name">Wed</span><span
          class="day-name">Thu</span><span class="day-name">Fri</span><span class="day-name">Sat</span><span class="day-name">Sun</span>

        ${this.getWeekdaysOfLastMonth().map(num => html`<div class="day day--disabled">${num}</div>`)}

        ${this.getNumberArray().map(num => html`<div class="day">${num}</div>`)}

        ${this.getWeekdaysOfNextMonth().map(num => html`<div class="day day--disabled">${num}</div>`)}

        ${this.gridEntries.filter(e => e.startDate.getMonth() === this.currentDate.getMonth()).map(entry => html`
        <section style='${styleMap(this.getStyleMap(entry))}' class="task task--${entry.color}">${entry.title},
          ${entry.startDate.getDate()} - ${entry.endDate.getDate()} ${this.monthNames[entry.endDate.getMonth()]}</section>
        `)}


        <!-- <section class="task task--warning">Projects</section>
                                                    <section class="task task--danger">Design Sprint</section>
                                                    <section class="task task--primary">Product Checkup 1
                                                      <div class="task__detail">
                                                        <h2>Product Checkup 1</h2>
                                                        <p>15-17th November</p>
                                                      </div>
                                                    </section>
                                                    <section class="task task--info">Product Checkup 2</section> -->
      </div>
    </div>
    ` :
        ''}
`
  }
}