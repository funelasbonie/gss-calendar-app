import { Component } from '@angular/core';

interface Job {
  title: string;
  startTime: Date;
  endTime: Date;
  day: string;
  status: string;
}

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent {
  readonly jobStatusColors: { [status: string]: string } = {
    Pending: '#9FE5FF',
    InProgress: '#FFF38D',
    Completed: '#DBC6FF',
  };

  constructor() {
    this.updateDateRange();
  }

  showSearchInput: boolean = false;
  currentDateRange: string = '';
  today: Date = new Date();

  days: string[] = this.getWeekDates(this.today);

  times: string[] = Array.from({ length: 24 }, (_, i) => {
    const hour = i + 6;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:00 ${ampm}`;
  });

  jobs: Job[] = [
    {
      title: 'Job at 9:00',
      startTime: new Date('2024-03-25T09:00:00'),
      endTime: new Date('2024-03-25T10:00:00'),
      day: 'Mon 18',
      status: 'Pending',
    },
    {
      title: 'Job at 9:00',
      startTime: new Date('2024-03-25T09:00:00'),
      endTime: new Date('2024-03-25T10:00:00'),
      day: 'Mon 18',
      status: 'InProgress',
    },
    {
      title: 'Job at 10:00',
      startTime: new Date('2024-03-25T10:00:00'),
      endTime: new Date('2024-03-25T11:30:00'),
      day: 'Tue 19',
      status: 'Completed',
    },
  ];

  getWeekDates(date: Date): string[] {
    const days: string[] = [];
    date.setDate(date.getDate() - date.getDay());
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + i);
      const formattedDate = newDate.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
      });
      const [weekday, day] = formattedDate.split(' ');
      days.push(`${day} ${weekday}`);
    }
    return days;
  }

  getJobStyle(job: Job) {
    const dayIndex = this.days.findIndex((d) => d === job.day) + 2;

    const startHour = job.startTime.getHours();
    const startMinutes = job.startTime.getMinutes();

    const rowStart = (startHour - 6) * 2 + 1 + (startMinutes >= 30 ? 1 : 0);
    const duration =
      (job.endTime.getTime() - job.startTime.getTime()) / (1000 * 60 * 30);

    const backgroundColor = this.jobStatusColors[job.status] || 'white';

    return {
      'grid-column-start': dayIndex.toString(),
      'grid-row-start': (rowStart + 1).toString(),
      'grid-row-end': `span ${Math.ceil(duration)}`,
      'background-color': backgroundColor,
    };
  }

  getJobsForDayAndTime(day: string, timeSlot: string): Job[] {
    return this.jobs.filter(
      (job) => job.day === day && this.isJobDuringTime(job, timeSlot)
    );
  }

  isJobDuringTime(job: Job, timeSlot: string): boolean {
    const jobStartHour = job.startTime.getHours();
    const jobEndHour = job.endTime.getHours();

    let [hour, period] = timeSlot.split(' ');
    let [hours, minutes] = hour.split(':').map((n) => parseInt(n));

    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return jobStartHour <= hours && hours < jobEndHour;
  }

  addNewJob() {
    const randomDay = this.days[Math.floor(Math.random() * this.days.length)];
    const randomHour =
      this.times[Math.floor(Math.random() * this.times.length)];
    const [hour, period] = randomHour.split(' ');
    const randomStartHour = parseInt(hour);
    const randomEndHour = randomStartHour + 1;
    const randomStartMinutes = Math.random() > 0.5 ? 30 : 0;
    const randomEndMinutes = randomStartMinutes === 30 ? 0 : 30;
    const randomStartTime = new Date();
    randomStartTime.setHours(randomStartHour, randomStartMinutes, 0);
    const randomEndTime = new Date();

    randomEndTime.setHours(randomEndHour, randomEndMinutes, 0);

    const statuses = Object.keys(this.jobStatusColors);
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const newJob: Job = {
      title: `Job at ${randomStartHour}:${randomStartMinutes} ${period}`,
      startTime: randomStartTime,
      endTime: randomEndTime,
      day: randomDay,
      status: randomStatus,
    };
    this.jobs.push(newJob);
  }

  toggleSearchInput() {
    this.showSearchInput = !this.showSearchInput;
  }

  goToToday() {
    this.today = new Date();
    this.days = this.getWeekDates(this.today);
    this.updateDateRange();
  }

  goToPreviousWeek() {
    this.today.setDate(this.today.getDate() - 7);
    this.days = this.getWeekDates(this.today);
    this.updateDateRange();
  }

  goToNextWeek() {
    this.today.setDate(this.today.getDate() + 7);
    this.days = this.getWeekDates(this.today);
    this.updateDateRange();
  }

  updateDateRange() {
    const firstDay = this.days[0];
    const lastDay = this.days[this.days.length - 1];
    this.currentDateRange = `${firstDay} - ${lastDay}`;
  }

  isToday(date: string): boolean {
    const [day, _] = date.split(' ');
    const [dayNum, __] = day.split(',');
    const dayNumber = parseInt(dayNum);
    const today = new Date();
    return (
      today.getDate() === dayNumber &&
      this.today.getMonth() === today.getMonth() &&
      this.today.getFullYear() === today.getFullYear()
    );
  }
}
