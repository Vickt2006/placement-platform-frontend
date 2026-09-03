import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCompanies } from './admin-companies';

describe('AdminCompanies', () => {
  let component: AdminCompanies;
  let fixture: ComponentFixture<AdminCompanies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCompanies],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCompanies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
