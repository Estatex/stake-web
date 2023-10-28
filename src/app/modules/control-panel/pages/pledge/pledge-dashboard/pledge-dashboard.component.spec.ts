import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PledgeAdminDashboardComponent } from './pledge-dashboard.component';


describe('PledgeAdminDashboardComponent', () => {
  let component: PledgeAdminDashboardComponent;
  let fixture: ComponentFixture<PledgeAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PledgeAdminDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PledgeAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
