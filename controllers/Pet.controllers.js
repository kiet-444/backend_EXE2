const Pet = require('../models/Pet');
const Media = require('../models/Media');

// Add a new pet
const addPet = async (req, res) => {
    try {
        const { name, description, species, coatColor,  age, sex, breed, vaccinated, healthStatus, image_id, quantity, location, keywords } = req.body;
        const mediaExits = await Media.findOne({ id: image_id });
        if (!mediaExits) {
            return res.status(404).json({ message: 'Media not found' });
        };
        const newPet = new Pet({
            name,
            description,
            age,
            sex,
            species,
            coatColor,
            breed,
            vaccinated,
            healthStatus,
            image_id,
            quantity,
            location,
            keywords
        });

        const savedPet = await newPet.save();

        res.status(201).json({ message: 'Pet added successfully', data: savedPet });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add pet', error });
    }
};

// Update a pet by id
const updatePet = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ params
        const updates = req.body;

        const updatedPet = await Pet.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json({ message: 'Pet updated successfully', pet: updatedPet });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update pet', error: error.message });
    }
};

// Delete a pet by id
const deletePet = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Pet.findByIdAndUpdate({_id: id}, { deleted: true }, { new: true });
        if (!result) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json({ message: 'Pet marked as deleted', pet: result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete pet', error });
    }
};

const getPetDetail = async (req, res) => {
    try {
        console.log("Check");
        const { id } = req.params;

        const pet = await Pet.findById({ _id: id });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        const returnPet = pet.toObject();

        const media = await Media.findOne({ id: returnPet.image_id });
        if (media) {
            returnPet.image = {
                id: media.id,
                url: media.url
            };
        } else {
            returnPet.image = {
                id: returnPet.image_id,
                url: null
            };
        }

        delete returnPet.image_id;

        res.status(200).json({ data: returnPet, message: 'Pet retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get pet details', error });
    }
};


// Get all pets
const getAllPets = async (req, res) => {
    try {
        const { page = 1, limit = 15 } = req.query;

        const skip = (page - 1) * limit;

        const pets = await Pet.find({ deleted: false })
            .skip(skip) 
            .limit(Number(limit)); 
        
        const totalPets = await Pet.countDocuments({ deleted: false });

        const petDetails = await Promise.all(pets.map(async (pet) => {
            const petObj = pet.toObject();
            
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
        res.status(200).json({ data: petDetails, currentPage: page, totalPages: Math.ceil(totalPets / limit), totalPets });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get pets', error });
    }
};


// Get pets by query
const getPetsByQuery = async (req, res) => {
    try {
        const { search, name, breed, species, coatColor, vaccinated, sex, page = 1, limit = 15 } = req.query;
        
        const query = { deleted: false };
        const skip = (page - 1) * limit;

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (name) query.name = { $regex: name, $options: "i" };

        if (breed) query.breed = { $regex: breed, $options: "i" };

        if (vaccinated) {
            if (vaccinated.includes('-')) { 
                const [min, max] = vaccinated.split('-').map(Number);
                query.vaccinated = { $gte: min, $lte: max };
            } else { 
                query.vaccinated = Number(vaccinated);
            }
        }
        
        // if (vaccinated) query.vaccinated = { $regex: vaccinated, $options: "i" };
        if (species) query.species = { $regex: species, $options: "i" };
        if (coatColor) query.coatColor = { $regex: coatColor, $options: "i" };
        if (sex) query.sex = { $regex: sex, $options: "i" };

        console.log(query);

        

        const pets = await Pet.find(query)
            .skip(skip)
            .limit(Number(limit));
        
        const totalPets = await Pet.countDocuments(query);

        const petDetails = await Promise.all(pets.map(async (pet) => {
            const petObj = pet.toObject();
            
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
        
        res.status(200).json({
            data: petDetails,
            currentPage: page,
            totalPages: Math.ceil(totalPets / limit),
            totalPets
        });
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
