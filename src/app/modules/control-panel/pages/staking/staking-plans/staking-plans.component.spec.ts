import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakingPlansComponent } from './staking-plans.component';

describe('StakingPlansComponent', () => {
  let component: StakingPlansComponent;
  let fixture: ComponentFixture<StakingPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakingPlansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StakingPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
