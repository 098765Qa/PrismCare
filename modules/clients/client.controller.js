const Client = require("./client.model");

module.exports = {
  async createClient(req, res) {
    try {
      const client = await Client.create(req.body);
      return res.status(201).json(client);
    } catch (err) {
      return res.status(500).json({ message: "Error creating client", error: err.message });
    }
  },

  async getAllClients(req, res) {
    try {
      const clients = await Client.find().sort({ createdAt: -1 });
      return res.json(clients);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching clients", error: err.message });
    }
  },

  async getClientById(req, res) {
    try {
      const client = await Client.findById(req.params.id);
      if (!client) return res.status(404).json({ message: "Client not found" });
      return res.json(client);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching client", error: err.message });
    }
  },

  async updateClient(req, res) {
    try {
      const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!client) return res.status(404).json({ message: "Client not found" });
      return res.json(client);
    } catch (err) {
      return res.status(500).json({ message: "Error updating client", error: err.message });
    }
  },

  async deleteClient(req, res) {
    try {
      const client = await Client.findByIdAndDelete(req.params.id);
      if (!client) return res.status(404).json({ message: "Client not found" });
      return res.json({ message: "Client deleted" });
    } catch (err) {
      return res.status(500).json({ message: "Error deleting client", error: err.message });
    }
  },
};