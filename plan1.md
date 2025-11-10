
# Plan: Transition to Firestore Database and ZAR Currency

This plan details the necessary steps to migrate the Blak Whyte Studio Hub application from using static, hard-coded data to a dynamic, live Firestore database. It also covers changing the currency from USD to South African Rand (ZAR).

## 1. Set Up Firebase and Firestore

- **Initialize Firebase:** I will start by setting up the necessary Firebase configuration for your project. This includes creating the Firebase client configuration and the necessary providers to make Firebase services available throughout the application.
- **Define Data Models:** I will create a `backend.json` file to formally define the data structures for `Services`, `Products`, `Bookings`, and `Users`. This will serve as the blueprint for our Firestore database collections.
- **Implement Firestore Collections:** Based on the defined models, I will structure the Firestore database with the following collections:
  - `/services`
  - `/products`
  - `/users`
  - `/bookings`
  - `/gallery`

## 2. Replace Mock Data with Firestore Data Hooks

I will remove the static data from `src/lib/data.ts` and replace all data fetching logic with live data from Firestore.

- **Services:** I will update the `services`, `home`, and `booking` pages to fetch service information directly from the `/services` collection in Firestore.
- **Products:** The `products` page will be updated to display items from the `/products` collection.
- **Bookings & Users:** The admin dashboard, particularly the `/bw-admin/bookings` page, will be modified to fetch and display real-time booking and user information from the `/bookings` and `/users` collections.
- **Gallery:** The gallery page will load its images from the `/gallery` collection.

## 3. Implement Booking Creation

- I will modify the booking form in `/book` to create new documents in the `/bookings` collection in Firestore when a user schedules an appointment. This will also involve creating a new user document in the `/users` collection if they are a first-time client.

## 4. Update Currency to ZAR

- I will go through all components where prices and currency are displayed and change them from USD ($) to South African Rand (R). This includes:
  - The bookings data table in the admin section.
  - The invoice template.
  - Service and product listings on all public-facing pages.
  - The revenue statistics on the admin dashboard.

This systematic approach will ensure a smooth transition to a fully functional, database-driven application.
