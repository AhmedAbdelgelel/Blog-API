const fs = require('fs').promises;
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllCases = asyncHandler(async (req, res, next) => {
    try {
        const rapeCases = JSON.parse(await fs.readFile('cases.json', 'utf8'));
        const trafficCases = JSON.parse(await fs.readFile('traffic_accidents.json', 'utf8'));
        
        res.json({
            rape_cases: rapeCases.rape_cases,
            traffic_accidents: trafficCases.traffic_accidents
        });
    } catch (error) {
        next(new AppError('خطأ في قراءة البيانات', 500));
    }
});

exports.getCaseById = asyncHandler(async (req, res, next) => {
    try {
        const cases = JSON.parse(await fs.readFile('cases.json', 'utf8'));
        const caseId = req.params.id;
        let foundCase = null;

        Object.values(cases.rape_cases).forEach(category => {
            Object.values(category).forEach(caseItem => {
                if (caseItem.id === caseId) {
                    foundCase = caseItem;
                }
            });
        });

        if (foundCase) {
            res.json(foundCase);
        } else {
            next(new AppError('لم يتم العثور على القضية', 404));
        }
    } catch (error) {
        next(new AppError('خطأ في قراءة البيانات', 500));
    }
});
