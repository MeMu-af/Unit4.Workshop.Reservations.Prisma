const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(bodyParser.json());

// GET 1
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET 2
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// GET 3
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany();
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// POST
app.post('/api/customers/:id/reservations', async (req, res) => {
  const customerId = parseInt(req.params.id);
  const { restaurantId, date, partyCount } = req.body;

  if (!restaurantId || !date || !partyCount) {
    return res.status(400).json({ error: 'Missing required fields: restaurantId, date, partyCount' });
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        date: new Date(date),
        partyCount: parseInt(partyCount),
        customer: {
          connect: { id: customerId },
        },
        restaurant: {
          connect: { id: parseInt(restaurantId) },
        },
      },
    });
    res.status(201).json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// DELETE
app.delete('/api/customers/:customerId/reservations/:id', async (req, res) => {
  const reservationId = parseInt(req.params.id);
  const customerId = parseInt(req.params.customerId);

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: { customerId: true },
    });

    if (!reservation || reservation.customerId !== customerId) {
      return res.status(404).json({ error: 'Reservation not found for this customer' });
    }

    await prisma.reservation.delete({
      where: { id: reservationId },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
