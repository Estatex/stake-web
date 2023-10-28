import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PledgeHomeComponent } from './pledgeHome.component';


describe('PledgeHomeComponent', () => {
  let component: PledgeHomeComponent;
  let fixture: ComponentFixture<PledgeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PledgeHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PledgeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
