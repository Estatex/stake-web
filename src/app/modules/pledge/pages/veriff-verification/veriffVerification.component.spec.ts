import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VeriffVerificationComponent } from './veriffVerification.component';


describe('VeriffVerificationComponent', () => {
  let component: VeriffVerificationComponent;
  let fixture: ComponentFixture<VeriffVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VeriffVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeriffVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
