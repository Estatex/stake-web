import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PledgeWithdrawTransactionComponent } from './withdraw-transaction.component';


describe('PledgeWithdrawTransactionComponent', () => {
  let component: PledgeWithdrawTransactionComponent;
  let fixture: ComponentFixture<PledgeWithdrawTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PledgeWithdrawTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PledgeWithdrawTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
