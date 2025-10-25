import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-network-logo',
  templateUrl: './network-logo.component.html',
  styleUrls: ['./network-logo.component.scss']
})
export class NetworkLogoComponent {
  @Input() size: number = 120;
  @Input() showText: boolean = false;
  @Input() colorScheme: 'default' | 'white' | 'dark' = 'default';
  @Input() animated: boolean = true; // New input for animation control

  get colors() {
    const schemes = {
      default: {
        v: '#3B82F6',
        d: '#10B981',
        s: '#8B5CF6',
        center: '#1F2937',
        lines: '#3B82F6',
        dots: '#94A3B8',
        text: '#1F2937'
      },
      white: {
        v: '#FFFFFF',
        d: '#F3F4F6',
        s: '#E5E7EB',
        center: '#FFFFFF',
        lines: '#FFFFFF',
        dots: '#D1D5DB',
        text: '#FFFFFF'
      },
      dark: {
        v: '#1F2937',
        d: '#374151',
        s: '#4B5563',
        center: '#111827',
        lines: '#374151',
        dots: '#6B7280',
        text: '#1F2937'
      }
    };
    return schemes[this.colorScheme];
  }
}
