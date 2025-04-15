const admin = require('firebase-admin');
const db = admin.firestore();

// POST /api/applications/
const applyScheme = async (req, res) => {
  const { schemeId, userId } = req.body;

  if (!schemeId || !userId) {
    return res.status(400).json({ error: 'Missing schemeId or userId' });
  }

  try {
    const existingApp = await db.collection('applications')
      .where('schemeId', '==', schemeId)
      .where('userId', '==', userId)
      .get();

    if (!existingApp.empty) {
      return res.status(409).json({ message: 'You have already applied for this scheme.' });
    }

    await db.collection('applications').add({
      schemeId,
      userId,
      status: 'Pending',
      appliedAt: new Date().toISOString()
    });

    return res.status(200).json({ message: 'Application submitted successfully.' });

  } catch (error) {
    console.error('Error applying for scheme:', error);
    return res.status(500).json({ error: 'Failed to apply for the scheme.' });
  }
};

// GET /api/applications/:userId
const getApplicationStatus = async (req, res) => {
  const uid = req.user?.uid;

  if (!uid) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const snapshot = await db.collection('applications')
      .where('userId', '==', uid)
      .get();

    const applications = [];

    for (const doc of snapshot.docs) {
      const applicationData = doc.data();
      let schemeName = 'Unknown Scheme';

      try {
        const schemeDoc = await db.collection('schemes').doc(applicationData.schemeId).get();
        if (schemeDoc.exists) {
          const schemeData = schemeDoc.data();
          schemeName = schemeData.name || schemeData.schemeName || 'Unnamed Scheme';
        }
      } catch (err) {
        console.error('Error fetching scheme name:', err);
      }

      applications.push({
        id: doc.id,
        schemeId: applicationData.schemeId,
        status: applicationData.status,
        appliedAt: applicationData.appliedAt,
        schemeName
      });
    }

    return res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching application status:', error);
    return res.status(500).json({ error: 'Failed to fetch application status.' });
  }
};

// PATCH /api/applications/:applicationId
const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const appRef = db.collection('applications').doc(applicationId);
    const appDoc = await appRef.get();

    if (!appDoc.exists) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await appRef.update({
      status,
      reviewedAt: new Date().toISOString()
    });

    return res.status(200).json({ message: `Application ${status.toLowerCase()} successfully.` });
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({ message: 'Failed to update application status.' });
  }
};

// GET /api/applications/all
const getAllApplications = async (req, res) => {
  try {
    const snapshot = await db.collection('applications').get();
    const applications = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      let schemeName = 'Unknown Scheme';
      let userName = 'Unknown User';

      try {
        const schemeDoc = await db.collection('schemes').doc(data.schemeId).get();
        if (schemeDoc.exists) {
          schemeName = schemeDoc.data().name || schemeDoc.data().schemeName || 'Unnamed Scheme';
        }
      } catch (err) {
        console.error('Error fetching scheme name:', err);
      }

      try {
        const userDoc = await db.collection('users').doc(data.userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          userName = userData.name || userData.username || 'Unnamed User';
        }
      } catch (err) {
        console.error('Error fetching user name:', err);
      }

      applications.push({
        id: doc.id,
        ...data,
        schemeName,
        userName
      });
    }

    return res.status(200).json(applications);
  } catch (err) {
    console.error('Error getting all applications:', err);
    return res.status(500).json({ message: 'Error retrieving applications' });
  }
};

module.exports = {
  applyScheme,
  getApplicationStatus,
  updateApplicationStatus,
  getAllApplications
};
