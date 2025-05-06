const pool = require("../database/db");
const { v4: uuidv4 } = require('uuid');

exports.importFreightData = async (req, res) => {
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
              shipment_id, origin_country, destination_country,
              shipper_name, agent_name, proof_of_delivery,
              container_20gp, container_40gp, shipment_datetime,
              created_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, now())
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
      });
    }

    res.json({
      success: true,
      message: "Freight data imported successfully.",
      data: insertedRows,
    });
  } catch (error) {
    console.error("Error importing data:", error);
    res.status(500).json({
      success: false,
      message: "Error processing freight data.",
      error: error.message,
    });
  }
};
