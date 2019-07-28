import { Entry } from './../models/entry';
import express from 'express';
import { MongoGenericDAO } from '../models/mongo-generic.dao';
import { Timestamp } from 'bson';
import uuid = require('uuid');

const router = express.Router();

let mockEntries: Partial<Entry>[] = [
  { title: 'Streichen', startDate: new Date(2019, 6, 22), endDate: new Date(2019, 6, 31) },
  { title: 'Tapezieren', startDate: new Date(2019, 6, 2), endDate: new Date(2019, 6, 4) },
  { title: 'Anderes', startDate: new Date(2019, 6, 2), endDate: new Date(2019, 6, 8) },
  { title: 'Anderes2', startDate: new Date(2019, 6, 2), endDate: new Date(2019, 6, 8) },
  { title: 'Laminat legen', startDate: new Date(2019, 7, 2), endDate: new Date(2019, 7, 9) }
]

router.get('/', async (req, res) => {
  const entryDAO: MongoGenericDAO<Entry> = req.app.locals.entryDAO;

  const entries = await entryDAO.findAll();

  if (!entries.length) {
    mockEntries.forEach(async (entry) => {
      await entryDAO.create(entry);
    })
  }
  res.send(entries);
});

export default router;