// Rent-a-Car Management System - JavaScript Logic
// Complete Code with Booking Fix

// ===========================
// DATA STRUCTURES & STORAGE
// ===========================

// Initialize localStorage with dummy data if not exists
function initializeData() {
  if (!localStorage.getItem("users")) {
    const users = [
      {
        id: 1,
        email: "admin@rentacar.com",
        password: "admin123",
        role: "admin",
        name: "System Admin",
        status: "approved",
      },
      {
        id: 2,
        email: "agent@rentacar.com",
        password: "agent123",
        role: "agent",
        name: "Car Agent",
        status: "approved",
      },
      {
        id: 3,
        email: "user@rentacar.com",
        password: "user123",
        role: "user",
        name: "John Customer",
        status: "approved",
      },
    ];
    localStorage.setItem("users", JSON.stringify(users));
  }

  if (!localStorage.getItem("cars")) {
    const cars = [
      {
        id: 1,
        name: "Toyota Camry",
        model: "2020",
        type: "Sedan",
        pricePerHour: 15,
        pricePerDay: 80,
        pricePerWeek: 450,
        pricePerMonth: 1500,
        status: "available",
        agentId: 2,
      },
      {
        id: 2,
        name: "Honda Civic",
        model: "2019",
        type: "Sedan",
        pricePerHour: 12,
        pricePerDay: 70,
        pricePerWeek: 400,
        pricePerMonth: 1300,
        status: "available",
        agentId: 2,
      },
      {
        id: 3,
        name: "Ford Mustang",
        model: "2021",
        type: "Sports",
        pricePerHour: 25,
        pricePerDay: 150,
        pricePerWeek: 900,
        pricePerMonth: 3000,
        status: "available",
        agentId: 2,
      },
    ];
    localStorage.setItem("cars", JSON.stringify(cars));
  }

  if (!localStorage.getItem("bookings")) {
    const bookings = [
      {
        id: 1,
        userId: 3,
        carId: 1,
        startDate: "2024-01-15",
        endDate: "2024-01-16",
        duration: "1 day",
        totalPrice: 80,
        status: "approved",
        createdAt: "2024-01-10",
        userName: "John Customer",
        carName: "Toyota Camry",
      },
      {
        id: 2,
        userId: 3,
        carId: 2,
        startDate: "2024-01-20",
        endDate: "2024-01-22",
        duration: "2 days",
        totalPrice: 140,
        status: "pending",
        createdAt: "2024-01-18",
        userName: "John Customer",
        carName: "Honda Civic",
      },
    ];
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }
}

// Get data from localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function getCars() {
  return JSON.parse(localStorage.getItem("cars")) || [];
}
function getBookings() {
  return JSON.parse(localStorage.getItem("bookings")) || [];
}

// Save data to localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function saveCars(cars) {
  localStorage.setItem("cars", JSON.stringify(cars));
}
function saveBookings(bookings) {
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

// Get current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}
function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}
function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

// ===========================
// AUTHENTICATION
// ===========================

// Login function
function login(email, password, role) {
  const users = getUsers();
  const user = users.find(
    (u) =>
      u.email === email &&
      u.password === password &&
      u.role === role &&
      u.status === "approved"
  );
  if (user) {
    setCurrentUser(user);
    return true;
  }
  return false;
}

// Logout function
function logout() {
  clearCurrentUser();

  // Yeh check karega ke aap kisi sub-folder (admin/agent/user) mein hain ya nahi
  const path = window.location.pathname;

  if (
    path.includes("/admin/") ||
    path.includes("/agent/") ||
    path.includes("/user/")
  ) {
    // Agar aap kisi folder ke andar hain, toh ek step bahar nikal kar login.html pe jao
    window.location.href = "../login.html";
  } else {
    // Agar aap pehle se hi main folder mein hain
    window.location.href = "login.html";
  }
}

// Check authentication and redirect
function checkAuth() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const currentPage = window.location.pathname.split("/").pop();
  const userRolePages = {
    admin: [
      "admin-dashboard.html",
      "manage-users.html",
      "manage-cars.html",
      "bookings.html",
    ],
    agent: ["agent-dashboard.html", "add-car.html", "booking-requests.html"],
    user: ["user-dashboard.html", "available-cars.html", "my-bookings.html"],
  };

  if (!userRolePages[currentUser.role]?.includes(currentPage)) {
    window.location.href = `${currentUser.role}/${currentUser.role}-dashboard.html`;
  }
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

