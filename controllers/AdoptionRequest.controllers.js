const AdoptionRequest = require('../models/AdoptionRequest');
const CartPet = require('../models/CartPet');
const Pet = require('../models/Pet');

const createAdoptionRequest = async (req, res) =>  {
    try {
        const { petId, name, address, phoneNumber, cccd } = req.body;

        const vaildPhoneNumber = /^\d{10}$/;
        if (!vaildPhoneNumber.test(phoneNumber)) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        const vaildCCCD = /^\d{12}$/;
        if (!vaildCCCD.test(cccd)) {
            return res.status(400).json({ message: 'Invalid cccd format' });
        }

        const checkExistAdoptionRequest = await AdoptionRequest.findOne({ pet: petId, user: req.userId, status: 'approved' });
        if (checkExistAdoptionRequest) {
            return res.status(400).json({ message: 'You already have an adoption request for this pet' });
        }

        const adoptionRequest = new AdoptionRequest({
            pet: petId,
            name,
            address,
            phoneNumber,
            cccd,
            user: req.userId
        });

        const cartPet = new CartPet({
            userId: req.userId,
            petId
        });


        await cartPet.save();

        const savedAdoptionRequest = await adoptionRequest.save();
        res.status(201).json({ message: 'Adoption request created successfully', data: savedAdoptionRequest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create adoption request', error });
    }
}

// get All
const getAllAdoptionRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const userRole = req.userRole;

        if(userRole === 'admin') {
            const adoptionRequests = await AdoptionRequest.find();
            res.status(200).json({ data: adoptionRequests, message: 'Adoption requests retrieved successfully' });
            return;
        }
        const adoptionRequests = await AdoptionRequest.find({ user: userId });
        res.status(200).json({ data: adoptionRequests, message: 'Adoption requests retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get adoption requests', error });
    }
}

// get by id
const getAdoptionRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const adoptionRequest = await AdoptionRequest.findById(id);
        if (!adoptionRequest) {
            return res.status(404).json({ message: 'Adoption request not found' });
        }
        res.status(200).json({ data: adoptionRequest, message: 'Adoption request retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get adoption request', error });
    }
}

// Update status of an adoption request
const updateStatusAdoptionRequest = async (req, res) => {
    try {
        const { id, status: newStatus } = req.body;

        const adoptionRequest = await AdoptionRequest.findByIdAndUpdate(
            { _id: id },
            { status: newStatus },
            { new: true }
        );

        if (!adoptionRequest) {
            return res.status(404).json({ message: 'Adoption request not found' });
        }

        const { pet: petId, user: userId } = adoptionRequest;

        if (newStatus === 'approved') {
            await CartPet.findOneAndUpdate(
                { userId, petId },
                { $set: { status: 'approved' } }
            );
            await Pet.findOneAndUpdate(
                { _id: petId },
                { $set: { status: 'adopted' } }
            )

        } else if (newStatus === 'rejected') {
            await CartPet.findOneAndUpdate(
                { userId, petId },
                { $set: { status: 'rejected' } }
            );
            await Pet.findOneAndUpdate(
                { _id: petId },
                { $set: { status: 'available' } }
            )
        } else if (newStatus === 'pending') {
            await CartPet.findOneAndUpdate(
                { userId, petId },
                { $set: { status: 'pending' } }
            );
            await Pet.findOneAndUpdate(
                { _id: petId },
                { $set: { status: 'available' } }
            )
        }

        res.status(200).json({ message: 'Adoption request status updated successfully', data: adoptionRequest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update adoption request status', error });
    }
}


const countDay = async (req, res) => {
    try {
        const adoptionRequests = await AdoptionRequest.find();
        adoptionRequests.forEach(async (request) => {
            if(request.status === 'approved' || request.status === 'rejected') {
                request.countDay += 1;
                await request.save();
            }
            if(request.countDay === 7) {
                await request.remove();
            }
        })
        res.status(200).json({ message: 'Count day successfully', data: adoptionRequests });
    } catch (error) {
        res.status(500).json({ message: 'Failed to count day', error });
    }
}


module.exports = {
    createAdoptionRequest, getAllAdoptionRequest, updateStatusAdoptionRequest, countDay, getAdoptionRequestById
}
