import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StakingPoolComponent } from './staking-pool.component';

describe('StakingPoolComponent', () => {
  let component: StakingPoolComponent;
  let fixture: ComponentFixture<StakingPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakingPoolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StakingPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
