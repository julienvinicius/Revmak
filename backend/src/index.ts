import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';

// Rotas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

// Middlewares
import { globalErrorHandler, AppError } from './middlewares/error.middleware';

// Inicialização do banco de dados
import { initDatabase } from './config/init-db';

// Configuração das variáveis de ambiente
dotenv.config();

// Criação da aplicação Express
const app: Express = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

// Configuração do CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Limitador de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100, // 100 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Revmak funcionando!');
});

// Middleware para rotas não encontradas
app.all('*', (req, res, next) => {
  next(new AppError(`Não foi possível encontrar ${req.originalUrl} neste servidor!`, 404));
});

// Middleware de tratamento de erros
app.use(globalErrorHandler);

// Inicialização do servidor
const startServer = async () => {
  try {
    // Inicializar o banco de dados
    await initDatabase();
    
    // Iniciar o servidor
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
};

startServer(); 