import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PledgeUsersComponent } from './users.component';


describe('PledgeUsersComponent', () => {
  let component: PledgeUsersComponent;
  let fixture: ComponentFixture<PledgeUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PledgeUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PledgeUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
