import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import router from './routes';

const app = express();
app.set('jwtTokenSecret', 'YOUR_SCRET_STRING');
app.use(logger('dev'));
app.use(express.json({limit: '2mb'}));
app.use(express.urlencoded({limit: '2mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join('./public')));

app.use('/morecharts', router);

module.exports = app;
