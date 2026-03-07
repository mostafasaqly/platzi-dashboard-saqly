import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadPage } from './file-upload-page';

describe('FileUploadPage', () => {
  let component: FileUploadPage;
  let fixture: ComponentFixture<FileUploadPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploadPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
