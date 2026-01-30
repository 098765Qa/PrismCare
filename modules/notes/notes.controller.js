const Note = require('./notes.model');

module.exports = {
  async createNote(req, res) {
    try {
      const note = await Note.create(req.body);
      return res.status(201).json(note);
    } catch (err) {
      return res.status(500).json({ message: 'Error creating note', error: err.message });
    }
  },

  async getClientNotes(req, res) {
    try {
      const notes = await Note.find({ clientId: req.params.clientId });
      return res.json(notes);
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching notes', error: err.message });
    }
  },

  async deleteNote(req, res) {
    try {
      const note = await Note.findByIdAndDelete(req.params.id);
      if (!note) return res.status(404).json({ message: 'Note not found' });
      return res.json({ message: 'Note deleted' });
    } catch (err) {
      return res.status(500).json({ message: 'Error deleting note', error: err.message });
    }
  },
};
