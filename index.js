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

// const http = require('http');
// const { Server } = require('socket.io');
const path = require('path');

// const { setupSocket } = require('./socket');

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

// const { askGPT3_5 } = require('./OpenAI');

dotenv.config();

const Invoice = require('./models/Invoice');
const Fund = require('./models/Fund');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// const server = http.createServer(app);
// const io = new Server(server);


// setupSocket(io);

// Connect to MongoDB
connect();

const port = process.env.PORT || 3001;
const YOUR_DOMAIN = process.env.DOMAIN || 'http://localhost:3000';

// Middleware setup
app.use(cors({
    origin: '*',
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
    }

    const fund = await Fund.findOne({ orderCode: data.orderCode });

    if (fund) {
      await Fund.findOneAndUpdate(
        { orderCode: data.orderCode },
        { status: 'approved' },
        { new: true }
      );
    }
  }
  res.json();
});


// Define routes
app.use('/api/cart', CartRouter);
app.use('/api/products', ProductRoute);
app.use('/api', MediaRoute);
app.use('/api/pets', PetRoute);
app.use('/api/news', NewsRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/user', UserRoute);
app.use('/api/request', AdoptionRequestRoute);
app.use('/api/cart-pets', CartPetRoute);
app.use('/api', ReviewRoute);
app.use('/api', FundRoute);
app.use('/api', InvoiceRoute);




// app.post('/api/gpt', async (req, res) => {
//     try {
//         const response = await askGPT3_5(req.body.prompt);
//         res.status(200).json({ message: 'GPT-3.5 response', data: response });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch response from OpenAI', error });
//     }
// });



app.listen(port, () => {
    console.log(`Server listening on port ${port}`,server.address().port);
});
