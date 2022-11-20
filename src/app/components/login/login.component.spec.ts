import { LoginComponent } from './login.component';
import { describe, test } from '@jest/globals';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ LoginComponent ]
        }).compileComponents(); 
         fixture = TestBed.createComponent(LoginComponent);
         component = fixture.componentInstance;
    }));
  test('should works login btn', () => {
    expect(component).toBeDefined();
  });
});
