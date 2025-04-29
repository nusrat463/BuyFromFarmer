import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChild,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-custom-searchable-dropdown',
  templateUrl: './custom-searchable-dropdown.component.html',
  styleUrls: ['./custom-searchable-dropdown.component.css']
})
export class CustomSearchableDropdownComponent {

  @Input() options: any[] = [];
  @Input() displayKey: string = 'name';
  @Input() placeholder: string = '';
  @Output() selectedOption = new EventEmitter<any>();

  searchText: string = '';
  filteredOptions: any[] = [];
  isDropdownOpen: boolean = false;

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.filteredOptions = this.options;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.filteredOptions = this.options;
    }
  }

  onSearchChange() {
    this.filteredOptions = this.options.filter(option =>
      option[this.displayKey].toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.isDropdownOpen = this.filteredOptions.length > 0;
  }

  selectOption(option: any) {
    this.selectedOption.emit(option);
    this.searchText = option[this.displayKey];
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
