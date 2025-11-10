import type { Service, Product, Booking, GalleryImage, User } from '@/lib/types';
import { add } from 'date-fns';

export const services: Service[] = [
  {
    id: 'ser_001',
    name: 'Luxury Manicure',
    description: 'A comprehensive treatment including nail shaping, cuticle care, a relaxing hand massage, and a polish of your choice.',
    price: 50,
    duration: 60,
    category: 'Nails',
    imageId: 'service_manicure'
  },
  {
    id: 'ser_002',
    name: 'Signature Pedicure',
    description: 'Relax and rejuvenate with our signature pedicure, featuring a warm soak, exfoliation, massage, and perfect polish.',
    price: 75,
    duration: 75,
    category: 'Nails',
    imageId: 'service_pedicure'
  },
  {
    id: 'ser_003',
    name: 'Deep Cleansing Facial',
    description: 'A purifying facial treatment that cleanses pores, exfoliates dead skin cells, and treats common skin concerns.',
    price: 120,
    duration: 90,
    category: 'Skincare',
    imageId: 'service_facial'
  },
  {
id: 'ser_004',
    name: 'Balayage & Style',
    description: 'Achieve a natural, sun-kissed look with our expert balayage technique, finished with a professional styling.',
    price: 250,
    duration: 180,
    category: 'Hair',
    imageId: 'service_hair'
  },
  {
    id: 'ser_005',
    name: 'Professional Makeup',
    description: 'Perfect for special occasions, our professional makeup artists will create a stunning look tailored to you.',
    price: 100,
    duration: 60,
    category: 'Makeup',
    imageId: 'service_makeup'
  },
  {
    id: 'ser_006',
    name: 'Relaxation Massage',
    description: 'Unwind with a full-body massage designed to soothe muscles, improve circulation, and promote deep relaxation.',
    price: 110,
    duration: 60,
    category: 'Wellness',
    imageId: 'service_massage'
  }
];

export const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Hydrating Face Cream',
    description: 'A rich, nourishing cream that provides long-lasting hydration and leaves skin feeling soft and supple.',
    price: 45,
    imageId: 'product_cream'
  },
  {
    id: 'prod_002',
    name: 'Vitamin C Serum',
    description: 'Brighten and even out your skin tone with this powerful antioxidant serum, protecting against environmental damage.',
    price: 60,
    imageId: 'product_serum'
  },
  {
    id: 'prod_003',
    name: 'Nourishing Hair Oil',
    description: 'A lightweight yet deeply conditioning oil to tame frizz, add shine, and protect hair from heat damage.',
    price: 35,
    imageId: 'product_oil'
  },
  {
    id: 'prod_004',
    name: 'Cuticle Care Pen',
    description: 'An easy-to-use pen that nourishes and moisturizes cuticles, promoting healthy nail growth.',
    price: 20,
    imageId: 'product_cuticle'
  }
];

const today = new Date();
export const bookings: Booking[] = [
  {
    id: 'book_001',
    userId: 'user_001',
    serviceId: 'ser_001',
    bookingDate: add(today, { days: 3, hours: 2 }),
    status: 'Confirmed',
    paymentStatus: 'Paid',
  },
  {
    id: 'book_002',
    userId: 'user_002',
    serviceId: 'ser_003',
    bookingDate: add(today, { days: 5, hours: 4 }),
    status: 'Pending',
    paymentStatus: 'Unpaid',
  },
  {
    id: 'book_003',
    userId: 'user_003',
    serviceId: 'ser_004',
    bookingDate: add(today, { days: -10, hours: 6 }),
    status: 'Completed',
    paymentStatus: 'Paid',
  },
  {
    id: 'book_004',
    userId: 'user_004',
    serviceId: 'ser_002',
    bookingDate: add(today, { days: -20, hours: 3 }),
    status: 'Completed',
    paymentStatus: 'Paid',
  },
  {
    id: 'book_005',
    userId: 'user_001',
    serviceId: 'ser_005',
    bookingDate: add(today, { days: 7, hours: 5 }),
    status: 'Confirmed',
    paymentStatus: 'Unpaid',
  },
    {
    id: 'book_006',
    userId: 'user_005',
    serviceId: 'ser_006',
    bookingDate: add(today, { days: -30, hours: 1 }),
    status: 'Completed',
    paymentStatus: 'Paid',
  },
];

export const users: User[] = [
    {
        id: 'user_001',
        name: 'Alice Johnson',
        email: 'alice.j@example.com',
        phone: '+1-202-555-0103'
    },
    {
        id: 'user_002',
        name: 'Ben Carter',
        email: 'ben.c@example.com',
        phone: '+1-202-555-0156'
    },
    {
        id: 'user_003',
        name: 'Chloe Davis',
        email: 'chloe.d@example.com',
        phone: '+1-202-555-0189'
    },
    {
        id: 'user_004',
        name: 'David Evans',
        email: 'david.e@example.com',
        phone: '+1-202-555-0121'
    },
    {
        id: 'user_005',
        name: 'Emily Frank',
        email: 'emily.f@example.com',
        phone: '+1-202-555-0145'
    }
];

export const galleryImages: GalleryImage[] = [
  { id: 'gallery_1', imageId: 'gallery_1_img' },
  { id: 'gallery_2', imageId: 'gallery_2_img' },
  { id: 'gallery_3', imageId: 'gallery_3_img' },
  { id: 'gallery_4', imageId: 'gallery_4_img' },
  { id: 'gallery_5', imageId: 'gallery_5_img' },
  { id: 'gallery_6', imageId: 'gallery_6_img' },
  { id: 'gallery_7', imageId: 'gallery_7_img' },
  { id: 'gallery_8', imageId: 'gallery_8_img' },
];
