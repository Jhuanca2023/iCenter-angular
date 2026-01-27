export interface Banner {
    id: string;
    image_url: string;
    title?: string;
    subtitle?: string;
    link_url?: string;
    order_index: number;
    is_active: boolean;
    created_at?: string;
}

export interface Promotion {
    id: string;
    image_url: string;
    title?: string;
    is_active: boolean;
    created_at?: string;
}
