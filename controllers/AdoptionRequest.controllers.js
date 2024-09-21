const AdoptionRequest = require('../models/AdoptionRequest');

const createAdoptionRequest = async (req, res) =>  {
    try {
        const { petId, name, address, phoneNumber, cccd, userId } = req.body;

        const adoptionRequest = new AdoptionRequest({
            pet: petId,
            name,
            address,
            phoneNumber,
            cccd,
            user: userId
        });

        const savedAdoptionRequest = await adoptionRequest.save();
        res.status(201).json({ message: 'Adoption request created successfully', data: savedAdoptionRequest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create adoption request', error });
    }
}

module.exports = {
    createAdoptionRequest
}
