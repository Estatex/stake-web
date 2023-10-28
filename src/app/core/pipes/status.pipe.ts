import {Pipe, PipeTransform} from '@angular/core';  
@Pipe ({  
  name : 'status'  
})  
export class StatusPipe implements PipeTransform {  
  transform(val : number) : boolean {  
    return val === 1;  
  }  
}  