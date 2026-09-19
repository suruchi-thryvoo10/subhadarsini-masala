import { Dealer } from '../models/Dealer.js';
export const getDealers = async (req, res, next) => {
    try {
        const { state, city, pincode, search } = req.query;
        const query = { isActive: true };
        if (state)
            query.state = { $regex: String(state), $options: 'i' };
        if (city)
            query.city = { $regex: String(city), $options: 'i' };
        if (pincode)
            query.pincode = String(pincode);
        if (search) {
            query.$or = [
                { name: { $regex: String(search), $options: 'i' } },
                { address: { $regex: String(search), $options: 'i' } },
                { city: { $regex: String(search), $options: 'i' } }
            ];
        }
        const dealers = await Dealer.find(query).sort({ state: 1, city: 1 });
        res.status(200).json({
            success: true,
            data: dealers
        });
    }
    catch (error) {
        next(error);
    }
};
