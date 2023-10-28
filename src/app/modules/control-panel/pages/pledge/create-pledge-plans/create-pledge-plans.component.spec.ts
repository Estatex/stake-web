import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePledgePlansComponent } from './create-pledge-plans.component';


describe('CreatePledgePlansComponent', () => {
  let component: CreatePledgePlansComponent;
  let fixture: ComponentFixture<CreatePledgePlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePledgePlansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePledgePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
