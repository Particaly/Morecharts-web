import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes';
import usersRouter from './routes/users';
import chartsRouter from './routes/morecharts';
import { presend, AccessTokenCheck } from '@/middleware';

const app = express();
app.set('jwtTokenSecret', 'YOUR_SCRET_STRING');
app.use(logger('dev'));
app.use(presend);
app.use(express.json({limit: '2mb'}));
app.use(express.urlencoded({limit: '2mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join('./public')));

app.use(AccessTokenCheck);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/morecharts', chartsRouter);

module.exports = app;
