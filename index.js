const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { connect } = require('./config');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const upload = multer();
const CartRouter = require('./routes/cartRouter');
const ProductRoute = require('./routes/productRouter');
const MediaRoute = require('./routes/mediaRouter');
const PetRoute = require('./routes/petRouter');
const NewsRoute = require('./routes/newsRouter');
const AuthRoute = require('./routes/authRouter');
const UserRoute = require('./routes/userRouter');
const AdoptionRequestRoute = require('./routes/adoptionRequestRouter');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const YOUR_DOMAIN = process.env.DOMAIN || 'http://localhost:3000';

// Middleware setup
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(bodyParser.json());

app.use(upload.any());

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL,
}));

// Define routes
app.use('/api/cart', CartRouter);
app.use('/api/products', ProductRoute);
app.use('/api', MediaRoute);
app.use('/api/pets', PetRoute);
app.use('/api/news', NewsRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/users', UserRoute);
app.use('/api/request', AdoptionRequestRoute);

// Connect to MongoDB
connect();

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
