import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustNotOverlap(startDate: string, startTime: string, endDate: string, endTime:string) {
    return (formGroup: FormGroup) => {

          const _startDate = formGroup.controls[startDate];
          const _startTime = formGroup.controls[startTime];
          const _endDate = formGroup.controls[endDate];
          const _endTime = formGroup.controls[endTime];

        _endTime.setErrors(null);
        _endDate.setErrors(null);

          const date1 = new Date(_startDate.value).setHours(0,0,0,0);
          const date2 = new Date(_endDate.value).setHours(0,0,0,0);

        if(date1 === date2 && new Date(_endTime.value) < new Date(_startTime.value) ){
            _endTime.setErrors({overlaptime:true})
        } else if (new Date(_endDate.value) < new Date(_startDate.value)){
            _endDate.setErrors({overlapdate:true})
        }

     }
}