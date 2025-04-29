import { Component } from '@angular/core';
import {FarmerService} from "../../../services/farmer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ImageUploadService} from "../../../services/image-upload.service";
import {Location} from "@angular/common";
import {ProductService} from "../../../services/product.service";
import {Category, CategoryService} from "../../../services/category.service";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  constructor(private productService: ProductService, private router: Router,private route: ActivatedRoute,
              private snackBar: MatSnackBar,private fb: FormBuilder,private http: HttpClient,
              private imageUploadService: ImageUploadService,private location: Location,
              private categoryService: CategoryService) {}

  id = null;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  previewUrl: string | ArrayBuffer | null = null;
  categories: Category[] = [];

  productForm = this.fb.group({
    id: this.fb.control<number | null>(null),
    name: [''],
    image: [''],
    price: this.fb.control<number | null>(null),
    unit: [''],
    category: this.fb.control<any>(null)
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.productService.getProductById(this.id).subscribe(data => {
          console.log('data---',data);
          this.productForm.patchValue({
            id: data.id,
            name: data.name,
            image: data.image,
            price: data.price,
            unit: data.unit,
            category: data.category
          });
          this.previewUrl = data.image;
          this.selectedFileName = this.extractFileName(data.image);
        })
      }
    });
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
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
    if (this.productForm.invalid) return;

    const handleSubmit = () => {
      const formData = this.productForm.value;
      console.log('data save---',formData);
      if (this.id == null) {
        this.productService.createNewProduct(formData).subscribe({
          next: () => {
            this.snackBar.open('Added successfully!');
            this.productForm.reset();
            this.router.navigate(['/product-list']);
          },
          error: () => {
            this.snackBar.open('Failed to add.');
          }
        });
      } else {
        this.productService.updateProduct(formData).subscribe({
          next: () => {
            this.snackBar.open('Updated successfully!');
            this.productForm.reset();
            this.router.navigate(['/product-list']);
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
          this.productForm.patchValue({ image: imageUrl });
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