// Show alert message
function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  alertDiv.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 5000);
}

// Format currency
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

// Get status badge
function getStatusBadge(status) {
  const badges = {
    pending: "bg-warning text-dark",
    approved: "bg-success text-white",
    rejected: "bg-danger text-white",
    available: "bg-success text-white",
    rented: "bg-warning text-dark",
    completed: "bg-info text-white",
  };

  return `<span class="badge ${badges[status] || "bg-secondary text-white"}">
        ${status.charAt(0).toUpperCase() + status.slice(1)}
    </span>`;
}

// Calculate price based on duration
function calculatePrice(car, durationType, duration) {
  switch (durationType) {
    case "hour":
      return car.pricePerHour * duration;
    case "day":
      return car.pricePerDay * duration;
    case "week":
      return car.pricePerWeek * duration;
    case "month":
      return car.pricePerMonth * duration;
    default:
      return 0;
  }
}

// ===========================
// DOM MANIPULATION FUNCTIONS
// ===========================

// Render dashboard stats
function renderDashboardStats() {
  const currentUser = getCurrentUser();
  const cars = getCars();
  const bookings = getBookings();
  const users = getUsers();

  if (currentUser.role === "admin") {
    document.getElementById("totalUsers").textContent = users.length;
    document.getElementById("totalCars").textContent = cars.length;
    document.getElementById("totalBookings").textContent = bookings.length;
    document.getElementById("pendingBookings").textContent = bookings.filter(
      (b) => b.status === "pending"
    ).length;
  } else if (currentUser.role === "agent") {
    document.getElementById("myCars").textContent = cars.filter(
      (c) => c.agentId === currentUser.id
    ).length;
    document.getElementById("myBookings").textContent = bookings.filter((b) => {
      const car = cars.find((c) => c.id === b.carId);
      return car && car.agentId === currentUser.id;
    }).length;
    document.getElementById("pendingRequests").textContent = bookings.filter(
      (b) => {
        const car = cars.find((c) => c.id === b.carId);
        return car && car.agentId === currentUser.id && b.status === "pending";
      }
    ).length;
  } else if (currentUser.role === "user") {
    document.getElementById("myBookingsCount").textContent = bookings.filter(
      (b) => b.userId === currentUser.id
    ).length;
    document.getElementById("approvedBookings").textContent = bookings.filter(
      (b) => b.userId === currentUser.id && b.status === "approved"
    ).length;
    document.getElementById("pendingBookingsUser").textContent =
      bookings.filter(
        (b) => b.userId === currentUser.id && b.status === "pending"
      ).length;
  }
}

