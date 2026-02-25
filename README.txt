
Project Name:             Rent-a-Car Management System


Web-Based Project (HTML, CSS, Bootstrap, JavaScript)

Project Overview

The Rent-a-Car Management System is a web-based application that allows users to rent cars online. The system supports three roles:

1_Admin
2_Agent
3_Customer(User)

The project is built using:

1_HTML
2_CSS
3_Bootstrap 5
4_JavaScript 
5_LocalStorage (for data persistence)

No backend or database server is used. All data is stored in the browser using LocalStorage.

Project Objectives

1 Allow customers to browse and book cars.
2 Allow agents to manage their cars and approve/reject bookings.
3 Allow admin to manage users, cars, and bookings.
4 Prevent double booking of cars.
5 Maintain role-based access control.

User Roles & Flow
1_Admin Flow

Admin Responsibilities:

1 Login as admin.
2 View dashboard statistics.
3 Approve or reject new users.
4 View all cars in the system.
5 View all bookings.
6 Reset all system data (if required).

Flow:

1. Admin logs in.
2. Dashboard shows:

   * Total users
   * Total cars
   * Total bookings
3. Admin manages users and bookings.



2_Agent Flow

Agent Responsibilities:

1 Add new cars.
2 Edit or delete cars.
3 View booking requests.
4 Approve or reject booking requests.

Flow:

1. Agent logs in.
2. Dashboard shows:

   * My Cars
   * Total Bookings
   * Pending Requests
3. Agent adds cars with pricing:

   * Per Hour
   * Per Day
   * Per Week
   * Per Month
4. Customers send booking requests.
5. Agent reviews and:

   * Approves
   * Rejects

If approved:

* Booking status becomes "approved".
* System prevents overlapping bookings.


3_Customer(User) Flow

User Responsibilities:

1 Browse available cars.
2 Select car for rent
3 Register and login.
4 Select rental duration.
5 Submit booking request.
6 View booking history.

Flow:

1. Selects a car.
2. User registers.
3. Logs in.
4. Chooses:

   * Start Date
   * End Date
   * Duration Type
5. System calculates total price automatically.
6. Booking status becomes "pending".
7. Agent approves/rejects.

Data Management

All data is stored in browser LocalStorage:

* users
* cars
* bookings
* currentUser

Functions used:

* getUsers()
* getCars()
* getBookings()
* saveUsers()
* saveCars()
* saveBookings()
* initializeData()
* resetAllData()

Booking Logic

Before creating a booking:

✔ User must be logged in
✔ Start date cannot be in the past
✔ End date must be after start date
✔ System checks overlapping bookings

Price Calculation

Total price is calculated based on duration type:

* Hour → pricePerHour × totalHours
* Day → pricePerDay × totalDays
* Week → pricePerWeek × totalWeeks
* Month → pricePerMonth × totalMonths

Math.ceil() is used to round duration values.

Dashboard Features

Admin Dashboard:

* Total Users
* Total Cars
* Total Bookings

Agent Dashboard:

* My Cars
* Total Bookings
* Pending Requests

Dynamic updates occur after:

* Adding cars
* Creating bookings
* Approving/rejecting bookings
Technical Features

* Role-based authentication
* Dynamic table rendering
* Bootstrap responsive design
* Modal forms
* LocalStorage persistence
* Status badges (Pending, Approved, Rejected)
* Overlap validation logic

Limitations

* No backend database (LocalStorage only).
* Data clears if browser storage is manually cleared.
* No payment gateway integration.

Future Improvements

* Backend integration (Node.js / PHP / Firebase)
* Payment system
* Email notifications
* Real-time booking calendar
* Admin analytics dashboard
* Image upload for cars


