import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeModuloComponent } from './home-modulo.component';

describe('HomeModuloComponent', () => {
  let component: HomeModuloComponent;
  let fixture: ComponentFixture<HomeModuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeModuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
