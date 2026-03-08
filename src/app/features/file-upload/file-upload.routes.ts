import { Routes } from '@angular/router';
import { FileUploadPage } from './pages/file-upload-page/file-upload-page';

export default [
  {
    path: '',
    component: FileUploadPage,
    title: 'File Upload'
  },
] satisfies Routes;
