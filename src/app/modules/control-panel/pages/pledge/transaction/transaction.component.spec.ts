import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PledgeTransactionComponent } from './transaction.component';


describe('PledgeTransactionComponent', () => {
  let component: PledgeTransactionComponent;
  let fixture: ComponentFixture<PledgeTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PledgeTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PledgeTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
