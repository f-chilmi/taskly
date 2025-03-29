import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
  readonly developers = ['Alice', 'Bob', 'Charlie'];
  readonly priorityOptions = [
    'Critical',
    'High',
    'Medium',
    'Low',
    'Best Effort',
  ];
  readonly statusOptions = [
    'Ready to start',
    'In Progress',
    'Waiting for review',
    'Pending Deploy',
    'Done',
    'Stuck',
  ];
  readonly typeOptions = ['Feature Enhancements', 'Bug', 'Other'];

  readonly priorityColors: Record<string, string> = {
    Critical: '#B91C1C', // Merah Tua
    High: '#D97706', // Oranye Tua
    Medium: '#EAB308', // Kuning Gelap
    Low: '#15803D', // Hijau Gelap
    'Best Effort': '#1E40AF', // Biru Tua
  };

  readonly statusColors: Record<string, string> = {
    'Ready to start': '#6B7280', // Abu-abu
    'In Progress': '#2563EB', // Biru
    'Waiting for review': '#D97706', // Oranye
    'Pending Deploy': '#7C3AED', // Ungu
    Done: '#047857', // Hijau Tua
    Stuck: '#DC2626', // Merah
  };

  readonly typeColors: Record<string, string> = {
    'Feature Enhancements': '#0284C7', // Biru Terang
    Bug: '#B91C1C', // Merah Tua
    Other: '#525252', // Abu-abu Gelap
  };
}
