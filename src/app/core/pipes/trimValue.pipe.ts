import {Pipe, PipeTransform} from '@angular/core';  
@Pipe ({  
  name : 'trimValue'  
})  
export class TrimValuePipe implements PipeTransform {  
  transform(value : string) : string {  
    if(value){
        const length = value.length;
        const trimValue:string = value.substr(0,5)+'...'+value.substr((length-4),4)
        return trimValue;
    } else {
        return '';
    }
  }  
}  