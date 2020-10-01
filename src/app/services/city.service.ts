import { Injectable } from '@angular/core';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { comuni } from '../data/comuni'; 

@Injectable()
export class CityService implements AutoCompleteService{

  constructor() { }
  labelAttribute: string='nome';
  //formValueAttribute: any ='code';


  getResults(keyword: string) {
     
    if (!keyword) { return false; }

    return comuni.filter(
      (item) => {
         return item.nome.toLowerCase().startsWith(
            keyword.toLowerCase()
         );
      }
   );

  }


}
