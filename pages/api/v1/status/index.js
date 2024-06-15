import database from "infra/database.js";

async function status(request, response) {
  const version = await database.query("SHOW server_version");
  const databaseVersionValue = version.rows[0].server_version;

  const databaseMaxCon = await database.query("SHOW max_connections;");
  const databaseMaxConValue = databaseMaxCon.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenConnectionResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenConnectionValue =
    databaseOpenConnectionResult.rows[0].count;

  const updatedAt = new Date().toISOString();

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConValue),
        opened_connections: databaseOpenConnectionValue,
      },
    },
  });
}

export default status;
