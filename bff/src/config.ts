type configProps = {
  app: {
    name: string,
    port: number,
    adminPassword: string
  },
  db: {
    host: string,
    database: string,
    port: number
    user: string,
    password: string
  }
}

export const config: configProps = {
  app: {
    name: process.env["NAME"] || 'BFF-Courses',
    port: parseInt(process.env["PORT"] || '') || 8000,
    adminPassword: process.env["ADMIN_PASSWORD"] || 'admin'
  },
  db: {
    host: process.env["DB_HOST"] || 'db',
    database: process.env["DB_NAME"] || 'postgres',
    port: parseInt(process.env["DB_PORT"] || '') || 5432,
    user: process.env["DB_USER"] || 'postgres',
    password: process.env["DB_PASSWORD"] || 'postgres',
  }
};