// Render users table (Admin)
// Render users table (Admin) - Updated
function renderUsersTable() {
  const users = getUsers();
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  users.forEach((user) => {
    let actionButtons = "";

    if (user.status === "pending") {
      actionButtons = `
        <button class="btn btn-success btn-sm me-1" onclick="approveUser(${user.id})">Approve</button>
        <button class="btn btn-danger btn-sm" onclick="rejectUser(${user.id})">Reject</button>
      `;
    } else if (user.status === "approved") {
      // Optional: allow admin to revoke approval
      actionButtons = `
        <button class="btn btn-warning btn-sm" onclick="rejectUser(${user.id})">Revoke</button>
      `;
    } else if (user.status === "rejected") {
      actionButtons = `-`; // No action for rejected users
    }

    const row = `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
        <td>${getStatusBadge(user.status)}</td>
        <td class="text-end">${actionButtons}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// Render cars table (Admin/Agent)
function renderCarsTable() {
  const currentUser = getCurrentUser();
  const cars = getCars();
  const tbody = document.querySelector("#carsTable tbody");
  tbody.innerHTML = "";

  // Only show current agent's cars
  const carsToShow =
    currentUser.role === "agent"
      ? cars.filter((c) => c.agentId === currentUser.id)
      : cars;

  carsToShow.forEach((car) => {
    const showActions =
      currentUser.role === "admin" ||
      (currentUser.role === "agent" && car.agentId === currentUser.id);
    const row = `
            <tr>
                <td>${car.id}</td>
                <td>${car.name}</td>
                <td>${car.model}</td>
                <td>${car.type}</td>
                <td>${formatCurrency(car.pricePerDay)}</td>
                <td>${getStatusBadge(car.status)}</td>
                <td>${
                  showActions
                    ? `<button class="btn btn-danger btn-sm" onclick="deleteCar(${car.id})">Delete</button>`
                    : "N/A"
                }</td>
            </tr>
        `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// Render bookings table (Admin) - FIXED
function renderBookingsTable() {
  const bookings = getBookings();
  const cars = getCars();
  const users = getUsers();
  const tbody = document.querySelector("#bookingsTable tbody");

  if (!tbody) {
    console.error("Bookings table body not found");
    return;
  }

  tbody.innerHTML = "";

  if (bookings.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted">
                    No bookings found.
                </td>
            </tr>
        `;
    return;
  }

  bookings.forEach((booking) => {
    const car = cars.find((c) => c.id === booking.carId);
    const user = users.find((u) => u.id === booking.userId);
    const row = `
            <tr>
                <td>${booking.id}</td>
                <td>${user ? user.name : "Unknown"}</td>
                <td>${
                  car ? car.name + " (" + car.model + ")" : "Unknown Car"
                }</td>
                <td>${formatDate(booking.startDate)} - ${formatDate(
      booking.endDate
    )}</td>
                <td>${booking.duration}</td>
                <td>${formatCurrency(booking.totalPrice)}</td>
                <td>${getStatusBadge(booking.status)}</td>
                <td>
                    ${
                      booking.status === "pending"
                        ? `
                        <button class="btn btn-success btn-sm me-1" onclick="approveBooking(${booking.id})">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="rejectBooking(${booking.id})">Reject</button>
                    `
                        : ""
                    }
                </td>
            </tr>
        `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// Render available cars for users
function renderAvailableCars() {
  const cars = getCars().filter((c) => c.status === "available");
  const container = document.getElementById("availableCars");

  if (!container) {
    console.error("Available cars container not found");
    return;
  }

  container.innerHTML = "";

  if (cars.length === 0) {
    container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No cars available at the moment. Please check back later.
                </div>
            </div>
        `;
    return;
  }

  cars.forEach((car) => {
    const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${car.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${
                          car.model
                        } - ${car.type}</h6>
                        <p class="card-text">
                            <strong>Hourly:</strong> ${formatCurrency(
                              car.pricePerHour
                            )}<br>
                            <strong>Daily:</strong> ${formatCurrency(
                              car.pricePerDay
                            )}<br>
                            <strong>Weekly:</strong> ${formatCurrency(
                              car.pricePerWeek
                            )}<br>
                            <strong>Monthly:</strong> ${formatCurrency(
                              car.pricePerMonth
                            )}
                        </p>
                        <button class="btn btn-primary" onclick="openBookingModal(${
                          car.id
                        })">Book Now</button>
                    </div>
                </div>
            </div>
        `;
    container.insertAdjacentHTML("beforeend", card);
  });
}

// Render user bookings
function renderUserBookings() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const bookings = getBookings().filter((b) => b.userId === currentUser.id);
  const cars = getCars();
  const tbody = document.querySelector("#userBookingsTable tbody");

  if (!tbody) {
    console.error("User bookings table body not found");
    return;
  }

  tbody.innerHTML = "";

  if (bookings.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    You have no bookings yet.
                </td>
            </tr>
        `;
    return;
  }

  bookings.forEach((booking) => {
    const car = cars.find((c) => c.id === booking.carId);
    const row = `
            <tr>
                <td>${booking.id}</td>
                <td>${car ? car.name : "Unknown"}</td>
                <td>${formatDate(booking.startDate)} - ${formatDate(
      booking.endDate
    )}</td>
                <td>${booking.duration}</td>
                <td>${formatCurrency(booking.totalPrice)}</td>
                <td>${getStatusBadge(booking.status)}</td>
            </tr>
        `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// Render agent booking requests - FIXED
function renderAgentBookingRequests() {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "agent") {
    console.error("User is not an agent");
    return;
  }

  const bookings = getBookings();
  const cars = getCars();
  const users = getUsers();
  const tbody = document.querySelector("#agentBookingsTable tbody");

  if (!tbody) {
    console.error("Agent bookings table body not found");
    return;
  }

  tbody.innerHTML = "";

  // Filter bookings for this agent's cars
  const agentBookings = bookings.filter((booking) => {
    const car = cars.find((c) => c.id === booking.carId);
    return car && car.agentId === currentUser.id;
  });

  if (agentBookings.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted">
                    No booking requests found for your cars.
                </td>
            </tr>
        `;
    return;
  }

  agentBookings.forEach((booking) => {
    const car = cars.find((c) => c.id === booking.carId);
    const user = users.find((u) => u.id === booking.userId);
    const row = `
            <tr>
                <td>${booking.id}</td>
                <td>${user ? user.name : "Unknown"}</td>
                <td>${car ? car.name : "Unknown"}</td>
                <td>${formatDate(booking.startDate)} - ${formatDate(
      booking.endDate
    )}</td>
                <td>${booking.duration}</td>
                <td>${formatCurrency(booking.totalPrice)}</td>
                <td>${getStatusBadge(booking.status)}</td>
                <td>
                    ${
                      booking.status === "pending"
                        ? `
                        <button class="btn btn-success btn-sm me-1" onclick="approveBooking(${booking.id})">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="rejectBooking(${booking.id})">Reject</button>
                    `
                        : "Action completed"
                    }
                </td>
            </tr>
        `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// ===========================
// ACTION FUNCTIONS
// ===========================

// User management (Admin)
function approveUser(userId) {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].status = "approved";
    saveUsers(users);
    renderUsersTable();
    showAlert("User approved successfully!");
  }
}

function rejectUser(userId) {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    saveUsers(users);
    renderUsersTable();
    showAlert("User rejected and removed!");
  }
}

// Car management
function addCar(formData) {
  const cars = getCars();
  const currentUser = getCurrentUser();
  const newCar = {
    id: Date.now(),
    name: formData.get("name"),
    model: formData.get("model"),
    type: formData.get("type"),
    pricePerHour: parseFloat(formData.get("pricePerHour")),
    pricePerDay: parseFloat(formData.get("pricePerDay")),
    pricePerWeek: parseFloat(formData.get("pricePerWeek")),
    pricePerMonth: parseFloat(formData.get("pricePerMonth")),
    status: "available",
    agentId: currentUser.id,
  };
  cars.push(newCar);
  saveCars(cars);
  showAlert("Car added successfully!");
  return true;
}

function editCar(carId) {
  // For simplicity, redirect to add-car with edit mode
  window.location.href = `add-car.html?edit=${carId}`;
}

function deleteCar(carId) {
  if (confirm("Are you sure you want to delete this car?")) {
    const cars = getCars();
    const filteredCars = cars.filter((c) => c.id !== carId);
    saveCars(filteredCars);
    renderCarsTable();
    showAlert("Car deleted successfully!");
  }
}

function createBooking(carId, startDate, endDate, durationType) {
  try {
    console.log("Creating booking with:", {
      carId,
      startDate,
      endDate,
      durationType,
    });

    const currentUser = getCurrentUser();
    if (!currentUser) {
      showAlert("Please login to book a car!", "danger");
      return false;
    }

    const cars = getCars();
    const car = cars.find((c) => c.id === parseInt(carId));

    if (!car) {
      showAlert("Car not found!", "danger");
      return false;
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      showAlert("Start date cannot be in the past!", "danger");
      return false;
    }

    if (end <= start) {
      showAlert("End date must be after start date!", "danger");
      return false;
    }

    // Check for overlapping bookings
    const bookings = getBookings();
    const overlapping = bookings.some((b) => {
      if (b.carId !== car.id || b.status === "rejected") return false;
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);
      // Overlap check
      return start < bEnd && end > bStart;
    });

    if (overlapping) {
      showAlert("This car is already booked for the selected dates!", "danger");
      return false;
    }

    // Calculate duration in days/hours/weeks/months
    const timeDiff = end - start;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    let totalPrice = 0;
    let durationText = "";

    switch (durationType) {
      case "hour":
        const hours = Math.ceil(timeDiff / (1000 * 60 * 60));
        totalPrice = car.pricePerHour * hours;
        durationText = `${hours} hour${hours > 1 ? "s" : ""}`;
        break;
      case "day":
        totalPrice = car.pricePerDay * days;
        durationText = `${days} day${days > 1 ? "s" : ""}`;
        break;
      case "week":
        const weeks = Math.ceil(days / 7);
        totalPrice = car.pricePerWeek * weeks;
        durationText = `${weeks} week${weeks > 1 ? "s" : ""}`;
        break;
      case "month":
        const months = Math.ceil(days / 30);
        totalPrice = car.pricePerMonth * months;
        durationText = `${months} month${months > 1 ? "s" : ""}`;
        break;
      default:
        showAlert("Invalid duration type!", "danger");
        return false;
    }

    // Create new booking
    const newBooking = {
      id: Date.now(),
      userId: currentUser.id,
      carId: parseInt(carId),
      startDate: startDate,
      endDate: endDate,
      duration: durationText,
      totalPrice: totalPrice,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      userName: currentUser.name,
      carName: car.name,
    };

    bookings.push(newBooking);
    saveBookings(bookings);

    console.log("Booking created:", newBooking);
    showAlert(
      "Booking request submitted successfully! Wait for agent approval.",
      "success"
    );

    return true;
  } catch (error) {
    console.error("Error creating booking:", error);
    showAlert("Error creating booking: " + error.message, "danger");
    return false;
  }
}

function approveBooking(bookingId) {
  const bookings = getBookings();
  const cars = getCars();
  const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

  if (bookingIndex !== -1) {
    bookings[bookingIndex].status = "approved";
    saveBookings(bookings);

    // Update car status
    const booking = bookings[bookingIndex];
    const carIndex = cars.findIndex((c) => c.id === booking.carId);
    if (carIndex !== -1) {
      cars[carIndex].status = "rented";
      saveCars(cars);
    }

    // Re-render appropriate tables based on current page
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "bookings.html") {
      renderBookingsTable();
    } else if (currentPage === "booking-requests.html") {
      renderAgentBookingRequests();
    }

    // Update dashboard stats
    renderDashboardStats();

    showAlert("Booking approved successfully!");
  }
}

