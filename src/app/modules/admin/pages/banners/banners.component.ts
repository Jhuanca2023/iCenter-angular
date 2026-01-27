import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BannersService } from '@core/services/banners.service';
import { StorageService } from '@core/services/storage.service';
import { Banner, Promotion } from '@core/interfaces';
import { BreadcrumbsComponent, BreadcrumbItem } from '@shared/components/breadcrumbs/breadcrumbs.component';

@Component({
    selector: 'app-admin-banners',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbsComponent],
    templateUrl: './banners.component.html',
    styleUrl: './banners.component.css'
})
export class BannersComponent implements OnInit {
    banners: Banner[] = [];
    promotions: Promotion[] = [];
    isLoading = false;
    isSaving = false;
    error: string | null = null;

    bannerForm: FormGroup;
    promoForm: FormGroup;

    showBannerModal = false;
    showPromoModal = false;
    editingBanner: Banner | null = null;
    editingPromo: Promotion | null = null;

    selectedFile: File | null = null;
    previewUrl: string | null = null;

    breadcrumbs: BreadcrumbItem[] = [
        { label: 'E-Commerce', route: '/admin' },
        { label: 'Banners y Publicidad' }
    ];

    constructor(
        private fb: FormBuilder,
        private bannersService: BannersService,
        private storageService: StorageService
    ) {
        this.bannerForm = this.fb.group({
            title: [''],
            subtitle: [''],
            link_url: [''],
            order_index: [0, [Validators.required, Validators.min(0)]],
            is_active: [true]
        });

        this.promoForm = this.fb.group({
            title: [''],
            is_active: [false]
        });
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.isLoading = true;
        this.bannersService.getAllAdmin().subscribe({
            next: (banners) => {
                this.banners = banners;
                this.loadPromotions();
            },
            error: (err) => {
                console.error(err);
                this.error = 'Error al cargar los banners';
                this.isLoading = false;
            }
        });
    }

    loadPromotions(): void {
        this.bannersService.getAllPromotionsAdmin().subscribe({
            next: (promos) => {
                this.promotions = promos;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = 'Error al cargar las promociones';
                this.isLoading = false;
            }
        });
    }

    // Banner Actions
    openBannerModal(banner?: Banner): void {
        this.editingBanner = banner || null;
        this.selectedFile = null;
        this.previewUrl = banner?.image_url || null;

        if (banner) {
            this.bannerForm.patchValue({
                title: banner.title,
                subtitle: banner.subtitle,
                link_url: banner.link_url,
                order_index: banner.order_index,
                is_active: banner.is_active
            });
        } else {
            this.bannerForm.reset({ order_index: 0, is_active: true });
        }
        this.showBannerModal = true;
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e: any) => this.previewUrl = e.target.result;
            reader.readAsDataURL(file);
        }
    }

    saveBanner(): void {
        if (this.bannerForm.invalid || (!this.selectedFile && !this.editingBanner)) return;

        this.isSaving = true;
        const formValue = this.bannerForm.value;

        if (this.selectedFile) {
            const fileName = `${Date.now()}_${this.selectedFile.name.replace(/\s/g, '_')}`;
            this.storageService.uploadImage('banners', this.selectedFile, `home/${fileName}`).subscribe({
                next: (url) => this.processSaveBanner(url, formValue),
                error: (err) => {
                    console.error(err);
                    this.error = 'Error al subir la imagen';
                    this.isSaving = false;
                }
            });
        } else if (this.editingBanner) {
            this.processSaveBanner(this.editingBanner.image_url, formValue);
        }
    }

    private processSaveBanner(imageUrl: string, formValue: any): void {
        const bannerData = { ...formValue, image_url: imageUrl };

        const obs = this.editingBanner
            ? this.bannersService.update(this.editingBanner.id, bannerData)
            : this.bannersService.create(bannerData);

        obs.subscribe({
            next: () => {
                this.showBannerModal = false;
                this.isSaving = false;
                this.loadData();
            },
            error: (err) => {
                console.error(err);
                this.error = 'Error al guardar el banner';
                this.isSaving = false;
            }
        });
    }

    deleteBanner(id: string): void {
        if (confirm('¿Estás seguro de eliminar este banner?')) {
            this.bannersService.delete(id).subscribe(() => this.loadData());
        }
    }

    // Promotion Actions
    openPromoModal(promo?: Promotion): void {
        this.editingPromo = promo || null;
        this.selectedFile = null;
        this.previewUrl = promo?.image_url || null;

        if (promo) {
            this.promoForm.patchValue({
                title: promo.title,
                is_active: promo.is_active
            });
        } else {
            this.promoForm.reset({ is_active: false });
        }
        this.showPromoModal = true;
    }

    savePromo(): void {
        if (this.promoForm.invalid || (!this.selectedFile && !this.editingPromo)) return;

        this.isSaving = true;
        const formValue = this.promoForm.value;

        if (this.selectedFile) {
            const fileName = `${Date.now()}_${this.selectedFile.name.replace(/\s/g, '_')}`;
            this.storageService.uploadImage('banners', this.selectedFile, `promos/${fileName}`).subscribe({
                next: (url) => this.processSavePromo(url, formValue),
                error: (err) => {
                    console.error(err);
                    this.error = 'Error al subir la imagen';
                    this.isSaving = false;
                }
            });
        } else if (this.editingPromo) {
            this.processSavePromo(this.editingPromo.image_url, formValue);
        }
    }

    private processSavePromo(imageUrl: string, formValue: any): void {
        const promoData = { ...formValue, image_url: imageUrl };

        const obs = this.editingPromo
            ? this.bannersService.updatePromotion(this.editingPromo.id, promoData)
            : this.bannersService.createPromotion(promoData);

        obs.subscribe({
            next: () => {
                this.showPromoModal = false;
                this.isSaving = false;
                this.loadPromotions();
            },
            error: (err) => {
                console.error(err);
                this.error = 'Error al guardar la promoción';
                this.isSaving = false;
            }
        });
    }

    deletePromo(id: string): void {
        if (confirm('¿Estás seguro de eliminar esta promoción?')) {
            this.bannersService.deletePromotion(id).subscribe(() => this.loadPromotions());
        }
    }
}
