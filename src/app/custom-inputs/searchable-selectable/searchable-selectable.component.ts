import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, SearchbarCustomEvent } from '@ionic/angular';
import { CountryData } from 'src/app/services/user-data.service';
@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  selector: 'app-searchable-selectable',
  templateUrl: './searchable-selectable.component.html',
  styleUrls: ['./searchable-selectable.component.scss'],
})
export class SearchableSelectableComponent implements OnChanges, OnInit {
  @Input() title = 'Select';
  @Input() data: any[];
  @Input() multiple = false;
  @Input() itemTextField = 'name';
  @Input() itemImageField = 'icon';
  @Input() icon = false;
  @Input() selectedData: CountryData[] = [];
  @Output() selectedChanged: EventEmitter<any> = new EventEmitter();

  isOpen = false;
  selected = [];
  filtered = [];

  constructor() { }
  ngOnInit(): void {
      if(this.selectedData.length > 0){
        for(const each of this.selectedData){
          const dataFound = this.data.filter(item => this.leaf(item).includes(each.name));
          this.selected.push(dataFound[0]);
        }
        console.log(this.selected);
        this.selected.forEach(item => {
          item.selected = true;
        });
      }
  }
  ngOnChanges(changes: SimpleChanges): void{
    this.filtered = this.data;
  }
  open() {
    this.isOpen = true;
  }
  cancel() {
    this.isOpen = false;
  }
  select(){
    const selected = this.data.filter((item)=>item.selected);
    this.selected = selected;
    this.selectedChanged.emit(selected);
    this.isOpen = false;
  }
  itemSelected(){
    if(!this.multiple ){
      if(this.selected.length){
        this.selected[0].selected = false;
      }
      this.selected = this.data.filter((item) => item.selected);
      this.selectedChanged.emit(this.selected);
      this.filtered = this.data;
      this.isOpen = false;
    }
  }

  filter(event){
    const filter = event.detail.value.toLowerCase();
    this.filtered = this.data.filter(item => this.leaf(item).toLowerCase().indexOf(filter)>=0);

  }

  leaf = (obj) =>
  this.itemTextField.split('.').reduce((value,el) => value[el],obj);
  leafIcon = (obj) =>
  this.itemImageField.split('.').reduce((value,el) => value[el],obj);
}