function rejectBooking(bookingId) {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

  if (bookingIndex !== -1) {
    bookings[bookingIndex].status = "rejected";
    saveBookings(bookings);

    // Re-render appropriate tables
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "bookings.html") {
      renderBookingsTable();
    } else if (currentPage === "booking-requests.html") {
      renderAgentBookingRequests();
    }

    showAlert("Booking rejected!");
  }
}

// Modal functions (currentUser issue + Bootstrap modal)
function openBookingModal(carId) {
  const car = getCars().find((c) => c.id === Number(carId));
  if (!car) {
    alert("Car not found!");
    return;
  }

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showAlert("Please login to book a car!", "danger");
    return;
  }

  // Set car info in modal
  document.getElementById("bookingCarName").innerText =
    car.name + " (" + car.model + ")";
  document.getElementById("bookingCarId").value = car.id;

  // Show modal using Bootstrap
  const modalEl = document.getElementById("bookingModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  const bookingForm = document.getElementById("bookingForm");

  // Remove any previous listener to avoid duplicates
  bookingForm.onsubmit = function (e) {
    e.preventDefault();

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const durationType = document.getElementById("durationType").value;

    if (!startDate || !endDate) {
      showAlert("Please select both start and end dates!", "danger");
      return;
    }

    if (createBooking(car.id, startDate, endDate, durationType)) {
      // Hide modal
      modal.hide();

      // Reset form
      bookingForm.reset();

      // Refresh available cars and user bookings
      renderAvailableCars();
      if (document.getElementById("userBookingsTable")) {
        renderUserBookings();
      }
    }
  };
}

