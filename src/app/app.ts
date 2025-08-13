import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';

type Item = { id: number; title: string };

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('observable-basics');

  // 1) Unsere Beispiel-Daten (lokal, bewusst ohne HTTP)
  private readonly items: Item[] = [
    { id: 1, title: 'Apple iPhone' },
    { id: 2, title: 'Banana Bread Cookbook' },
    { id: 3, title: 'Camera Bag' },
    { id: 4, title: 'Desk Lamp' },
    { id: 5, title: 'Electric Kettle' },
    { id: 6, title: 'Fitness Band' },
    { id: 7, title: 'Gaming Mouse' },
    { id: 8, title: 'Headphones' },
    { id: 9, title: 'Instant Camera' },
    { id: 10, title: 'JavaScript Guide' },
  ];

  // 2) FormControl als Observable-Quelle
  searchCtrl = new FormControl('', { nonNullable: true });

  // 3) Pipeline: Eingabe → startWith('') → debounce → distinct → map(filter)
  results$ = this.searchCtrl.valueChanges.pipe(
    startWith(this.searchCtrl.value),
    debounceTime(250),
    distinctUntilChanged(),
    map((q) => q.trim().toLowerCase()),
    map((q) => (!q ? this.items : this.items.filter((it) => it.title.toLowerCase().includes(q))))
  );
}
