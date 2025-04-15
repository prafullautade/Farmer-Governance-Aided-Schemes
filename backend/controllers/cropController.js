// cropController.js
const admin = require('firebase-admin');
const db = admin.firestore();

exports.getCrops = async (req, res) => {
  try {
    const cropsSnapshot = await db.collection('crops').get();
    const crops = [];
    cropsSnapshot.forEach(doc => {
      crops.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(crops);
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
};

exports.createCrop = async (req, res) => {
  const { cropName, season, cropType } = req.body;

  if (!cropName || !season || !cropType) {
    return res.status(400).json({ error: 'All fields are required for creating a crop' });
  }

  try {
    const docRef = await db.collection('crops').add({ cropName, season, cropType });
    res.status(201).json({ message: 'Crop created successfully', id: docRef.id });
  } catch (error) {
    console.error('Error creating crop:', error);
    res.status(500).json({ error: 'Failed to create crop' });
  }
};

exports.updateCrop = async (req, res) => {
  const { cropName, season, cropType } = req.body;
  const { id } = req.params;

  if (!cropName || !season || !cropType) {
    return res.status(400).json({ error: 'All fields are required for updating a crop' });
  }

  try {
    const cropRef = db.collection('crops').doc(id);
    await cropRef.update({ cropName, season, cropType });
    res.status(200).json({ message: 'Crop updated successfully' });
  } catch (error) {
    console.error('Error updating crop:', error);
    res.status(500).json({ error: 'Failed to update crop' });
  }
};

exports.deleteCrop = async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('crops').doc(id).delete();
    res.status(200).json({ message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).json({ error: 'Failed to delete crop' });
  }
};
