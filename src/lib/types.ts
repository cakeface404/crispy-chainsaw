export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  imageId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  bookingDate: Date;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  paymentStatus: 'Paid' | 'Unpaid';
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface GalleryImage {
    id: string;
    imageId: string;
}
