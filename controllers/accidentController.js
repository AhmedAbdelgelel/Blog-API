const fs = require('fs').promises;
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getAccidentById = asyncHandler(async (req, res, next) => {
    try {
        const accidents = JSON.parse(await fs.readFile('traffic_accidents.json', 'utf8'));
        const accidentId = req.params.id;
        let foundAccident = null;

        Object.values(accidents.traffic_accidents).forEach(category => {
            Object.values(category).forEach(accident => {
                if (accident.id === accidentId) {
                    foundAccident = accident;
                }
            });
        });

        if (foundAccident) {
            res.json(foundAccident);
        } else {
            next(new AppError('لم يتم العثور على الحادث', 404));
        }
    } catch (error) {
        next(new AppError('خطأ في قراءة البيانات', 500));
    }
});

exports.getAllAccidents = asyncHandler(async (req, res, next) => {
    try {
        const accidents = JSON.parse(await fs.readFile('traffic_accidents.json', 'utf8'));
        res.json(accidents.traffic_accidents);
    } catch (error) {
        next(new AppError('خطأ في قراءة البيانات', 500));
    }
});
