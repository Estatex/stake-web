import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PledgeDashboardComponent } from './pledgeDashboard.component';


describe('PledgeDashboardComponent', () => {
  let component: PledgeDashboardComponent;
  let fixture: ComponentFixture<PledgeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PledgeDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PledgeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
