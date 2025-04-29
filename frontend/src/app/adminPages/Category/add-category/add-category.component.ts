import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CategoryService} from "../../../services/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {ImageUploadService} from "../../../services/image-upload.service";
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {

  constructor(private categoryService: CategoryService, private router: Router,private route: ActivatedRoute,
              private snackBar: MatSnackBar,private fb: FormBuilder,private http: HttpClient,
              private imageUploadService: ImageUploadService,private location: Location) {}

  id = null;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  previewUrl: string | ArrayBuffer | null = null;

  categoryForm = this.fb.group({
    id: this.fb.control<number | null>(null),
    name: [''],
    image: ['']
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.categoryService.getCategoryById(this.id).subscribe(data => {
          console.log('data---',data);
          this.categoryForm.patchValue({
            id: data.id,
            name: data.name,
            image: data.image
          });
          this.previewUrl = data.image;
          this.selectedFileName = this.extractFileName(data.image);
        })
      }
    });
  }

  extractFileName(url: string): string {
    if (!url) return '';
    return url.substring(url.lastIndexOf('/') + 1);
  }


  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.length) {
      this.selectedFile = fileInput.files[0];
      this.selectedFileName = this.selectedFile.name;

      // Generate preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }


  async submit() {
    if (this.categoryForm.invalid) return;

    const handleSubmit = () => {
      const formData = this.categoryForm.value;
      if (this.id == null) {
        this.categoryService.createNewCategory(formData).subscribe({
          next: () => {
            this.snackBar.open('Category added successfully!');
            this.categoryForm.reset();
            this.router.navigate(['/category-list']);
          },
          error: () => {
            this.snackBar.open('Failed to add category.');
          }
        });
      } else {
        this.categoryService.updateCategory(formData).subscribe({
          next: () => {
            this.snackBar.open('Updated successfully!');
            this.categoryForm.reset();
            this.router.navigate(['/category-list']);
          },
          error: () => {
            this.snackBar.open('Failed to update.');
          }
        });
      }
    };

    if (this.selectedFile) {
      this.imageUploadService.uploadImage(this.selectedFile).subscribe({
        next: (imageUrl: string) => {
          this.categoryForm.patchValue({ image: imageUrl });
          handleSubmit();
        },
        error: () => {
          this.snackBar.open('Image upload failed.');
        }
      });
    } else {
      // No new file selected — just use existing form value
      handleSubmit();
    }
  }


  goBack(): void {
    this.location.back();
  }
}
