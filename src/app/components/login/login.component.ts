import { Component, OnInit } from '@angular/core';
import { MongodbService } from '../../mongodb.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private httpService: MongodbService) {   }
  authAdvisor: string = 'd-none';
  formatedRut: string = '';
  ngOnInit(): void {
  }

  login(username: string, password: string): void {
    this.httpService.getOneUser(username).subscribe(
      (response) => { 
        const parsedResponse: any = {...response};
        const incomingPassword: string = parsedResponse.password;
        (incomingPassword === password)
        ?
          window.location.href = '/tef'
        :
          this.authAdvisor = "d-block"
        setTimeout(()=> this.authAdvisor = "d-none" , 2000)
      },
      (error) => { console.log(error); });
  }

  rutConverter(value: string): string{
        
    let falseCase: any = false;
    let split = value.split("");

    split.includes("-")? split.splice(split.indexOf("-"),1): falseCase= null;
    split.includes(".")? split.splice(split.indexOf("."),1): falseCase= null;
    split.includes(".")? split.splice(split.indexOf("."),1): falseCase= null;
    
    (split.length>=2)?split[split.length-1] = "-" + split[split.length-1]:falseCase= null;

    split.length >5 ? split[split.length-4] = "." + split[split.length-4]: falseCase= null;
    split.length >7 ? split[split.length-7] = "." + split[split.length-7]: falseCase= null;

    value = split.join("")
    return value;
}
formater(rut: string): void{
  this.formatedRut = this.rutConverter(rut);
}

}
