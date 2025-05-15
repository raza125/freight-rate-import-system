// const pool = require("../database/db");
const { v4: uuidv4 } = require('uuid');

exports.importFreightData = async (req, res, pool, next) => {
  const { rows, mapping } = req.body;

  if (!rows || !mapping) {
    return res.status(400).json({
      success: false,
      message: "Missing rows or mapping in request body.",
    });
  }
  const reversedMapping = Object.fromEntries(
    Object.entries(mapping).map(([excelHeader, systemField]) => [
      systemField,
      excelHeader,
    ])
  );

  try {
    const versionQuery = await pool.query('SELECT MAX(version_number) AS max_version FROM freight_rates');
    const newVersion = (versionQuery.rows[0].max_version || 0) + 1;
    const insertedRows = [];

    for (const row of rows) {
      const shipment_id = reversedMapping["ShipmentID"]
    ? row[reversedMapping["ShipmentID"]]
    : uuidv4();
      const origin_country = row[reversedMapping["OriginCountry"]];
      const destination_country = row[reversedMapping["DestinationCountry"]];
      const shipper_name = row[reversedMapping["ShipperName"]];
      const agent_name = row[reversedMapping["AgentName"]];
      const proof_of_delivery = row[reversedMapping["Proof of Delivery"]];

      const container_20gp = parseFloat(row[reversedMapping["20'GP"]]) || null;
      const container_40gp = parseFloat(row[reversedMapping["40'GP"]]) || null;

      const shipment_datetime =
        reversedMapping["Date-time"] &&
        row[reversedMapping["Date-time"]] &&
        !isNaN(new Date(row[reversedMapping["Date-time"]]).getTime())
          ? new Date(row[reversedMapping["Date-time"]])
          : null;

          await pool.query(
            `INSERT INTO freight_rates (
              shipment_id, 
              origin_country, 
              destination_country,
              shipper_name, 
              agent_name, 
              proof_of_delivery,
              container_20gp, 
              container_40gp, 
              shipment_datetime,
              version_number
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, $10)
            ON CONFLICT (shipment_id) DO UPDATE SET
              origin_country = EXCLUDED.origin_country,
              destination_country = EXCLUDED.destination_country,
              shipper_name = EXCLUDED.shipper_name,
              agent_name = EXCLUDED.agent_name,
              proof_of_delivery = EXCLUDED.proof_of_delivery,
              container_20gp = EXCLUDED.container_20gp,
              container_40gp = EXCLUDED.container_40gp,
              shipment_datetime = EXCLUDED.shipment_datetime`,
            [
              shipment_id,
              origin_country,
              destination_country,
              shipper_name,
              agent_name,
              proof_of_delivery,
              container_20gp,
              container_40gp,
              shipment_datetime,
              newVersion
            ]
          );          

      insertedRows.push({
        shipment_id,
        origin_country,
        destination_country,
        shipper_name,
        agent_name,
        proof_of_delivery,
        container_20gp,
        container_40gp,
        shipment_datetime,
        version: newVersion
      });
    }

    res.json({
      success: true,
      message: "Freight data imported successfully.",
      version: newVersion,
      data: insertedRows,
    });
  } catch (error) {
    next(error);
  }
};
