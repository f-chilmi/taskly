// task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://mocki.io/v1/e5f26750-17e9-487b-93fe-2d1ff07c3da8';

  constructor(private http: HttpClient) {}

  private tasksSource = new BehaviorSubject<any[]>([]);
  tasks$ = this.tasksSource.asObservable();

  getTasks(): Observable<any[]> {
    return this.http.get<{ response: boolean; data: any[] }>(this.apiUrl).pipe(
      map((res) => res.data || []),
      tap((tasks) => {
        if (this.tasksSource.value.length === 0) {
          this.tasksSource.next(tasks);
        }
      })
    );
  }

  setTasks(tasks: any[]) {
    this.tasksSource.next(tasks);
  }

  updateTask(updatedTask: any) {
    const tasks = this.tasksSource.value;

    tasks.forEach((task, index) => {
      if (task.title === updatedTask.title) tasks[index] = updatedTask;
    });

    this.tasksSource.next([...tasks]);
  }

  addTask(task: any) {
    const currentTasks = this.tasksSource.value;
    const updatedTasks = [task, ...currentTasks];
    this.tasksSource.next(updatedTasks);
  }
}