// ===========================
// EVENT LISTENERS & INITIALIZATION
// ===========================

document.addEventListener("DOMContentLoaded", function () {
  initializeData();

  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;

      if (login(email, password, role)) {
        window.location.href = `${role}/${role}-dashboard.html`;
      } else {
        showAlert("Invalid credentials or account not approved!", "danger");
      }
    });
  }

  // Register form
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;

      const users = getUsers();
      if (users.find((u) => u.email === email)) {
        showAlert("Email already exists!", "danger");
        return;
      }

      const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: role,
        status: role === "user" ? "approved" : "pending",
      };
      users.push(newUser);
      saveUsers(users);

      if (role === "user") {
        showAlert("Registration successful! You can login now.");
        window.location.href = "login.html";
      } else {
        showAlert("Registration successful! Please wait for admin approval.");
        window.location.href = "login.html";
      }
    });
  }

  // Add car form
  const addCarForm = document.getElementById("addCarForm");
  if (addCarForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("edit");

    if (editId) {
      // Load car data for editing
      const car = getCars().find((c) => c.id === parseInt(editId));
      if (car) {
        document.getElementById("carName").value = car.name;
        document.getElementById("carModel").value = car.model;
        document.getElementById("carType").value = car.type;
        document.getElementById("pricePerHour").value = car.pricePerHour;
        document.getElementById("pricePerDay").value = car.pricePerDay;
        document.getElementById("pricePerWeek").value = car.pricePerWeek;
        document.getElementById("pricePerMonth").value = car.pricePerMonth;
        document.querySelector('button[type="submit"]').textContent =
          "Update Car";

        // Update form submission for edit
        addCarForm.addEventListener("submit", function (e) {
          e.preventDefault();

          if (confirm("Are you sure you want to update this car?")) {
            const cars = getCars();
            const carIndex = cars.findIndex((c) => c.id === parseInt(editId));

            if (carIndex !== -1) {
              cars[carIndex] = {
                ...cars[carIndex],
                name: document.getElementById("carName").value,
                model: document.getElementById("carModel").value,
                type: document.getElementById("carType").value,
                pricePerHour: parseFloat(
                  document.getElementById("pricePerHour").value
                ),
                pricePerDay: parseFloat(
                  document.getElementById("pricePerDay").value
                ),
                pricePerWeek: parseFloat(
                  document.getElementById("pricePerWeek").value
                ),
                pricePerMonth: parseFloat(
                  document.getElementById("pricePerMonth").value
                ),
              };

              saveCars(cars);
              showAlert("Car updated successfully!");
              setTimeout(() => {
                window.location.href = "agent-dashboard.html";
              }, 1000);
            }
          }
        });
      }
    } else {
      // Original add car functionality
      addCarForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(addCarForm);
        if (addCar(formData)) {
          addCarForm.reset();
          showAlert("Car added successfully!");
          setTimeout(() => {
            window.location.href = "agent-dashboard.html";
          }, 1000);
        }
      });
    }
  }

  // Booking form - FIXED
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const carId = document.getElementById("bookingCarId").value;
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;
      const durationType = document.getElementById("durationType").value;

      console.log("Form submitted with:", {
        carId,
        startDate,
        endDate,
        durationType,
      });

      if (createBooking(carId, startDate, endDate, durationType)) {
        // Hide modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("bookingModal")
        );
        if (modal) {
          modal.hide();
        }

        // Reset form
        bookingForm.reset();

        // Update available cars list
        renderAvailableCars();

        // Update user bookings if on that page
        if (document.getElementById("userBookingsTable")) {
          renderUserBookings();
        }
      }
    });
  }

  // Logout buttons
  const logoutBtns = document.querySelectorAll(".logout-btn");
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", logout);
  });

  // Render data based on current page
  const currentPage = window.location.pathname.split("/").pop();
  console.log("Current page:", currentPage);

  switch (currentPage) {
    case "admin-dashboard.html":
      renderDashboardStats();
      break;
    case "manage-users.html":
      renderUsersTable();
      break;
    case "manage-cars.html":
    case "agent-dashboard.html":
      renderCarsTable();
      renderDashboardStats();
      break;
    case "bookings.html":
      renderBookingsTable();
      break;
    case "available-cars.html":
      renderAvailableCars();
      break;
    case "my-bookings.html":
      renderUserBookings();
      renderDashboardStats();
      break;
    case "booking-requests.html":
      renderAgentBookingRequests();
      renderDashboardStats();
      break;
    case "user-dashboard.html":
      renderDashboardStats();
      break;
  }

  // Check authentication for protected pages
  const publicPages = ["index.html", "login.html", "register.html"];
  if (!publicPages.includes(currentPage)) {
    checkAuth();
  }
});

