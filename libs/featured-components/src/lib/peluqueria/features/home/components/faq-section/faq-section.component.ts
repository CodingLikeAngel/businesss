import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UITitleComponent, CardVariant } from '@negocio/ui-components';

export interface FaqItem {
  title: string;
  content: string;
  category?: string;
  expanded?: boolean;
}

@Component({
  selector: 'lib-faq-section',
  standalone: true,
  imports: [CommonModule, FormsModule, UITitleComponent],
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.scss'],
})
export class FaqSectionComponent implements OnInit {
  @Input() variant: CardVariant = 'default';
  @Input() faqItems: FaqItem[] = [];

  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];
  filteredItems: FaqItem[] = [];
  highlightedIndex = -1;

  ngOnInit() {
    this.extractCategories();
    this.filteredItems = [...this.faqItems];
  }

  extractCategories() {
    const categorySet = new Set<string>();
    this.faqItems.forEach(item => {
      if (item.category) {
        categorySet.add(item.category);
      }
    });
    this.categories = Array.from(categorySet).sort();
  }

  onSearchChange() {
    this.filterItems();
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.filterItems();
  }

  filterItems() {
    let filtered = [...this.faqItems];

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    this.filteredItems = filtered;
  }

  onToggle(index: number, event: Event) {
    const details = event.target as HTMLDetailsElement;
    if (details.open) {
      this.highlightedIndex = index;
      setTimeout(() => {
        this.highlightedIndex = -1;
      }, 2000);
    }
  }
}