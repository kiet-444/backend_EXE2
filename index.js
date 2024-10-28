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
const CartPetRoute = require('./routes/cartPetRouter');
const ReviewRoute = require('./routes/reviewRouter');
const FundRoute = require('./routes/fundRouter');
const InvoiceRoute = require('./routes/invoiceRouter');

dotenv.config();

const Invoice = require('./models/Invoice');
const Fund = require('./models/Fund');

const app = express();
const port = process.env.PORT || 3001;
const YOUR_DOMAIN = process.env.DOMAIN || 'http://localhost:3000';

// Middleware setup
app.use(cors({
    origin: 'http://localhost:5173',
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


app.post('/receive-hook', async (req, res) => {
  const { data } = req.body;

  if (data.code === '00') {

    const invoice = await Invoice.findOne({ orderCode: data.orderCode });

    if (invoice) {
      await Invoice.findOneAndUpdate(
        { orderCode: data.orderCode },
        { status: 'Paid' },
        { new: true }
      );
      return res.status(200).json({ message: "Invoice updated to Paid" });
    }

    const fund = await Fund.findOne({ orderCode: data.orderCode });

    if (fund) {
      await Fund.findOneAndUpdate(
        { orderCode: data.orderCode },
        { status: 'approved' },
        { new: true }
      );
      return res.status(200).json({ message: "Fund updated to approved" });
    }

    return res.status(404).json({ message: "Neither invoice nor fund found" });
  } else {
    return res.status(400).json({ message: "Invalid status code" });
  }
});


// Define routes
app.use('/api/cart', CartRouter);
app.use('/api/products', ProductRoute);
app.use('/api', MediaRoute);
app.use('/api/pets', PetRoute);
app.use('/api/news', NewsRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/users', UserRoute);
app.use('/api/request', AdoptionRequestRoute);
app.use('/api/cart-pets', CartPetRoute);
app.use('/api', ReviewRoute);
app.use('/api', FundRoute);
app.use('/api', InvoiceRoute);

// Connect to MongoDB
connect();

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
