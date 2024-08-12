import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridComponent } from './grid.component';
import { DialogService } from '../../services/dialog.service';
import { LoaderComponent } from '../loader/loader.component';
import { of } from 'rxjs';
import { DogBreed } from '../../models/dog-breed.model';
import { Paginator } from '../../models/paginator.model';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        MatDialogModule,
        GridComponent, 
        LoaderComponent
      ],
      providers: [
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    component.dataSource = [
      { id: 1, name: 'Bulldog', reference_image_id: 'bulldog', life_span: '8-10 years', temperament: 'Docile', height: { metric: '31-40' }, weight: { metric: '18-23' }, image: 'bulldog.jpg' }
    ] as DogBreed[];
    component.paginator = { page: 0, limit: 5, total: 1 } as Paginator;
    component.loading = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the dog data in the table', () => {
    fixture.detectChanges(); 
  
    const compiled = fixture.nativeElement;
  
    expect(compiled.querySelector('table')).toBeTruthy();
  
    const rows = compiled.querySelectorAll('tbody tr');
    let found = false;
  
    rows.forEach((row: any) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell: any) => {
        if (cell.textContent?.trim() === 'Bulldog') {
          found = true;
        }
      });
    });
  
    expect(found).toBe(true); 
  });

  it('should handle paginator change event', () => {
    spyOn(component.pageChange, 'emit');
    const paginator = fixture.nativeElement.querySelector('mat-paginator');
    paginator.dispatchEvent(new Event('page'));
    fixture.detectChanges();
    expect(component.pageChange.emit).toHaveBeenCalled();
  });

  it('should open dialog on row click', () => {
    const row = fixture.nativeElement.querySelector('tbody tr');
    row.click();
    fixture.detectChanges();
    expect(dialogServiceSpy.open).toHaveBeenCalled();
  });


  it('should show loader when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const loader = fixture.nativeElement.querySelector('app-loader');
    expect(loader).toBeTruthy();
  });
});