// ===========================
// DEBUG FUNCTIONS (Optional)
// ===========================

// Debug function to check data
function debugData() {
  console.log("=== DEBUG DATA ===");
  console.log("Users:", getUsers());
  console.log("Cars:", getCars());
  console.log("Bookings:", getBookings());
  console.log("Current User:", getCurrentUser());
  console.log("==================");
}

// Reset all data
function resetAllData() {
  if (
    confirm("Are you sure you want to reset ALL data? This cannot be undone!")
  ) {
    localStorage.clear();
    initializeData();
    showAlert("All data has been reset to defaults!", "info");
    window.location.reload();
  }
}

// Test booking function
function testBooking() {
  // This is just for testing
  const testBooking = {
    id: Date.now(),
    userId: 3,
    carId: 1,
    startDate: "2024-01-25",
    endDate: "2024-01-27",
    duration: "2 days",
    totalPrice: 160,
    status: "pending",
    createdAt: new Date().toISOString().split("T")[0],
    userName: "John Customer",
    carName: "Toyota Camry",
  };

  const bookings = getBookings();
  bookings.push(testBooking);
  saveBookings(bookings);

  showAlert("Test booking added!", "info");

  // Refresh tables
  if (window.location.pathname.includes("bookings")) {
    renderBookingsTable();
  }
  if (window.location.pathname.includes("booking-requests")) {
    renderAgentBookingRequests();
  }
}
