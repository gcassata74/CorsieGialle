import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent implements OnInit {

  @Input() options: any[];
  @Output() onSelect = new EventEmitter<any>();
  @ViewChild('overlay',{static:true}) overlay: ElementRef;

  selectedOption: any;
  filteredOptions:any[]=[];

  constructor() { }

  ngOnInit() {
   
  }


  selectOption(option:any){
    this.selectedOption=option;
    this.overlay.nativeElement.style.display="none";
    this.onSelect.emit(option);
  }

  handleInput(ev: any) {
     
     this.filteredOptions = this.options;
     this.overlay.nativeElement.style.display="block";

      // set val to the value of the searchbar
      const val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() !== '') {
         
          this.filteredOptions = this.options.filter((item) => {
              return (item.name.toLowerCase().startsWith(val.toLowerCase())) && item.emails.length>0;
          });
      } 
      
      
  }

}
