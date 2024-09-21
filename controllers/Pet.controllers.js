const Pet = require('../models/Pet');
const Media = require('../models/Media');

// Add a new pet
const addPet = async (req, res) => {
    try {
        const { name, sex, breed, vaccinated, healthStatus, image_id } = req.body;
        const mediaExits = await Media.findOne({ id: image_id });
        if (!mediaExits) {
            return res.status(404).json({ message: 'Media not found' });
        };
        const newPet = new Pet({
            name,
            sex,
            breed,
            vaccinated,
            healthStatus,
            image_id
        });

        const savedPet = await newPet.save();

        savedPet.id = savedPet._id;
        savedPet._doc.id = savedPet._id;
        delete savedPet._doc._id;

        res.status(201).json({ message: 'Pet added successfully', data: savedPet });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add pet', error });
    }
};

// Update a pet by id
const updatePet = async (req, res) => {
    try {
        const { id, ...updates } = req.body;

        const updatedPet = await Pet.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json({ message: 'Pet updated successfully', pet: updatedPet });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update pet', error });
    }
};

// Delete a pet by id
const deletePet = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Pet.findByIdAndUpdate(id, { deleted: true }, { new: true });
        if (!result) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json({ message: 'Pet marked as deleted', pet: result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete pet', error });
    }
};

// Get pet details by id
const getPetDetail = async (req, res) => {
    try {
        const { id } = req.body

        const pet = await Pet.findById(id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json({ pet });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get pet details', error });
    }
};

// Get all pets
const getAllPets = async (req, res) => {
    try {
        const pets = await Pet.find({ deleted: { $ne: true } });
        const petDetails = await Promise.all(pets.map(async (pet) => {
            const petObj = pet.toObject();
            petObj.id = petObj._id;
            delete petObj._id;

            const media = await Media.findOne({ id: petObj.image_id });
            if (media) {
                petObj.image = {
                    id: media.id,
                    url: media.url
                };
            } else {
                petObj.image = {
                    id: petObj.image_id,
                    url: null
                };
            }

            delete petObj.image_id;
            return petObj;
        }));

        // Return response
        res.status(200).json({ data: petDetails });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get pets', error });
    }
};


// Get pets by query
const getPetsByQuery = async (req, res) => {
    try {
        const query = req.query;
        const pets = await Pet.find({ ...query, deleted: { $ne: true } }); // Exclude deleted pets
        res.status(200).json({ data: pets });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get pets', error });
    }
};

module.exports = {
    addPet,
    updatePet,
    deletePet,
    getPetDetail,
    getAllPets,
    getPetsByQuery
};
