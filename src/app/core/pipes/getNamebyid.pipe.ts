import {Pipe, PipeTransform} from '@angular/core';  
@Pipe ({  
  name : 'getNamebyID'  
})  
export class GetNamebyIDPipe implements PipeTransform {  
  transform(val:number, args:any[]) : string{
    const data = args.find(x => x.id === val);
    if(data){
      return data.name;
    } else {
      return '';
    }
    
  }  
}  