export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface Booking {
  id: string;
  clientId: string;
  serviceId: string;
  date: string;
  time: string;
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
    imageUrl: string;
    description: string;
}
