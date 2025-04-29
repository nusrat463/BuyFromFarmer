import { Component } from '@angular/core';
import {CategoryService} from "../../../services/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ImageUploadService} from "../../../services/image-upload.service";
import {Location} from "@angular/common";
import {FarmerService} from "../../../services/farmer.service";

@Component({
  selector: 'app-add-farmer',
  templateUrl: './add-farmer.component.html',
  styleUrls: ['./add-farmer.component.css']
})
export class AddFarmerComponent {
  constructor(private farmerService: FarmerService, private router: Router,private route: ActivatedRoute,
              private snackBar: MatSnackBar,private fb: FormBuilder,private http: HttpClient,
              private imageUploadService: ImageUploadService,private location: Location) {}

  id = null;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  previewUrl: string | ArrayBuffer | null = null;

  farmerForm = this.fb.group({
    id: this.fb.control<number | null>(null),
    name: [''],
    imageUrl: ['']
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.farmerService.getFarmerById(this.id).subscribe(data => {
          console.log('data---',data);
          this.farmerForm.patchValue({
            id: data.id,
            name: data.name,
            imageUrl: data.imageUrl
          });
          this.previewUrl = data.imageUrl;
          this.selectedFileName = this.extractFileName(data.imageUrl);
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
    if (this.farmerForm.invalid) return;

    const handleSubmit = () => {
      const formData = this.farmerForm.value;
      if (this.id == null) {
        this.farmerService.createNewFarmer(formData).subscribe({
          next: () => {
            this.snackBar.open('Added successfully!');
            this.farmerForm.reset();
            this.router.navigate(['/farmer-list']);
          },
          error: () => {
            this.snackBar.open('Failed to add.');
          }
        });
      } else {
        this.farmerService.updateFarmer(formData).subscribe({
          next: () => {
            this.snackBar.open('Updated successfully!');
            this.farmerForm.reset();
            this.router.navigate(['/farmer-list']);
          },
          error: () => {
            this.snackBar.open('Failed to update.');
          }
        });
      }
    };

    if (this.selectedFile) {
      console.log('this.selectedFile---',this.selectedFile);
      this.imageUploadService.uploadImage(this.selectedFile).subscribe({
        next: (imageUrl: string) => {
          console.log('imageUrl---',imageUrl);
          this.farmerForm.patchValue({ imageUrl: imageUrl });
          console.log('Image upload---');
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

