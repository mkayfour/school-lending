import app from './app.ts';
import { sequelize } from './models/index.ts';

const port = process.env.PORT || 4000;

await sequelize.authenticate();

app.listen(port, () => console.log(`API running on :${port}`));