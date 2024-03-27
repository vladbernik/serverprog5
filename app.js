import express from 'express';

import fs from 'fs';
const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.get('/index', (req, res) => {
    res.render('index', { currentPage: 'home' }); 
});
app.get('/about-us', (req, res) => {
    res.render('about-us', { currentPage: 'about' }); // Рендерим шаблон 
});
app.get('/services', (req, res) => {
    res.render('services', { currentPage: 'services' }); 
});
app.get('/portfolio', getPortfoliosPage
);
app.get('/features', (req, res) => {
    res.render('features', { currentPage: 'features' }); 
});
app.get('/testimonials', (req, res) => {
    res.render('testimonials', { currentPage: 'testimonials' }); 
});
app.get('/pricing', (req, res) => {
    res.render('pricing', { currentPage: 'pricing' }); 
});
app.get('/contact', (req, res) => {
    res.render('contact', { currentPage: 'contact' }); 
});

app.post('/request', (req, res) => {
    const { first_name, last_name, email, phone, select_service, select_price, comments } = req.body;
    if (first_name.trim() === '') {
        return res.send('<div class="error_message">Attention! You must enter your name.</div>');
    } else if (email.trim() === '') {
        return res.send('<div class="error_message">Attention! Please enter a valid email address.</div>');
    } else if (!email) {
        return res.send('<div class="error_message">Attention! You have entered an invalid email address, please try again.</div>');
    }
    if (comments.trim() === '') {
        return res.send('<div class="error_message">Attention! Please enter your message.</div>');
    }

    const csvData = `${first_name},${last_name},${email},${phone},${select_service},${select_price},${comments}\n`;


    fs.appendFile('contact_data.csv', csvData, (err) => {
        if (err) {
            console.error('Error writing to CSV file:', err);
            res.status(500).send('Error saving data');
        } else {
            console.log('Data saved to CSV file');
            res.status(200).send('Data saved successfully');
        }
    });
});

async function getPortfoliosPage(req, res, next) {
    try {
        const jsonData = fs.readFileSync("public/portfolioItem.json", 'utf-8');
        const jsonData2 = fs.readFileSync("public/portfolioWidget.json", "utf-8");
        console.log(jsonData);
      return res.render("portfolio", {
        currentPage: 'portfolio',
        portfolios: JSON.parse(jsonData),
        services: JSON.parse(jsonData2),
      });
    } catch (err) {
      console.error("Cannot get data from service:", err.message);
      next(err);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
