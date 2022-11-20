import { Component, ViewChild, OnInit } from '@angular/core';
import { ServiceBanksService } from '../../service-banks.service';
import { MongodbService } from '../../mongodb.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-tef',
  templateUrl: './tef.component.html',
  styleUrls: ['./tef.component.css']
})
export class TefComponent implements OnInit {
  constructor(private bankService: ServiceBanksService, private mongoService: MongodbService) { }
  @ViewChild('rut') rutName: any; 
  @ViewChild('fullName') fullNameName: any; 
  @ViewChild('email') emailName: any; 
  @ViewChild('phone') phoneName: any; 
  @ViewChild('account') accountName: any; 
  formatedRut: string = '';
  rutType: string = 'Rut';
  panelOpenState: boolean = false;
  banks: any;
  amount: string = (0).toLocaleString("es-CL", {style:"currency", currency:"CLP"});
  destinations: any = [];
  registeredDestinations: any = [];
  filteredTefs: any = [];
  allIncomingTefs: any = []
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  SelectselectedItm: string = ''
  filterInputValue: string = ''
  /*
  COMENTARIO: Tome como desición práctica ocupar este setInterval y sessionStorage,
  Ya que para el contexto del examen la información no es sensible y debiera durar sólo por la sesión.
  No usaría esta solución para producción o un desarrollo real. Intené implementar Store ngrx o retornar 
  valor de los observers. Pero me di cuenta de que mmi curva de aprendizaje no me permitiría
  entregar a tiempo.
  */
  sessionStorageFakyObserver = () => setInterval(()=>{ 
    try{
      this.destinations =  JSON.parse(sessionStorage.getItem('destinations') ?? '');
    } catch(err) {}
    try{
      this.allIncomingTefs =  JSON.parse(sessionStorage.getItem('tefs') ?? '');
      if(this.filterInputValue.length === 0){this.filteredTefs =  this.markDuplicates(JSON.parse(sessionStorage.getItem('tefs') ?? ''));}
    } catch(err) {}
  }, 1000)

  ngOnDestroy(){
    clearInterval(this.sessionStorageFakyObserver())
  }
  
  markDuplicates(response: any){

    const overAmountDetector = response.map((i: any)=>
            (i.Monto > 100000)
            ?
              {...i, overAmount: true}
            : 
              {...i, overAmount: false}
          );

    const duplicateDetector: any = [];
    overAmountDetector.forEach((i: any)=> {
      duplicateDetector.push(`${i.Monto}/${i.Cuenta}/${i.Destino}`)
    })
    duplicateDetector.forEach((i: any, ind: number)=>{
      duplicateDetector.indexOf(i) !== ind && overAmountDetector[ind].overAmount
      ?
        overAmountDetector[ind] = {
          ...overAmountDetector[ind],
          fraud: 'bg-danger'
        }
      :
        overAmountDetector[ind] = {
          ...overAmountDetector[ind],
          fraud: ''
        }
      }
    )
    return overAmountDetector;

  }

  ngOnInit(): void {
    this.sessionStorageFakyObserver();
    this.bankService.getBanks().subscribe(
      (response) => { 
        this.banks = {...response}; 
        this.banks = this.banks.Banco;
      },

      (error) => { console.log(error); });
    
      this.mongoService.getAllTefs().subscribe(
      (response: any) => { 
        const fraudDetector = this.markDuplicates(response);
        console.log('>>>>>>', fraudDetector)
        this.filteredTefs = fraudDetector; 
        this.allIncomingTefs = fraudDetector;
      },
      (error) => { console.log(error); });

      this.mongoService.getAllDestinations().subscribe(
        (response) => { 
          this.destinations = response; 
        },
        (error) => { console.log(error); });
  }
  filter(event: Event): void{
    const name: string = (event.target as HTMLInputElement).value;
    this.filterInputValue = name
    name.length >=3 
    ?
      this.filteredTefs = this.filteredTefs.filter((i: any)=>
        i.Nombre.toLowerCase().includes(name.toLowerCase())
      )
    :
    this.filteredTefs = this.allIncomingTefs;
  }
  mountUpdate(event: any): void{
    this.amount = parseInt(event.value).toLocaleString("es-CL", {style:"currency", currency:"CLP"});
  }
  register(Rut: string, Nombre: string, Correo: string, Cuenta: string, Destino: string): void{
    this.rutName.nativeElement.value = '';
    this.fullNameName.nativeElement.value = '';
    this.emailName.nativeElement.value = '';
    this.phoneName.nativeElement.value = '';
    this.accountName.nativeElement.value = '';
    this.SelectselectedItm = '';
    const body: object = {Rut, Nombre, Correo, Cuenta, Destino}
    const resp = this.mongoService.insertDestination(body);
    resp.subscribe(
      {
        error: (e: any) => {},
        complete: () => {},
        next: (val) => {}
    })
  }

  transfer$$$(DestinoName: any): void{
    const destinationObj = this.destinations.filter((i: any)=>
          i.Nombre === DestinoName
    )
    const {Rut, Nombre, Correo, Cuenta, Destino} = destinationObj[0];
    const body: object = {Rut, Nombre, Correo, Cuenta, Destino, Monto: parseInt(this.amount.replace('$','').replace('.',''))}
    const resp = this.mongoService.insertTef(body);
    resp.subscribe(
      {
        error: (e: any) => {},
        complete: () => {}
    })
    this.amount = (0).toLocaleString("es-CL", {style:"currency", currency:"CLP"});
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
    const newRut = this.rutConverter(rut);
    this.formatedRut = newRut;
    this.corporationIdentifier(newRut)
  }
  
  corporationIdentifier(rut: string): any{
    const splited = rut.split('.')
    parseInt(splited[0]) >= 50 
    ?
      this.rutType = 'Rol empresa'
    :
      this.rutType = 'Rut';
  }
}
