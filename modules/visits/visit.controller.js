/**
 * -----------------------------------------------------
 * CONTROLLER: Visits
 * ROLE: Handle all visit-related logic for:
 *       - Admin: full scheduling CRUD
 *       - Staff: my visits, today, start/end, details
 *       - Tasks: list + complete
 *       - AI/GPS hooks and anomaly detection
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add advanced filters for admin (by date range, status, branch)
 * - Add visit tasks endpoints (AI suggestions, bulk update)
 * - Integrate AI visit summary generation after completion
 * - Integrate predictive scheduling for suggested durations
 * - Add safeguarding alert triggers and notifications
 * -----------------------------------------------------
 */

const Visit = require("./visit.model");
const AIInsight = require("../ai/insights.model");

const GPSLog = require("../gps/gpslog.model");

module.exports = {
  // -----------------------------------------------------
  // ADMIN: CREATE VISIT
  // -----------------------------------------------------
  async createVisit(req, res) {
    try {
      const visit = await Visit.create(req.body);
      return res.status(201).json(visit);
    } catch (err) {
      return res.status(500).json({
        message: "Error creating visit",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // ADMIN: GET ALL VISITS
  // (Can be expanded later with query params for filtering)
  // -----------------------------------------------------
  async getAllVisits(req, res) {
    try {
      const visits = await Visit.find()
        .populate("clientId")
        .populate("staffId")
        .sort({ scheduledStart: 1 });

      return res.json(visits);
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching visits",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // ADMIN: UPDATE VISIT
  // -----------------------------------------------------
  async updateVisit(req, res) {
    try {
      const visit = await Visit.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }

      return res.json(visit);
    } catch (err) {
      return res.status(500).json({
        message: "Error updating visit",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // ADMIN: DELETE VISIT
  // -----------------------------------------------------
  async deleteVisit(req, res) {
    try {
      const visit = await Visit.findByIdAndDelete(req.params.id);

      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }

      return res.json({ message: "Visit deleted" });
    } catch (err) {
      return res.status(500).json({
        message: "Error deleting visit",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // STAFF: MY UPCOMING VISITS
  // -----------------------------------------------------
  async getMyUpcomingVisits(req, res) {
    try {
      const staffId = req.user.staffId;

      const visits = await Visit.find({
        staffId,
        scheduledStart: { $gte: new Date() },
      })
        .populate("clientId")
        .sort({ scheduledStart: 1 });

      return res.json(visits);
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching upcoming visits",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // STAFF: TODAY'S VISITS
  // -----------------------------------------------------
  async getMyTodayVisits(req, res) {
    try {
      const staffId = req.user.staffId;

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const visits = await Visit.find({
        staffId,
        scheduledStart: { $gte: startOfDay, $lte: endOfDay },
      })
        .populate("clientId")
        .sort({ scheduledStart: 1 });

      return res.json(visits);
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching today's visits",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // SHARED: VISIT DETAILS (ADMIN + STAFF)
  // Includes AI insights + last GPS log (if models exist)
  // -----------------------------------------------------
  async getVisitById(req, res) {
    try {
      const visit = await Visit.findById(req.params.id)
        .populate("clientId")
        .populate("staffId");

      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }

      let insights = [];
      let lastGPS = null;

      // Optional AI + GPS if those modules exist
      try {
        if (visit.clientId?._id) {
          insights = await AIInsight.find({
            clientId: visit.clientId._id,
          })
            .sort({ createdAt: -1 })
            .limit(5);
        }

        if (visit.staffId?._id) {
          lastGPS = await GPSLog.findOne({
            staffId: visit.staffId._id,
          }).sort({ timestamp: -1 });
        }
      } catch (innerErr) {
        // Fail gracefully if AI/GPS modules not wired yet
        console.warn("AI/GPS lookup failed:", innerErr.message);
      }

      return res.json({
        visit,
        aiInsights: insights,
        lastGPS,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching visit details",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // STAFF: START VISIT (CLOCK-IN)
  // -----------------------------------------------------
  async startVisit(req, res) {
    try {
      const visitId = req.params.id;
      const staffId = req.user.staffId;
      const { lat, lng } = req.body; // GPS from app/web

      const visit = await Visit.findById(visitId);

      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }

      if (visit.staffId.toString() !== staffId.toString()) {
        return res.status(403).json({ message: "Not your visit" });
      }

      if (visit.actualStart) {
        return res.status(400).json({ message: "Visit already started" });
      }

      visit.actualStart = new Date();
      visit.status = "in-progress";

      visit.gpsVerification.start = {
        lat,
        lng,
        timestamp: new Date(),
      };

      await visit.save();

      return res.json({
        message: "Visit started",
        visit,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error starting visit",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // STAFF: END VISIT (CLOCK-OUT)
  // Includes basic anomaly detection + AI summary placeholder
  // -----------------------------------------------------
  async endVisit(req, res) {
    try {
      const visitId = req.params.id;
      const staffId = req.user.staffId;
      const { lat, lng } = req.body;

      const visit = await Visit.findById(visitId).populate("clientId");

      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }

      if (visit.staffId.toString() !== staffId.toString()) {
        return res.status(403).json({ message: "Not your visit" });
      }

      if (!visit.actualStart) {
        return res.status(400).json({ message: "Visit not started yet" });
      }

      visit.actualEnd = new Date();
      visit.status = "completed";

      visit.gpsVerification.end = {
        lat,
        lng,
        timestamp: new Date(),
      };

      // Duration in minutes
      const durationMinutes = Math.round(
        (visit.actualEnd - visit.actualStart) / 60000
      );

      // Basic anomaly detection
      const anomalies = [];

      // 1. Visit too short
      if (durationMinutes < 5) {
        anomalies.push("short-visit");
      }

      // 2. Visit too long compared to scheduled duration
      const scheduledDuration =
        (visit.scheduledEnd - visit.scheduledStart) / 60000;

      if (durationMinutes > scheduledDuration * 2) {
        anomalies.push("long-visit");
      }

      // 3. GPS missing
      if (!lat || !lng) {
        anomalies.push("gps-missing");
      }

      visit.anomalies = anomalies;

      // Placeholder: AI visit summary to be generated by AI engine later
      visit.aiSummary = "AI summary pending generation";

      await visit.save();

      return res.json({
        message: "Visit completed",
        visit,
        durationMinutes,
        anomalies,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error ending visit",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // STAFF: GET TASKS FOR A VISIT
  // -----------------------------------------------------
  async getVisitTasks(req, res) {
    try {
      const visitId = req.params.id;
      const staffId = req.user.staffId;

      const visit = await Visit.findById(visitId);

      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }

      if (visit.staffId.toString() !== staffId.toString()) {
        return res.status(403).json({ message: "Not your visit" });
      }

      return res.json(visit.tasks);
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching tasks",
        error: err.message,
      });
    }
  },

  // -----------------------------------------------------
  // STAFF: COMPLETE A TASK
  // -----------------------------------------------------
  async completeTask(req, res) {
    try {
      const visitId = req.params.id;
      const taskId = req.params.taskId;
      const staffId = req.user.staffId;

      const visit = await Visit.findById(visitId);

      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }

      if (visit.staffId.toString() !== staffId.toString()) {
        return res.status(403).json({ message: "Not your visit" });
      }

      const task = visit.tasks.id(taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.completed) {
        return res.status(400).json({ message: "Task already completed" });
      }

      task.completed = true;
      task.completedAt = new Date();

      await visit.save();

      return res.json({
        message: "Task completed",
        task,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error completing task",
        error: err.message,
      });
    }
  },
};