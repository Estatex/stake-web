import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PledgePlansComponent } from './pledge-plans.component';


describe('PledgePlansComponent', () => {
  let component: PledgePlansComponent;
  let fixture: ComponentFixture<PledgePlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PledgePlansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PledgePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
