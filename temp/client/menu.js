const readline = require('readline');
const axios = require('axios');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function apiCall(endpoint, method = 'GET', data = {}) {
    return axios({
        method,
        url: `http://localhost:3000${endpoint}`,
        data
    }).then(response => console.log(response.data))
      .catch(error => console.error(error.response ? error.response.data : error.message));
}

function mainMenu() {
    console.log('\nWelcome to the Hotel Management System!');
    console.log('1. Register User');
    console.log('2. Get All Rooms');
    console.log('3. Book a Room');
    console.log('4. Cancel a Booking');
    console.log('5. View Booking Details');
    console.log('6. Check Room Availability');
    console.log('7. Staff - Get All Bookings');
    console.log('8. Staff - Add Room');
    console.log('9. Staff - Assign Room');
    console.log('10. Exit');
    rl.question('Enter your choice: ', choice => {
        switch (choice) {
            case '1':
                rl.question('Enter name: ', name => {
                    rl.question('Enter email: ', email => {
                        apiCall('/register', 'POST', { name, email }).then(() => mainMenu());
                    });
                });
                break;
            case '2':
                apiCall('/rooms').then(() => mainMenu());
                break;
            case '3':
                rl.question('Enter User ID: ', userId => {
                    rl.question('Enter Room ID: ', roomId => {
                        apiCall('/book', 'POST', { userId, roomId }).then(() => mainMenu());
                    });
                });
                break;
            case '4':
                rl.question('Enter Booking ID: ', bookingId => {
                    apiCall('/cancel', 'POST', { bookingId }).then(() => mainMenu());
                });
                break;
            case '5':
                rl.question('Enter User ID: ', userId => {
                    apiCall(`/bookings/${userId}`).then(() => mainMenu());
                });
                break;
            case '6':
                rl.question('Enter Room ID: ', roomId => {
                    apiCall(`/check-room/${roomId}`).then(() => mainMenu());
                });
                break;
            case '7':
                apiCall('/all-bookings').then(() => mainMenu());
                break;
            case '8':
                rl.question('Enter Room Number: ', roomNumber => {
                    apiCall('/rooms', 'POST', { roomNumber }).then(() => mainMenu());
                });
                break;
            case '9':
                rl.question('Enter Booking ID: ', bookingId => {
                    rl.question('Enter Room ID: ', roomId => {
                        apiCall('/assign-room', 'POST', { bookingId, roomId }).then(() => mainMenu());
                    });
                });
                break;
            case '10':
                console.log('Exiting...');
                rl.close();
                break;
            default:
                console.log('Invalid choice, try again.');
                mainMenu();
        }
    });
}

mainMenu();
