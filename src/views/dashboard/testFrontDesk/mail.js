const nodemailer = require('nodemailer');
const html = `
<h1> Hello world</h1>
`;

async function main ()
{
    nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'nidhi@graspberry.com',
          pass: 'Nidhi@1998',
        },
    });

    const info = await transporter.sendmail({
        
    })
}

main();