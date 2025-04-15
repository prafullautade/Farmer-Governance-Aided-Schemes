const admin = require('firebase-admin');
const db = admin.firestore();

// Get all schemes
exports.getSchemes = async (req, res) => {
  try {
    const snapshot = await db.collection('schemes').get();
    const schemes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(schemes);
  } catch (error) {
    res.status(500).send('Error getting schemes: ' + error.message);
  }
};

// Create a new scheme
exports.createScheme = async (req, res) => {
  const { schemeName, description, eligibility } = req.body;
  try {
    const newDoc = await db.collection('schemes').add({ schemeName, description, eligibility });
    const newScheme = { id: newDoc.id, schemeName, description, eligibility };
    res.status(201).json(newScheme);
  } catch (error) {
    res.status(500).send('Error creating scheme: ' + error.message);
  }
};

// Update a scheme
exports.updateScheme = async (req, res) => {
  const { schemeName, description, eligibility } = req.body;
  const schemeId = req.params.id;

  try {
    const docRef = db.collection('schemes').doc(schemeId);
    await docRef.update({ schemeName, description, eligibility });
    const updatedDoc = await docRef.get();
    res.json({ id: schemeId, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).send('Error updating scheme: ' + error.message);
  }
};

// Delete a scheme
exports.deleteScheme = async (req, res) => {
  const schemeId = req.params.id;
  try {
    await db.collection('schemes').doc(schemeId).delete();
    res.status(200).send('Scheme deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting scheme: ' + error.message);
  }
};
