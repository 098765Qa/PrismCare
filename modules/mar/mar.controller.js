/**
 * -----------------------------------------------------
 * CONTROLLER: MAR
 * -----------------------------------------------------
 */

import MAR from "./mar.model.js";
import Medication from "../medication/medication.model.js";
import Visit from "../visits/visit.model.js";

// -----------------------------------------------------
// CREATE MAR ENTRY
// -----------------------------------------------------
export async function createMAR(req, res) {
  try {
    const staffId = req.user.staffId;

    const {
      medicationId,
      clientId,
      visitId,
      scheduledTime,
      outcome,
      notes,
      prn,
      signature,
    } = req.body;

    const medication = await Medication.findById(medicationId);
    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    if (visitId) {
      const visit = await Visit.findById(visitId);
      if (!visit) return res.status(404).json({ message: "Visit not found" });

      if (visit.staffId.toString() !== staffId.toString()) {
        return res.status(403).json({ message: "Not your visit" });
      }
    }

    const mar = await MAR.create({
      medicationId,
      clientId,
      staffId,
      visitId,
      scheduledTime,
      actualTime: new Date(),
      status: outcome,
      notes,
      prn,
      signature,
    });

    medication.marEntries.push(mar._id);
    await medication.save();

    if (visitId) {
      const visit = await Visit.findById(visitId);
      visit.marEntries.push(mar._id);
      await visit.save();
    }

    return res.status(201).json(mar);
  } catch (err) {
    return res.status(500).json({
      message: "Error creating MAR entry",
      error: err.message,
    });
  }
}

// -----------------------------------------------------
// GET MAR FOR CLIENT
// -----------------------------------------------------
export async function getClientMAR(req, res) {
  try {
    const { clientId } = req.params;

    const marEntries = await MAR.find({ clientId })
      .populate("medicationId")
      .populate("staffId", "firstName lastName")
      .populate("visitId")
      .sort({ createdAt: -1 });

    return res.json(marEntries);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching MAR entries",
      error: err.message,
    });
  }
}

// -----------------------------------------------------
// DELETE MAR ENTRY
// -----------------------------------------------------
export async function deleteMAR(req, res) {
  try {
    const mar = await MAR.findByIdAndDelete(req.params.id);

    if (!mar) {
      return res.status(404).json({ message: "MAR entry not found" });
    }

    return res.json({ message: "MAR entry deleted" });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting MAR entry",
      error: err.message,
    });
  }
}