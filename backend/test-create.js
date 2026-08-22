const http = require('http');

const data = JSON.stringify({
  firstName: "Test",
  lastName: "User",
  email: "test5@test.com",
  departmentName: "Engineering",
  designation: "Tester",
  basicSalary: 60000
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/employees',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
