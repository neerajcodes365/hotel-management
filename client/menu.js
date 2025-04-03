const prompt = require("prompt-sync")();
const axios = require("axios");

const baseURL = "http://localhost:5000"; // Your Node.js server

async function userMenu() {
    while (true) {
        console.log("\n===== User Menu =====");
        console.log("1. Register");
        console.log("2. Check Room Availability");
        console.log("3. Book a Room");
        console.log("4. Cancel Booking");
        console.log("5. View Booking Details");
        console.log("6. Make Payment");
        console.log("7. Get Invoice");
        console.log("8. Request Room Service");
        console.log("9. Provide Feedback");
        console.log("0. Back to Main Menu");

        let choice = prompt("Enter your choice: ");

        switch (choice) {
            case "1":
                let name = prompt("Enter name: ");
                let email = prompt("Enter email: ");
                let password = prompt("Enter password: ");
                await axios.post(`${baseURL}/register`, { name, email, password, role: "customer" });
                console.log("User registered successfully!");
                break;
            
            case "2":
                let rooms = await axios.get(`${baseURL}/rooms`);
                console.log("Available Rooms:", rooms.data);
                break;
            
            case "3":
                let user_id = prompt("Enter your user ID: ");
                let room_id = prompt("Enter room ID to book: ");
                let check_in = prompt("Enter check-in date (YYYY-MM-DD): ");
                let check_out = prompt("Enter check-out date (YYYY-MM-DD): ");
                await axios.post(`${baseURL}/book`, { user_id, room_id, check_in, check_out });
                console.log("Room booked successfully!");
                break;
            
            case "4":
                let bookingId = prompt("Enter booking ID to cancel: ");
                await axios.delete(`${baseURL}/cancel/${bookingId}`);
                console.log("Booking cancelled.");
                break;
            
            case "5":
                let userBookings = await axios.get(`${baseURL}/booking/${prompt("Enter booking ID: ")}`);
                console.log("Your Bookings:", userBookings.data);
                break;

            case "6":
                let payBookingId = prompt("Enter booking ID: ");
                let amount = prompt("Enter amount: ");
                let method = prompt("Payment method (Credit Card/Cash): ");
                await axios.post(`${baseURL}/pay`, { bookingId: payBookingId, amount, method });
                console.log("Payment Successful!");
                break;
            
            case "7":
                let invoice = await axios.get(`${baseURL}/invoice/${prompt("Enter booking ID: ")}`);
                console.log("Invoice:", invoice.data);
                break;
            
            case "8":
                let serviceDetails = prompt("Enter service request details: ");
                await axios.post(`${baseURL}/request-service`, { user_id, room_id, requestDetails: serviceDetails });
                console.log("Service requested successfully!");
                break;

            case "9":
                let feedback = prompt("Enter feedback: ");
                let rating = prompt("Enter rating (1-5): ");
                await axios.post(`${baseURL}/feedback`, { user_id, message: feedback, rating });
                console.log("Feedback submitted!");
                break;

            case "0":
                return;
            
            default:
                console.log("Invalid choice! Please try again.");
        }
    }
}

async function staffMenu() {
    while (true) {
        console.log("\n===== Staff Menu =====");
        console.log("1. Manage Guest Bookings");
        console.log("2. Assign Rooms");
        console.log("3. Process Payments");
        console.log("4. Generate Invoices");
        console.log("5. Assign Room Service Tasks");
        console.log("6. Track Inventory");
        console.log("7. Manage Cleaning Schedules");
        console.log("8. Manage Employee Records");
        console.log("9. Generate Reports");
        console.log("0. Back to Main Menu");

        let choice = prompt("Enter your choice: ");

        switch (choice) {
            case "1":
                let allBookings = await axios.get(`${baseURL}/all-bookings`);
                console.log("All Bookings:", allBookings.data);
                break;

            case "2":
                let assignBookingId = prompt("Enter booking ID: ");
                let assignroom_id = prompt("Enter room ID: ");
                await axios.put(`${baseURL}/assign-room`, { bookingId: assignBookingId, room_id: assignroom_id });
                console.log("Room assigned!");
                break;

            case "3":
                let processPaymentId = prompt("Enter payment ID: ");
                await axios.put(`${baseURL}/process-payment`, { paymentId: processPaymentId });
                console.log("Payment Processed.");
                break;

            case "4":
                let invoiceBookingId = prompt("Enter booking ID: ");
                await axios.post(`${baseURL}/generate-invoice`, { bookingId: invoiceBookingId });
                console.log("Invoice Generated.");
                break;

            case "5":
                let serviceRequestId = prompt("Enter service request ID: ");
                await axios.put(`${baseURL}/assign-service`, { requestId: serviceRequestId });
                console.log("Service Task Assigned.");
                break;

            case "6":
                let inventory = await axios.get(`${baseURL}/inventory`);
                console.log("Inventory Status:", inventory.data);
                break;

            case "7":
                let cleaningSchedules = await axios.get(`${baseURL}/cleaning-schedules`);
                console.log("Cleaning Schedules:", cleaningSchedules.data);
                break;

            case "8":
                let employees = await axios.get(`${baseURL}/employees`);
                console.log("Employee Records:", employees.data);
                break;

            case "9":
                let reportType = prompt("Enter report type (Booking Summary/Revenue/Inventory Status): ");
                let generatedBy = prompt("Enter staff ID: ");
                await axios.post(`${baseURL}/generate-report`, { reportType, generatedBy });
                console.log("Report Generated.");
                break;

            case "0":
                return;

            default:
                console.log("Invalid choice! Please try again.");
        }
    }
}

async function mainMenu() {
    while (true) {
        console.log("\n===== Hotel Management System =====");
        console.log("1. Customer");
        console.log("2. Staff");
        console.log("0. Exit");

        let choice = prompt("Enter your choice: ");

        switch (choice) {
            case "1":
                await userMenu();
                break;

            case "2":
                await staffMenu();
                break;

            case "0":
                console.log("Exiting system...");
                process.exit();

            default:
                console.log("Invalid choice! Please try again.");
        }
    }
}

mainMenu();
