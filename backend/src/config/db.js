import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER,          
  password: process.env.DB_PASSWORD,  
  server: process.env.DB_SERVER,      
  database: process.env.DB_DATABASE,  
  options: {
    encrypt: false,
    trustServerCertificate: true,
    port: 1433,
  },
};

let poolInstance = null;

export async function getPool() {
  if (poolInstance) return poolInstance;

  try {
    poolInstance = await sql.connect(config);
    console.log("✅ Connected to SQL Server");
    return poolInstance;
  } catch (err) {
    console.error("❌ SQL Server Connection Error:", err);
    throw err;
  }
}

export { sql };
